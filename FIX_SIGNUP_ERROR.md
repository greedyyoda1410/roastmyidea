# 🔧 Fix "Invalid API key" Sign-Up Error

## Problem
Users getting "Invalid API key" when trying to sign up with email/password.

## Root Cause
Supabase email authentication is not properly configured or email confirmation is required.

---

## ✅ Solution 1: Disable Email Confirmation (Recommended for MVP)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/providers
2. Click on **Email** provider

### Step 2: Configure Email Settings
Scroll down to **Email Settings** and configure:

```
✅ Enable Email provider
✅ Confirm email: DISABLE (uncheck this)
✅ Secure email change: DISABLE (optional, for easier testing)
```

### Step 3: Configure Email Templates (Optional but recommended)
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/templates
2. Update the templates if needed (the defaults usually work)

### Step 4: Save and Test
- Click **Save**
- Try signing up again - should work immediately!

---

## ✅ Solution 2: Enable Email Confirmation (Production Ready)

If you want email confirmation for security:

### Step 1: Configure Email Provider
Same as Solution 1, but:
```
✅ Enable Email provider
✅ Confirm email: ENABLE (check this)
```

### Step 2: Update AuthButton.tsx to Handle Confirmation
The code already shows a message: "Check your email for confirmation link!"

But update the error message to be clearer:

```typescript
// In AuthButton.tsx, the sign-up success message is already there:
if (isSignUp) {
  await signUpWithEmail(email, password, fullName);
  setAuthError('✅ Success! Check your email to confirm your account.');
}
```

### Step 3: Configure Site URL
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/url-configuration
2. Set **Site URL** to your Vercel domain: `https://your-app.vercel.app`
3. Add **Redirect URLs**: 
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)

---

## ✅ Solution 3: Check API Keys Are Correct

### Verify Environment Variables in Vercel:
1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables
2. Check these exist and are correct:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  (must be anon/public key, NOT service role)
```

### Common Mistake:
❌ Using `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
✅ Must use the **anon/public** key for client-side authentication

---

## 🧪 Test Sign-Up Flow

After applying fixes:

1. **Try signing up:**
   - Email: `test@example.com`
   - Password: `password123` (min 6 characters)
   - Should either:
     - ✅ Sign up immediately (if confirmation disabled)
     - ✅ Show "Check your email" message (if confirmation enabled)

2. **Check Supabase:**
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/users
   - Should see the new user listed

3. **Test app functionality:**
   - Try submitting an idea (should work even without sign-up)
   - Try signing in after sign-up

---

## 🔍 Debug Mode

If still not working, check browser console for specific error:

```javascript
// Open browser DevTools (F12)
// Look for errors like:
"Invalid API key" → Wrong anon key in Vercel env vars
"Email not confirmed" → Email confirmation required
"Invalid login credentials" → User doesn't exist or wrong password
"User already registered" → Email already exists, try signing in
```

---

## 💡 Recommended Settings for Your App

Since this is a hackathon judge app where **authentication is optional**, I recommend:

```
✅ Disable email confirmation (faster UX)
✅ Allow anonymous submissions (already implemented)
✅ Authentication is just for saving history (bonus feature)
```

This way:
- Users can use the app immediately without signing up
- Optional sign-up saves their roasts for later
- No friction for first-time users

---

## 🆘 Still Having Issues?

1. Check Supabase logs: https://supabase.com/dashboard/project/YOUR_PROJECT/logs/auth-logs
2. Check browser Network tab → Look for failed requests to Supabase
3. Verify the anon key in Vercel matches the one in Supabase dashboard
4. Try clearing browser cache and cookies
5. Test in incognito mode to rule out cached credentials

---

**Once configured, sign-up should work perfectly!** 🎉

**Remember**: The app works WITHOUT sign-up too, so authentication issues shouldn't block other users from using the core features.

