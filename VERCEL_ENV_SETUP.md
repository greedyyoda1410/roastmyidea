# 🚨 CRITICAL: Vercel Environment Variables Setup

Your deployment failed because **environment variables are NOT automatically copied to Vercel**.

## ⚡ Quick Fix (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Click on your project: **roastmyidea**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add ALL These Variables

Copy these **exact variable names** and add them with your values:

#### Required Variables (App won't work without these):

```bash
# Supabase (REQUIRED - App crashes without these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google Gemini AI (REQUIRED - No roasts without this)
GOOGLE_API_KEY=your_google_api_key_here

# Database (REQUIRED - No data storage)
DATABASE_URL=your_postgres_connection_string_here
```

#### Optional Features (App works but features disabled):

```bash
# ElevenLabs Voice (Optional - Voice roasts won't work)
ELEVENLABS_API_KEY=your_elevenlabs_key_here
VOICE_ID_TECH_BRO=your_tech_voice_id
VOICE_ID_BRUTAL_VC=your_vc_voice_id
VOICE_ID_SUPPORTIVE_COMEDIAN=your_comedian_voice_id
VOICE_ID_ZEN_MENTOR=your_mentor_voice_id
VOICE_ID_CEO=your_ceo_voice_id
```

### Step 3: Set Environment Scope
For EACH variable, select:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

### Step 4: Redeploy
After adding ALL variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋮** (three dots) menu
4. Click **Redeploy**
5. **Uncheck** "Use existing Build Cache"
6. Click **Redeploy**

---

## 📋 Where to Find Your Values

### Supabase Variables
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
2. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/database
4. Copy **Connection string** (Direct connection) → `DATABASE_URL`

### Google Gemini API
1. Go to: https://aistudio.google.com/app/apikey
2. Create/copy API key → `GOOGLE_API_KEY`

### ElevenLabs (Optional)
1. Go to: https://elevenlabs.io/app/settings
2. Copy API key → `ELEVENLABS_API_KEY`
3. Go to: https://elevenlabs.io/app/voice-library
4. Click each voice, copy voice ID → `VOICE_ID_*` variables

---

## 🔍 Verify Setup

After redeployment, check:
1. ✅ Build completes without errors
2. ✅ Page loads (no "supabaseUrl is required" error)
3. ✅ Can submit an idea
4. ✅ Judges respond
5. ✅ Voice buttons appear (if ElevenLabs configured)
6. ✅ Leaderboard displays

---

## 💡 Pro Tips

- **Use `.env.local` locally** (gitignored)
- **Use Vercel Environment Variables** for deployment
- Variables starting with `NEXT_PUBLIC_` are visible in the browser
- Other variables are server-side only
- Changes to env vars require a redeploy

---

## ❌ Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgot `NEXT_PUBLIC_` prefix | Must include for client-side vars |
| Copied with quotes | Remove quotes, paste raw value |
| Pasted URL with trailing `/` | Remove trailing slash |
| Used wrong Supabase key | Use **anon** key, not service role for public var |
| Forgot to redeploy | Must redeploy after adding env vars |

---

## 🆘 Still Not Working?

1. Check browser console for specific error
2. Check Vercel deployment logs: **Deployments** → Click deployment → **Function Logs**
3. Verify ALL required variables are set
4. Try **Clear Build Cache** option during redeploy
5. Check that Supabase URL doesn't have `@` or extra characters

---

**Once env vars are set, your app will work perfectly! 🎉**

