-- Enable Row Level Security for all tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM users WHERE auth_id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user's restaurant_id
CREATE OR REPLACE FUNCTION get_user_restaurant_id()
RETURNS INT AS $$
DECLARE
  resto_id INT;
BEGIN
  SELECT restaurant_id INTO resto_id FROM users WHERE auth_id = auth.uid();
  RETURN resto_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is SuperAdmin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM users WHERE auth_id = auth.uid();
  RETURN user_role = 'SuperAdmin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

--------------------------------
-- Policies for tools table
--------------------------------

-- Policy: Allow users to read tools for their restaurant
CREATE POLICY tools_read_policy ON tools
  FOR SELECT
  USING (restaurant_id = get_user_restaurant_id());

-- Policy: Allow SuperAdmin, Owner, and GM to insert tools for their restaurant
CREATE POLICY tools_insert_policy ON tools
  FOR INSERT
  WITH CHECK (
    restaurant_id = get_user_restaurant_id() AND
    (get_user_role() IN ('SuperAdmin', 'Owner', 'GM'))
  );

-- Policy: Allow SuperAdmin, Owner, and GM to update tools for their restaurant
CREATE POLICY tools_update_policy ON tools
  FOR UPDATE
  USING (restaurant_id = get_user_restaurant_id() AND
         (get_user_role() IN ('SuperAdmin', 'Owner', 'GM')))
  WITH CHECK (restaurant_id = get_user_restaurant_id());

-- Policy: Allow SuperAdmin, Owner, and GM to delete tools for their restaurant
CREATE POLICY tools_delete_policy ON tools
  FOR DELETE
  USING (restaurant_id = get_user_restaurant_id() AND
         (get_user_role() IN ('SuperAdmin', 'Owner', 'GM')));

--------------------------------
-- Policies for progress_logs table
--------------------------------

-- Policy: Allow users to read their own logs
CREATE POLICY progress_logs_read_own_policy ON progress_logs
  FOR SELECT
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Policy: Allow restaurant admins to read all logs for their restaurant
CREATE POLICY progress_logs_read_restaurant_policy ON progress_logs
  FOR SELECT
  USING (
    restaurant_id = get_user_restaurant_id() AND
    get_user_role() IN ('SuperAdmin', 'Owner', 'GM')
  );

-- Policy: Allow users to create their own logs
CREATE POLICY progress_logs_insert_policy ON progress_logs
  FOR INSERT
  WITH CHECK (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) AND
    restaurant_id = get_user_restaurant_id()
  );

-- Policy: Allow users to update their own logs
CREATE POLICY progress_logs_update_policy ON progress_logs
  FOR UPDATE
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) AND
    restaurant_id = get_user_restaurant_id()
  );

-- Policy: Allow users to delete their own logs and admins to delete any logs
CREATE POLICY progress_logs_delete_policy ON progress_logs
  FOR DELETE
  USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    (restaurant_id = get_user_restaurant_id() AND get_user_role() IN ('SuperAdmin', 'Owner', 'GM'))
  );

--------------------------------
-- Policies for feedback_reviews table
--------------------------------

-- Policy: Allow restaurant members to read feedback for their restaurant
CREATE POLICY feedback_reviews_read_policy ON feedback_reviews
  FOR SELECT
  USING (restaurant_id = get_user_restaurant_id());

-- Policy: Allow restaurant members to write feedback for their restaurant
CREATE POLICY feedback_reviews_insert_policy ON feedback_reviews
  FOR INSERT
  WITH CHECK (
    restaurant_id = get_user_restaurant_id() AND
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Policy: Allow users to update their own feedback, admins can update any feedback
CREATE POLICY feedback_reviews_update_policy ON feedback_reviews
  FOR UPDATE
  USING (
    (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) AND restaurant_id = get_user_restaurant_id()) OR
    (restaurant_id = get_user_restaurant_id() AND get_user_role() IN ('SuperAdmin', 'Owner', 'GM'))
  )
  WITH CHECK (restaurant_id = get_user_restaurant_id());

-- Policy: Allow users to delete their own feedback, admins can delete any feedback
CREATE POLICY feedback_reviews_delete_policy ON feedback_reviews
  FOR DELETE
  USING (
    (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) AND restaurant_id = get_user_restaurant_id()) OR 
    (restaurant_id = get_user_restaurant_id() AND get_user_role() IN ('SuperAdmin', 'Owner', 'GM'))
  );

--------------------------------
-- Policies for invites table
--------------------------------

-- Policy: Only SuperAdmins can create invites
CREATE POLICY invites_insert_policy ON invites
  FOR INSERT
  WITH CHECK (is_super_admin());

-- Policy: Only SuperAdmins can read all invites
CREATE POLICY invites_read_all_policy ON invites
  FOR SELECT
  USING (is_super_admin());

-- Policy: Restaurant owners/GMs can view invites for their restaurant
CREATE POLICY invites_read_restaurant_policy ON invites
  FOR SELECT
  USING (
    restaurant_id = get_user_restaurant_id() AND
    get_user_role() IN ('Owner', 'GM')
  );

-- Policy: Only SuperAdmins can update invites
CREATE POLICY invites_update_policy ON invites
  FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Policy: Only SuperAdmins can delete invites
CREATE POLICY invites_delete_policy ON invites
  FOR DELETE
  USING (is_super_admin());
