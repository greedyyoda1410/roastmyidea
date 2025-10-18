# Authentication Setup Guide

## Overview

RoastMyIdea.AI supports optional email/password authentication via Supabase. Users can use the app without signing in, but authenticated users get additional benefits:

- ✅ Roasts are associated with their profile
- ✅ File uploads are linked to their account
- ✅ Can view their roast history (future feature)
- ✅ Profile displayed on leaderboard (optional)

## Supabase Email Auth Setup (2 Minutes)

### Step 1: Enable Email Authentication

**Good news:** Email authentication is enabled by default in Supabase! No configuration needed.

### Step 2: Configure Email Templates (Optional)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wmjkfjcmtimhrmujkbbc

2. Navigate to **Authentication** → **Email Templates**

3. Customize the confirmation email template if desired (or keep default)

### Step 3: Configure URL Settings

1. Go to **Authentication** → **URL Configuration**

2. Set **Site URL** to:
   ```
   http://localhost:3000
   ```

3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/**
   ```

4. Click **Save**

### Step 4: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000

3. Click **"Sign In"** in the top right

4. Click **"Need an account? Sign Up"**

5. Enter your details:
   - Full Name
   - Email
   - Password (minimum 6 characters)

6. Click **"Sign Up"**

7. Check your email for confirmation link

8. Click the link to verify your account

9. Return to the app and sign in with your credentials

10. Your name should appear in the header!

## How It Works

### User Flow

**Sign Up:**
```
[User clicks "Sign In" → "Need an account? Sign Up"]
         ↓
[Enters full name, email, password]
         ↓
[Clicks "Sign Up"]
         ↓
[Supabase sends confirmation email]
         ↓
[User clicks email link to verify]
         ↓
[Account activated]
```

**Sign In:**
```
[User clicks "Sign In"]
         ↓
[Enters email and password]
         ↓
[Clicks "Sign In"]
         ↓
[Session created and stored]
         ↓
[Modal closes, profile appears in header]
```

### Code Architecture

#### Auth Functions (`src/lib/auth.ts`)

```typescript
// Sign in with email/password
signInWithEmail(email, password) → creates session

// Sign up with email/password
signUpWithEmail(email, password, fullName) → creates account

// Sign out
signOut() → clears session

// Get current user
getCurrentUser() → returns User | null

// Listen to auth changes
onAuthStateChange(callback) → subscribes to auth events
```

#### Database Schema

```sql
-- Roasts table with optional user_id
CREATE TABLE roasts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- null if anonymous
  project_name TEXT NOT NULL,
  idea_text TEXT NOT NULL,
  -- ... other fields
);
```

### Anonymous vs Authenticated Usage

| Feature | Anonymous User | Authenticated User |
|---------|----------------|-------------------|
| Submit ideas | ✅ Yes | ✅ Yes |
| Get roasts | ✅ Yes | ✅ Yes |
| View leaderboard | ✅ Yes | ✅ Yes |
| File uploads | ✅ Yes | ✅ Yes (associated) |
| Roast history | ❌ No | ✅ Yes (future) |
| Profile on leaderboard | ❌ Anonymous | ✅ With name |

## Security Considerations

### Row Level Security (RLS)

The database uses RLS policies to control access:

```sql
-- Public can read all roasts
CREATE POLICY "Allow public read access on roasts" ON roasts
  FOR SELECT USING (true);

-- Anyone can insert roasts (authenticated or not)
CREATE POLICY "Allow public insert on roasts" ON roasts
  FOR INSERT WITH CHECK (true);

-- Users can only update their own roasts (future feature)
CREATE POLICY "Allow users to update own roasts" ON roasts
  FOR UPDATE USING (auth.uid() = user_id);
```

### Privacy

- **Anonymous users**: No data is stored about them
- **Authenticated users**: Only Google profile data (name, email, avatar)
- **User IDs**: Stored as UUIDs, not emails
- **Roasts**: Public by default for leaderboard

## Troubleshooting

### "Sign In" button doesn't work

1. Check that email authentication is enabled in Supabase (it's on by default)
2. Verify Supabase URL and keys in `.env.local`
3. Check browser console for errors
4. Make sure development server is running

### User doesn't stay signed in

1. Check that cookies are enabled in browser
2. Verify Supabase URL is correct
3. Check that session is being stored correctly

### Email confirmation not received

1. Check spam/junk folder
2. Verify email is correct
3. Check Supabase Email Templates are configured
4. For development, you can disable email confirmation in Supabase settings

## Testing Authentication

### Manual Testing

1. **Test anonymous flow:**
   - Don't sign in
   - Submit a roast
   - Verify it works without authentication

2. **Test authenticated flow:**
   - Click "Sign In" and create account
   - Verify confirmation email
   - Sign in with credentials
   - Submit a roast
   - Verify user profile appears in header
   - Check database to see user_id is associated

3. **Test sign out:**
   - Click "Sign Out"
   - Verify user profile disappears
   - Verify app still works anonymously

### Automated Testing

```bash
# Run auth tests (when implemented)
npm run test:auth
```

## Production Deployment

When deploying to Vercel:

1. Add environment variables in Vercel dashboard
2. Update redirect URLs to include production domain
3. Update site URL in Supabase to production URL
4. Test authentication on production

---

*For more information, see [SETUP.md](../SETUP.md) and [FEATURES.md](FEATURES.md)*
