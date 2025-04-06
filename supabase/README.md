# Supabase Row Level Security (RLS) Policies

This directory contains SQL scripts to set up Row Level Security policies for your Supabase database tables.

## What are RLS Policies?

Row Level Security (RLS) policies in Supabase allow you to control access to rows in your database tables based on the authenticated user's claims or properties. This ensures that users can only access the data they're authorized to see or modify.

## RLS Policies in this Project

The `rls_policies.sql` script sets up the following security policies:

### Tools Table
- Users can only read tools for their restaurant
- Only SuperAdmin, Owner, and GM roles can insert, update, or delete tools

### Progress Logs Table
- Users can read only their own logs
- Restaurant admins (SuperAdmin, Owner, GM) can read all logs for their restaurant
- Users can create, update, and delete their own logs
- Admins can delete any logs for their restaurant

### Feedback Reviews Table
- Restaurant members can read feedback for their restaurant
- Restaurant members can write feedback
- Users can update/delete their own feedback
- Admins can update/delete any feedback for their restaurant

### Invites Table
- Only SuperAdmins can create, read all, update, or delete invites
- Restaurant owners/GMs can view invites for their restaurant

## How to Apply These Policies

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `rls_policies.sql`
4. Paste into the SQL Editor
5. Run the SQL script

## Important Notes

1. Make sure your database tables match the names in the SQL script
2. The users table must have an `auth_id` column that maps to `auth.uid()`
3. The users table must have a `role` column with values like 'SuperAdmin', 'Owner', 'GM', 'Staff'
4. Tables must have a `restaurant_id` column to identify which restaurant the data belongs to
5. Be sure to enable RLS for each table in the Supabase dashboard

## Testing Policies

After applying the policies, you should test them with different user roles to ensure they work as expected:

1. Sign in as different user types (SuperAdmin, Owner, GM, Staff)
2. Attempt to perform CRUD operations on each table
3. Verify that users can only access/modify data according to the policies
