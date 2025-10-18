# Authentication Setup Guide

## Overview

RoastMyIdea.AI supports optional Google OAuth authentication. Users can use the app without signing in, but authenticated users get additional benefits:

- ✅ Roasts are associated with their profile
- ✅ File uploads are linked to their account
- ✅ Can view their roast history (future feature)
- ✅ Profile displayed on leaderboard (optional)

## Supabase Auth Setup (5 Minutes)

### Step 1: Enable Google OAuth in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wmjkfjcmtimhrmujkbbc

2. Navigate to **Authentication** → **Providers** in the left sidebar

3. Find **Google** in the list of providers and click to expand

4. Click **Enable** toggle

### Step 2: Configure Google OAuth Credentials

You have two options:

#### Option A: Use Supabase's Google OAuth (Quickest)

1. In the Google provider settings, scroll down
2. You'll see Supabase's default Google OAuth client
3. Click **Save** - you're done! (Uses Supabase's credentials)

#### Option B: Use Your Own Google OAuth Credentials (Recommended for Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com)

2. Create a new project or select an existing one

3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Select **Web application**
   - Add authorized redirect URIs:
     ```
     https://wmjkfjcmtimhrmujkbbc.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - Click **Create**

5. Copy the Client ID and Client Secret

6. Back in Supabase Google Provider settings:
   - Paste **Client ID**
   - Paste **Client Secret**
   - Click **Save**

### Step 3: Configure Redirect URLs

In Supabase Authentication settings:

1. Go to **Authentication** → **URL Configuration**

2. Add site URL:
   ```
   http://localhost:3000
   ```

3. Add redirect URLs:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.vercel.app/auth/callback
   ```

4. Click **Save**

### Step 4: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000

3. Click **"Sign in with Google"** in the top right

4. You should be redirected to Google sign-in

5. After signing in, you should be redirected back to the app

6. Your profile picture and name should appear in the header

## How It Works

### User Flow

```
[User clicks "Sign in with Google"]
         ↓
[Redirected to Google OAuth]
         ↓
[User authorizes the app]
         ↓
[Redirected to /auth/callback]
         ↓
[Session exchanged and stored]
         ↓
[Redirected back to home page]
         ↓
[AuthButton shows user profile]
```

### Code Architecture

#### Auth Functions (`src/lib/auth.ts`)

```typescript
// Sign in with Google
signInWithGoogle() → redirects to Google OAuth

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

### "Sign in with Google" button doesn't work

1. Check that Google provider is enabled in Supabase
2. Verify redirect URLs are configured correctly
3. Check browser console for errors
4. Ensure `.env.local` has correct Supabase credentials

### User doesn't stay signed in

1. Check that cookies are enabled in browser
2. Verify Supabase URL is correct
3. Check that session is being stored correctly

### OAuth redirect error

1. Verify redirect URI in Google Cloud Console matches Supabase
2. Check that callback route exists at `/auth/callback`
3. Ensure Supabase Auth is properly configured

## Testing Authentication

### Manual Testing

1. **Test anonymous flow:**
   - Don't sign in
   - Submit a roast
   - Verify it works without authentication

2. **Test authenticated flow:**
   - Sign in with Google
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
