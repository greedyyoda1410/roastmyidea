# Quick Fix: Configure Voice IDs for ElevenLabs

## The Problem
You're getting this error: `An invalid ID has been received`

This means the voice IDs for the new judge names aren't configured in Vercel.

## Quick Solution

### Step 1: Go to ElevenLabs
1. Log in to: https://elevenlabs.io/app/voice-library
2. Browse or search for voices that match each judge persona

### Step 2: Get Voice IDs

For each voice you select:
- Click on the voice
- Look for the Voice ID (it's a string like: `21m00Tcm4TlvDq8ikWAM`)
- Copy it

You need **5 voice IDs total** - one for each judge.

### Step 3: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: **roastmyidea**
3. Go to: **Settings → Environment Variables**
4. Add these **5 variables**:

```bash
VOICE_ID_TECH_BRO=<paste-voice-id-here>
VOICE_ID_BRUTAL_VC=<paste-voice-id-here>
VOICE_ID_SUPPORTIVE_COMEDIAN=<paste-voice-id-here>
VOICE_ID_ZEN_MENTOR=<paste-voice-id-here>
VOICE_ID_CEO=<paste-voice-id-here>
```

**Important:** 
- Make sure to set these for **Production** environment
- Click "Save" after each one

### Step 4: Redeploy

After adding all 5 variables:
1. Go to: Vercel → Deployments
2. Find the latest deployment
3. Click "..." → **Redeploy**

This picks up the new environment variables.

## Voice Selection Suggestions

**Tech Bro 3000:**
- Style: Confident, analytical, tech-savvy
- Age: Young adult male (25-35)
- Example: Search for "professional tech male"

**Brutal VC:**
- Style: Direct, assertive, business-focused
- Age: Middle-aged (40-55)
- Example: Search for "authoritative business"

**Supportive Comedian:**
- Style: Warm, humorous, creative
- Age: Young-middle (30-45)
- Example: Search for "friendly comedian"

**Zen Mentor:**
- Style: Calm, empathetic, wise
- Age: Mature (45-60)
- Example: Search for "calm mentor"

**Middle-Aged CEO:**
- Style: Experienced, strategic
- Age: Middle-aged (45-60)
- Example: Search for "executive professional"

## Testing

After redeployment:
1. Go to your production site
2. Submit a roast
3. Click "Play Voice Roast"
4. Should work! 🎉

## If You Already Had Voice IDs

If you had voice IDs set up for the OLD judge names, you need to **rename** the environment variables:

**Old Names → New Names:**
- `VOICE_ID_TECHNICAL_JUDGE` → `VOICE_ID_TECH_BRO`
- `VOICE_ID_BUSINESS_JUDGE` → `VOICE_ID_BRUTAL_VC`
- `VOICE_ID_CREATIVE_JUDGE` → `VOICE_ID_SUPPORTIVE_COMEDIAN`
- `VOICE_ID_CUSTOMER_SUPPORT` → `VOICE_ID_ZEN_MENTOR`
- `VOICE_ID_GENERALIST` → `VOICE_ID_CEO`

You can use the same voice IDs, just update the variable names.

## Still Having Issues?

If you get a different error after configuring:
1. Check the voice IDs are correct (no spaces, full ID)
2. Make sure they're set for the Production environment
3. Verify your ElevenLabs API key is still valid
4. Check Vercel logs for specific error messages

---

**Estimated Time:** 10-15 minutes to configure all 5 voice IDs

