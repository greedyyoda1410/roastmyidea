# 🔍 Debug: Invalid API Key Error

## Let's Check What's Actually Wrong

### Step 1: Verify Supabase Email Provider Settings

**Go to:** https://supabase.com/dashboard/project/YOUR_PROJECT/auth/providers

**You should see:**
```
Email provider: Enabled ✓
```

**Click on "Email"** - A side panel opens.

### What to Check in the Side Panel:

```
1. Enable Email provider: [✓] ← Must be checked
2. Enable email confirmations: [ ] ← Must be UNCHECKED!
```

**IMPORTANT:** The exact wording might be:
- "Confirm email" 
- "Enable email confirmations"
- "Require email confirmation"

All mean the same thing - **it must be OFF/unchecked**.

### Step 2: Check if Email Confirmations Are Actually Disabled

Run this test:
1. Try signing up with: `test-$(date +%s)@example.com` (use a new email each time)
2. After clicking "Sign Up", do you:
   - A) Get logged in immediately? ✅ Email confirmation is OFF (correct)
   - B) See "Check your email"? ❌ Email confirmation is still ON

### Step 3: Verify Your Vercel Environment Variables

**Critical check:** Make sure you're using the **anon key** not the service role key!

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Check `NEXT_PUBLIC_SUPABASE_ANON_KEY`:

**Correct (anon key):** Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...` and is relatively short (~300 chars)

**Wrong (service role key):** Much longer, also starts with `eyJ` but will cause "Invalid API key" for client-side auth

### How to Find Your Correct Keys:

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
2. Look for two keys:
   - **anon/public** (use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** (use this for `SUPABASE_SERVICE_ROLE_KEY`, NOT the public one!)

### Step 4: If Keys Are Wrong in Vercel

1. Update the environment variable in Vercel
2. **You MUST redeploy** after changing env vars:
   - Vercel → Deployments → Latest → ⋮ → Redeploy
   - Uncheck "Use existing Build Cache"

---

## Issue 2: "Vercel Needs Their Approval" - Access Control Issue

This is a **Vercel-specific issue**, not related to your database or Supabase!

### What This Means:

Vercel has a **Deployment Protection** feature enabled on your project.

### How to Fix:

**Go to:** https://vercel.com/dashboard → Your Project → Settings → Deployment Protection

**You'll see one of these:**

#### Option A: Standard Protection (default)
```
[ ] Standard Protection
    Only you and your team can access deployments
    
Select: [ ] Off ← Turn this OFF
```

#### Option B: Password Protection
```
[ ] Password Protection
    Anyone with the password can access
```

#### Option C: Vercel Authentication
```
[ ] Vercel Authentication  ← This is likely ON
    Users must log in with Vercel to access
```

### The Fix:

**Turn OFF all Deployment Protection options:**

1. Go to Settings → Deployment Protection
2. Set to: **"Off"** or **"Disabled"**
3. Click **Save**
4. No redeployment needed - takes effect immediately!

### Verify It's Fixed:

1. Ask your friend to refresh the page
2. OR send them the link in an incognito window
3. Should load without "approval" prompt

---

## Quick Summary:

| Issue | Fix | Requires Redeploy? |
|-------|-----|-------------------|
| Invalid API key | Fix Supabase email settings OR fix env var keys | Only if changing env vars |
| Vercel needs approval | Disable Deployment Protection in Vercel settings | No |

---

## 🔍 Let Me Know:

1. **For "Invalid API key":** 
   - Is "Confirm email" unchecked in Supabase?
   - Are you using the correct anon key in Vercel?

2. **For "Vercel needs approval":**
   - Do you see "Deployment Protection" in Vercel settings?
   - What's it currently set to?

Once you confirm these, I can help you fix the exact issue!

