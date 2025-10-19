# Environment Variables Setup for Judge Update

## Quick Setup Guide

### Vercel Environment Variables Configuration

#### 1. Navigate to Vercel Settings
```
Vercel Dashboard → Your Project → Settings → Environment Variables
```

#### 2. Core API Keys (Already Set - Verify Only)
```bash
GOOGLE_API_KEY=<your-gemini-api-key>
ELEVENLABS_API_KEY=<your-elevenlabs-api-key>
DATABASE_URL=<your-supabase-connection-string>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

#### 3. NEW: Voice IDs for Updated Judge Names

You need to configure ElevenLabs voice IDs for each judge persona. These map to the new judge names:

```bash
# Tech Bro 3000 (formerly "Technical Judge")
VOICE_ID_TECH_BRO=<elevenlabs-voice-id>

# Brutal VC (formerly "Business Judge")
VOICE_ID_BRUTAL_VC=<elevenlabs-voice-id>

# Supportive Comedian (formerly "Creative Judge")
VOICE_ID_SUPPORTIVE_COMEDIAN=<elevenlabs-voice-id>

# Zen Mentor (formerly "Customer Support Expert")
VOICE_ID_ZEN_MENTOR=<elevenlabs-voice-id>

# Middle-Aged CEO (formerly "Generalist Judge")
VOICE_ID_CEO=<elevenlabs-voice-id>
```

#### 4. Multi-Judge Setting (IMPORTANT)

**Option A:** Ensure this is NOT set (recommended)
- Simply don't include `ENABLE_MULTI_JUDGE` variable

**Option B:** If it exists, set it to false
```bash
ENABLE_MULTI_JUDGE=false
```

## How to Get ElevenLabs Voice IDs

### Step 1: Log into ElevenLabs
Go to: https://elevenlabs.io/app/voice-library

### Step 2: Choose Voices for Each Persona

Suggested voice characteristics:

**Tech Bro 3000:**
- Gender: Male
- Age: Young adult (25-35)
- Style: Confident, analytical, tech-savvy
- Example search: "confident professional male"

**Brutal VC:**
- Gender: Male/Female
- Age: Middle-aged (40-55)
- Style: Direct, assertive, business-focused
- Example search: "authoritative business"

**Supportive Comedian:**
- Gender: Any
- Age: Young-middle (30-45)
- Style: Warm, humorous, creative
- Example search: "friendly comedian"

**Zen Mentor:**
- Gender: Any
- Age: Mature (45-60)
- Style: Calm, empathetic, wise
- Example search: "calm mentor"

**Middle-Aged CEO:**
- Gender: Male/Female
- Age: Middle-aged (45-60)
- Style: Experienced, strategic, authoritative
- Example search: "executive professional"

### Step 3: Get Voice IDs
1. Click on a voice you want to use
2. Click "Use this voice" or "Add to VoiceLab"
3. Copy the Voice ID (looks like: `21m00Tcm4TlvDq8ikWAM`)
4. Add to Vercel environment variables

## Testing Voice Configuration

### Local Testing (Optional)
Create a `.env.local` file:
```bash
GOOGLE_API_KEY=your-key
ELEVENLABS_API_KEY=your-key
DATABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Voice IDs
VOICE_ID_TECH_BRO=voice-id-1
VOICE_ID_BRUTAL_VC=voice-id-2
VOICE_ID_SUPPORTIVE_COMEDIAN=voice-id-3
VOICE_ID_ZEN_MENTOR=voice-id-4
VOICE_ID_CEO=voice-id-5
```

Run locally:
```bash
npm run dev
```

Test voice playback for each judge.

## Environment Variable Priority

1. **Production:** Use Vercel environment variables
2. **Preview:** Use Vercel preview environment variables (or inherit from production)
3. **Local:** Use `.env.local` file (not committed to git)

## Verification Checklist

Before deployment:
- [ ] All 5 voice IDs are set in Vercel
- [ ] Voice IDs are valid (25-character alphanumeric strings)
- [ ] ENABLE_MULTI_JUDGE is false or not set
- [ ] Core API keys are still active
- [ ] Test voice playback in preview deployment

## Fallback Behavior

If a voice ID is missing or invalid:
- System falls back to `VOICE_ID_TECH_BRO` (default)
- If that's also missing, voice synthesis will fail gracefully with error message
- User can still see text roast even if voice fails

## Common Issues

### Issue 1: Voice Not Playing
**Cause:** Incorrect voice ID or missing environment variable
**Solution:** 
1. Check Vercel logs for "Voice synthesis failed"
2. Verify voice ID in ElevenLabs dashboard
3. Update environment variable
4. Redeploy

### Issue 2: Wrong Voice for Judge
**Cause:** Voice ID mapped to wrong persona
**Solution:**
1. Check voice ID mappings in `src/lib/voices.ts`
2. Update correct environment variable
3. Redeploy

### Issue 3: All Judges Use Same Voice
**Cause:** Missing individual voice IDs, all falling back to default
**Solution:**
1. Set all 5 voice ID environment variables
2. Verify each has unique value
3. Redeploy

## Migration from Old Names

If you already had voice IDs for old judge names:

**Old Variables (can be deleted):**
- `VOICE_ID_TECHNICAL_JUDGE`
- `VOICE_ID_BUSINESS_JUDGE`
- `VOICE_ID_CREATIVE_JUDGE`
- `VOICE_ID_CUSTOMER_SUPPORT`
- `VOICE_ID_GENERALIST`

**New Variables (use these):**
- `VOICE_ID_TECH_BRO`
- `VOICE_ID_BRUTAL_VC`
- `VOICE_ID_SUPPORTIVE_COMEDIAN`
- `VOICE_ID_ZEN_MENTOR`
- `VOICE_ID_CEO`

You can use the same voice IDs, just rename the variables.

## Quick Copy-Paste Template

For Vercel environment variables:

```
VOICE_ID_TECH_BRO=
VOICE_ID_BRUTAL_VC=
VOICE_ID_SUPPORTIVE_COMEDIAN=
VOICE_ID_ZEN_MENTOR=
VOICE_ID_CEO=
ENABLE_MULTI_JUDGE=false
```

Fill in the voice IDs and paste into Vercel.

---

**Last Updated:** October 19, 2025  
**Applies To:** Judge & Tone Matrix Update v1.0

