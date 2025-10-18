# 🔧 Exact Steps: Configure Supabase Email Authentication

## Issue: "Invalid API key" when signing up

---

## ✅ Step-by-Step Solution

### **Step 1: Open Supabase Dashboard**
1. Go to: https://supabase.com/dashboard
2. Click on your project (the one with your app name)

### **Step 2: Navigate to Authentication Settings**

**Exact navigation path:**
```
Left Sidebar → 🔐 Authentication → ⚙️ Providers
```

Or direct link:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/providers
```

You should see a page titled **"Auth Providers"**

### **Step 3: Find the Email Provider**

On this page, you'll see a list of providers:
- Email ← **THIS ONE**
- Phone
- Apple
- Azure
- Facebook
- GitHub
- Google
- etc.

Click on **"Email"** (should be the first one in the list)

### **Step 4: Configure Email Provider**

After clicking "Email", you'll see a side panel/modal open with settings.

Look for these toggles/checkboxes:

```
┌─────────────────────────────────────────┐
│ Email Provider                          │
├─────────────────────────────────────────┤
│                                         │
│ [✓] Enable Email provider               │  ← Make sure this is CHECKED
│                                         │
│ [✓] Confirm email                       │  ← UNCHECK THIS!
│                                         │
│ [✓] Secure email change                 │  ← Can uncheck (optional)
│                                         │
│ [ ] Enable email autoconfirm            │  ← Optional
│                                         │
└─────────────────────────────────────────┘
```

**KEY ACTION:** 
- **UNCHECK** the "Confirm email" toggle/checkbox
- This allows users to sign up immediately without email confirmation

### **Step 5: Save Changes**

At the bottom of the panel:
- Click **"Save"** button (blue button)
- Wait for "Successfully updated settings" message

### **Step 6: Test Sign-Up**

Go back to your app and try signing up with:
- Email: `test@example.com`
- Password: `password123`
- Should work immediately now!

---

## 🔍 Alternative: If You Can't Find "Confirm email"

### Option A: Different Supabase UI Version

If your Supabase dashboard looks different, try this:

**Path 1:**
```
Dashboard → Settings (gear icon at bottom left) → API → 
Look for "Auth" section → Find email confirmation settings
```

**Path 2:**
```
Dashboard → Authentication → Policies →
Look for email-related settings
```

### Option B: Use SQL to Check Current Settings

Run this in **SQL Editor** to see current auth settings:

```sql
-- Check current auth settings
SELECT * FROM auth.config;
```

### Option C: Disable Email Confirmation via SQL

If you can't find the UI setting, run this in **SQL Editor**:

```sql
-- Disable email confirmation requirement
-- Note: This might not work depending on Supabase version
-- The UI method is preferred
```

Actually, email confirmation is controlled in the Supabase dashboard only (not via SQL).

---

## 🎯 What You're Looking For

The setting is usually labeled as one of:
- ✅ "Confirm email"
- ✅ "Enable email confirmation"
- ✅ "Require email confirmation"
- ✅ "Email verification"

It's a **toggle switch** or **checkbox** that you need to **turn OFF/uncheck**.

---

## 📸 Visual Guide

Here's what you're looking for:

```
Authentication > Providers > Email

┌─────────────────────────────────────────────────────┐
│  Email                                         [>]   │  ← Click this
└─────────────────────────────────────────────────────┘

Opens side panel:
┌─────────────────────────────────────────────────────┐
│  Email provider settings                            │
│                                                     │
│  Enable Email provider                              │
│  [✓]  ← Should be ON                               │
│                                                     │
│  Confirm email                                      │
│  [✓]  ← TURN THIS OFF for immediate sign-up       │
│                                                     │
│  [Save]  ← Click to apply                          │
└─────────────────────────────────────────────────────┘
```

---

## 🆘 Still Can't Find It?

### Workaround: Use Google OAuth Instead

If you can't disable email confirmation, you can enable Google OAuth as an alternative:

1. **Authentication → Providers → Google**
2. Follow the setup wizard
3. Update your app to use Google sign-in

But for now, let's focus on fixing the email provider first!

---

## 📞 Double Check These:

After making changes, verify in Vercel:

**Vercel → Settings → Environment Variables:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...  ← Must be ANON key (starts with eyJ)
```

**Common mistake:** Using service_role key instead of anon key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ Success Indicators

After configuration:
1. ✅ Sign-up works without email
2. ✅ User appears in **Authentication → Users** tab
3. ✅ No "Invalid API key" error
4. ✅ Can sign in immediately after sign-up

---

## 🎉 Expected Behavior After Fix

- **With email confirmation OFF**: User signs up → Immediately logged in → Can use app
- **With email confirmation ON**: User signs up → Gets email → Must click link → Then can log in

For a hackathon judge app, **email confirmation OFF** is recommended for better UX!

---

**If you still can't find the setting after checking all these locations, share a screenshot of your Supabase Authentication page and I'll help locate it!**

