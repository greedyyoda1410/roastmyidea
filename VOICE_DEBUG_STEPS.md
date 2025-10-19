# Debug Steps for Voice ID Issue

## Current Problem
Voice IDs are still coming up empty, showing as "......" in logs.

## Immediate Action Required

### Step 1: Push the Debug Code
**Via GitHub Desktop:**
- Open GitHub Desktop
- Push the latest commits (should be 5 total)
- Wait for Vercel to deploy (~2-3 minutes)

### Step 2: Test Voice Playback & Check Logs
1. Go to your production site
2. Submit a roast
3. Click "Play Voice Roast"
4. **Immediately go to Vercel logs:**
   - https://vercel.com/dashboard → Your Project → Logs
   - Look for the new detailed logs

### Step 3: Look for These Log Lines

You should see output like this:
```
[Voice API] Looking for voice for: Tech Bro 3000
[Voice API] Judge found: Yes
[Voice API] Environment variable check:
- VOICE_ID_TECH_BRO: SET or NOT SET
- VOICE_ID_TECHNICAL_JUDGE: SET or NOT SET
- VOICE_ID_TECHNICAL: SET or NOT SET
...
[Voice API] Voice mapping result for Tech Bro 3000: EMPTY or abc123...
```

### Step 4: Share the Results

**Send me the output from these specific log lines:**
- Which variables show "SET"
- Which variables show "NOT SET"
- What the "Voice mapping result" shows

## What This Will Tell Us

1. **If ALL show "NOT SET":** 
   - Voice IDs aren't configured in Vercel at all
   - Need to add them

2. **If SOME show "SET":**
   - We can see which naming pattern you're using
   - I can update the code to match

3. **If the mapping result is EMPTY:**
   - The variable names don't match what the code expects
   - Need to either rename in Vercel or update code

## Quick Check: What Are Your Vercel Variable Names?

Go to Vercel → Settings → Environment Variables and **list the exact names** of your voice-related variables.

They might be named like:
- `VOICE_ID_TECHNICAL_JUDGE`
- `VOICE_TECHNICAL_JUDGE`
- `ELEVENLABS_VOICE_TECHNICAL`
- `TECHNICAL_VOICE_ID`
- Something else?

## Once We Know the Names

I'll update the code to match exactly what you have in Vercel, so you don't need to rename anything.

---

**Next Step:** Push via GitHub Desktop, test, and share the log output!

