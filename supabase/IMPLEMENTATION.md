# Implementing Supabase Row Level Security Policies

This document provides guidance on implementing the Row Level Security (RLS) policies for the Supabase database.

## Prerequisites

Before applying the RLS policies, ensure that:

1. You have created all the necessary tables in your Supabase database with the schema that matches the one defined in `shared/schema.ts`
2. The users table has an `auth_id` column that will store the Supabase Auth UUID for each user
3. You have administrator access to your Supabase project

## Implementation Steps

### 1. Database Schema Alignment

Ensure your database schema aligns with the application schema:

- Users table must have an `auth_id` column (UUID type) that links to the Supabase Auth `auth.uid()`
- All tables requiring RLS should have a `restaurant_id` column to identify ownership

### 2. Apply RLS Policies

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `rls_policies.sql` 
4. Paste into the SQL Editor and execute

### 3. Update the Client-Server Integration

The application has been updated to handle the Supabase Auth integration:

- `client/src/lib/auth.ts` now stores the Supabase Auth UUID in the AuthUser object
- `server/storage.ts` has a new `getUserByAuthId` method to lookup users by their Supabase Auth ID
- The schema in `shared/schema.ts` now includes an `authId` field in the users table

### 4. Configuring User Sign-up Process

When a new user signs up through Supabase Auth, ensure:

1. The user's Supabase Auth UUID (`auth.uid()`) is stored in the `auth_id` column of the users table
2. The user is assigned an appropriate role in the `role` column
3. The user is associated with a restaurant if applicable via the `restaurant_id` column

### 5. Testing the Policies

After implementation, test that:

1. Users can only access data from their own restaurant
2. Role-based restrictions are enforced (e.g., only SuperAdmin can access certain data)
3. Users can only modify their own data where appropriate

## Troubleshooting

If you encounter issues with your RLS policies:

1. Check the Supabase logs for any policy-related errors
2. Verify that the policy names aren't conflicting
3. Ensure the helper functions are created correctly
4. Test the policies with different user roles to ensure they work as expected

## Maintenance

For future schema changes:

1. Update the schema in `shared/schema.ts`
2. Generate a migration using Drizzle 
3. Update the RLS policies as needed
4. Test the policies to ensure they work with the updated schema
