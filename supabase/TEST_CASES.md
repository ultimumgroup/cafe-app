# Test Cases for Supabase RLS Policies

This document outlines test cases to verify the correct implementation of Row Level Security (RLS) policies in your Supabase database.

## Preparation

1. Create at least the following test users in your Supabase Auth:
   - A SuperAdmin user
   - An Owner user for Restaurant A
   - A GM user for Restaurant A
   - A Staff user for Restaurant A
   - An Owner user for Restaurant B

2. Ensure you have sample data in your database:
   - Multiple restaurants
   - Users assigned to different restaurants with different roles
   - Tasks, tools, and other records assigned to different restaurants

## Test Cases by Table

### Users Table

No specific RLS policies are applied to the users table as this is primarily managed through your application logic.

### Tools Table

1. **Read Access**
   - Staff, GM, and Owner users can view tools only from their own restaurant
   - SuperAdmin can view tools from all restaurants

2. **Create Access**
   - Staff users cannot create new tools (should get permission denied)
   - GM, Owner, and SuperAdmin users can create tools for their restaurant

3. **Update Access**
   - Staff users cannot update tools (should get permission denied)
   - GM and Owner users can update tools only in their restaurant
   - SuperAdmin can update tools for any restaurant

4. **Delete Access**
   - Staff users cannot delete tools (should get permission denied)
   - GM and Owner users can delete tools only in their restaurant
   - SuperAdmin can delete tools for any restaurant

### Progress Logs Table

1. **Read Access**
   - Staff users can see only their own logs
   - GM, Owner, and SuperAdmin users can see all logs from their restaurant

2. **Create Access**
   - All users can create logs, but only for themselves (user_id must match)
   - The restaurant_id must match the user's restaurant

3. **Update Access**
   - Users can update only their own logs
   - Restaurant must match the user's restaurant

4. **Delete Access**
   - Users can delete only their own logs
   - GM, Owner, and SuperAdmin can delete any logs from their restaurant

### Feedback Reviews Table

1. **Read Access**
   - All restaurant members can see feedback for their restaurant

2. **Create Access**
   - All users can create feedback for their own restaurant
   - The user_id must match the authenticated user

3. **Update Access**
   - Users can update only their own feedback
   - GM, Owner, and SuperAdmin can update any feedback for their restaurant

4. **Delete Access**
   - Users can delete only their own feedback
   - GM, Owner, and SuperAdmin can delete any feedback for their restaurant

### Invites Table

1. **Read Access**
   - SuperAdmin can read all invites
   - Owner and GM can read invites only for their restaurant
   - Staff cannot read invites

2. **Create/Update/Delete Access**
   - Only SuperAdmin can create, update, or delete invites
   - All other roles should be denied

## SQL Test Queries

Here are some SQL queries you can run to test your policies:

### Test Restaurant Access Restriction

```sql
-- Run as Restaurant A user
SELECT * FROM tools WHERE restaurant_id = <restaurant_A_id>;
-- Should return tools from Restaurant A

-- Run as Restaurant A user
SELECT * FROM tools WHERE restaurant_id = <restaurant_B_id>;
-- Should return no results (even if tools exist)
```

### Test Role-Based Access

```sql
-- Run as Staff user
INSERT INTO tools (name, description, type, restaurant_id, created_by)
VALUES ('New Tool', 'Description', 'equipment', <user_restaurant_id>, <user_id>);
-- Should be denied

-- Run as GM user
INSERT INTO tools (name, description, type, restaurant_id, created_by)
VALUES ('New Tool', 'Description', 'equipment', <user_restaurant_id>, <user_id>);
-- Should succeed
```

### Test Log Access Restriction

```sql
-- Run as Staff user
SELECT * FROM logs WHERE user_id = <user_id>;
-- Should return only user's logs

-- Run as Staff user
SELECT * FROM logs WHERE user_id <> <user_id> AND restaurant_id = <user_restaurant_id>;
-- Should return no results

-- Run as GM user
SELECT * FROM logs WHERE restaurant_id = <user_restaurant_id>;
-- Should return all logs for that restaurant
```

### Test Invite Access

```sql
-- Run as Staff user
SELECT * FROM invites;
-- Should return no results

-- Run as GM user
SELECT * FROM invites WHERE restaurant_id = <user_restaurant_id>;
-- Should return invites for that restaurant

-- Run as SuperAdmin
SELECT * FROM invites;
-- Should return all invites
```

## Client-Side Testing

In addition to SQL testing, you should test your application's client-side functionality:

1. Log in as different user types and verify that they only see the data they're supposed to see
2. Try to create, update, and delete items to verify permissions are enforced
3. Test that users from one restaurant cannot access data from another restaurant
4. Verify that the role hierarchy is respected (e.g., Owner can do anything a GM can do)

## Edge Cases

Also test these edge cases:

1. **Cross-Restaurant Operations** - Attempt to assign a user or resource to a different restaurant
2. **Role Escalation** - Attempt to upgrade a user's role through unauthorized means
3. **Default Values** - Ensure that default values are correctly applied in RLS policies
4. **Null Values** - Test how policies handle null values in key fields (restaurant_id, etc.)
