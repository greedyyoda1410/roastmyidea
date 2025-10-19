# Deployment Checklist - Judge & Tone Matrix Update

## Overview
This deployment includes:
1. Single judge selection with 5 judge personas
2. Updated judge names and expertise areas
3. Fixed Tone Matrix UI/UX
4. Enhanced Gemini prompts with judge expertise and tone parameters

## Pre-Deployment Verification

### 1. Code Quality Checks
- [x] TypeScript compilation successful (`npm run build`)
- [x] No linting errors
- [x] All core functionality implemented
- [ ] Unit tests reviewed (manual verification needed)
- [ ] Integration tests reviewed (manual verification needed)

### 2. Environment Variables Check

#### Required on Vercel:
```bash
# Core API Keys
GOOGLE_API_KEY=<your-gemini-api-key>
ELEVENLABS_API_KEY=<your-elevenlabs-api-key>

# Database (Supabase)
DATABASE_URL=<your-supabase-connection-string>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Voice IDs for New Judge Names
VOICE_ID_TECH_BRO=<elevenlabs-voice-id-for-tech-bro-3000>
VOICE_ID_BRUTAL_VC=<elevenlabs-voice-id-for-brutal-vc>
VOICE_ID_SUPPORTIVE_COMEDIAN=<elevenlabs-voice-id-for-supportive-comedian>
VOICE_ID_ZEN_MENTOR=<elevenlabs-voice-id-for-zen-mentor>
VOICE_ID_CEO=<elevenlabs-voice-id-for-middle-aged-ceo>

# Multi-Judge (ensure disabled or not set)
# ENABLE_MULTI_JUDGE=false  # Can be omitted - defaults to false
```

**Action Items:**
1. Verify all voice IDs match new judge names
2. Ensure ENABLE_MULTI_JUDGE is either false or not set
3. Confirm all API keys are active

## Database Verification (Supabase)

### Current Schema Status
- ✅ `roasts` table supports JSONB for judges_data (works for single/multi)
- ✅ RLS policies allow anonymous and authenticated access
- ✅ No schema changes required for this update

### Verify Database Access
```sql
-- Test query to verify roasts table is accessible
SELECT id, project_name, final_verdict, created_at 
FROM roasts 
ORDER BY created_at DESC 
LIMIT 5;

-- Verify leaderboard is updating
SELECT * FROM leaderboard ORDER BY created_at DESC LIMIT 5;
```

**No database migrations needed for this deployment.**

## Deployment Steps

### Step 1: Deploy to Preview Branch (RECOMMENDED)
```bash
# Push to a preview branch first
git checkout -b deploy/judge-update
git add .
git commit -m "feat: implement single judge selection with updated personas and tone matrix fixes"
git push origin deploy/judge-update
```

This will trigger a Vercel preview deployment automatically.

### Step 2: Test Preview Deployment

#### Critical Test Cases:

**A. Judge Selection**
- [ ] Load the homepage - verify 5 judge buttons appear
- [ ] Verify a random judge is selected by default
- [ ] Click each judge button - verify selection changes
- [ ] Verify selected judge info displays correct expertise

**B. Tone Matrix**
- [ ] Verify labels are centered on edges (not corners)
- [ ] Drag to top of matrix - verify "Sarcastic" label appears
- [ ] Drag to bottom of matrix - verify "Supportive" label appears
- [ ] Verify horizontal and vertical dividers are visible
- [ ] Verify no percentages are shown, only descriptive labels

**C. Complete Roast Flow**
Test with each judge at least once:

1. **Tech Bro 3000** (Technical focus)
   - [ ] Enter idea: "A blockchain-based social media app"
   - [ ] Select Tech Bro 3000
   - [ ] Set tone: High Humor (0.8), Low Sarcasm (-0.2)
   - [ ] Submit and verify response focuses on technical aspects

2. **Brutal VC** (Investment focus)
   - [ ] Enter idea: "A subscription box for artisanal coffee"
   - [ ] Select Brutal VC
   - [ ] Set tone: Low Humor (0.2), High Sarcasm (0.8)
   - [ ] Verify response focuses on investment/valuation

3. **Supportive Comedian** (Creative focus)
   - [ ] Enter idea: "A design tool for non-designers"
   - [ ] Select Supportive Comedian
   - [ ] Set tone: High Humor (0.9), Supportive (-0.8)
   - [ ] Verify creative/UX focused feedback

4. **Zen Mentor** (Customer Experience focus)
   - [ ] Enter idea: "A customer service chatbot"
   - [ ] Select Zen Mentor
   - [ ] Set tone: Medium values (0.5, 0)
   - [ ] Verify customer experience focus

5. **Middle-Aged CEO** (Business focus)
   - [ ] Enter idea: "A SaaS for small businesses"
   - [ ] Select Middle-Aged CEO
   - [ ] Set tone: Serious (0.2), Neutral (0)
   - [ ] Verify business viability focus

**D. Voice Synthesis**
- [ ] Test voice playback with at least 2 different judges
- [ ] Verify voice plays correctly (no 404s or API errors)
- [ ] Verify play limit works (2 plays per judge)

**E. Leaderboard**
- [ ] Submit a roast and check leaderboard updates
- [ ] Verify project name appears correctly
- [ ] Verify scores display properly

### Step 3: Monitor Preview Logs
```
# Check Vercel logs for:
- Any Gemini API errors
- Database connection issues
- Voice synthesis failures
- 404s on voice IDs
```

**Look for these log patterns:**
- `[Roast API] Single judge mode - selected: [Judge Name]`
- `[Gemini] Generating content for [Judge Name]`
- `[Roast API] Successfully generated single judge roast`

### Step 4: Merge to Main
Once preview tests pass:
```bash
git checkout main
git merge deploy/judge-update
git push origin main
```

This will trigger production deployment automatically.

## Post-Deployment Verification (Production)

### Immediate Checks (within 5 minutes)
1. [ ] Homepage loads successfully
2. [ ] All 5 judges display correctly
3. [ ] Tone matrix functions properly
4. [ ] Submit a test roast - verify it completes
5. [ ] Check production logs for errors

### Extended Testing (within 30 minutes)
Test each judge in production at least once following the test cases above.

### Monitoring Checklist
Monitor for 24 hours:
- [ ] Error rates in Vercel logs
- [ ] Gemini API usage/quotas
- [ ] ElevenLabs API usage
- [ ] Database connection health
- [ ] User feedback (if available)

## Rollback Plan

If issues arise in production:

### Option 1: Quick Rollback (Vercel Dashboard)
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
```

### Option 3: Environment Variable Fix
If issues are environment-related:
1. Go to Vercel → Settings → Environment Variables
2. Update the problematic variable
3. Redeploy

## Known Issues & Mitigations

### Issue 1: Voice IDs Not Mapped
**Symptom:** Voice playback fails with 404
**Fix:** Update environment variables with correct voice IDs
**Mitigation:** Falls back to default voice if missing

### Issue 2: Judge Name Mismatch
**Symptom:** Default judge always selected
**Fix:** Verify selectedJudge parameter in API
**Mitigation:** Uses first judge as fallback

## Success Criteria

Deployment is successful when:
- ✅ All 5 judges are selectable
- ✅ Each judge provides expertise-focused feedback
- ✅ Tone matrix displays correctly with centered labels and dividers
- ✅ No percentages shown, only descriptive labels
- ✅ Sarcasm direction maps correctly (top = sarcastic, bottom = supportive)
- ✅ Voice playback works for all judges
- ✅ Leaderboard updates correctly
- ✅ No critical errors in logs
- ✅ Response times remain under 10 seconds

## Contact & Support

If issues persist:
1. Check Vercel logs: https://vercel.com/dashboard/logs
2. Check Supabase logs: https://supabase.com/dashboard/project/[your-project]/logs
3. Verify Gemini API status: https://ai.google.dev/status
4. Verify ElevenLabs API status: https://elevenlabs.io/status

## Changelog

### Changes in This Deployment
- **Judge System:**
  - Renamed all 5 judges to new persona names
  - Added expertise field to focus feedback scope
  - Implemented single judge selection UI
  - Random default judge selection on page load

- **Tone Matrix:**
  - Fixed Y-axis mapping (sarcasm: top=+1, bottom=-1)
  - Moved labels to centered positions on edges
  - Added subtle quadrant dividers
  - Removed percentage display
  - Implemented descriptive tone labels

- **Gemini Integration:**
  - Enhanced prompts to emphasize judge expertise
  - Added explicit tone parameter guidance
  - Included expertise-focused scoring instructions

- **Code Changes:**
  - `src/lib/constants.ts` - Updated JUDGE_PERSONAS
  - `src/components/JudgeSelector.tsx` - New component
  - `src/components/ToneMatrix.tsx` - UI/UX fixes
  - `src/app/page.tsx` - Added judge selection
  - `src/app/api/roast/route.ts` - Single judge mode
  - `src/lib/gemini.ts` - Enhanced prompts
  - `tests/` - Comprehensive test coverage

## Next Steps After Deployment

1. Monitor user feedback on judge personas
2. Collect data on which judges are most popular
3. Analyze if expertise-focused feedback improves user satisfaction
4. Consider A/B testing tone matrix variations
5. Evaluate if voice IDs match persona expectations

---

**Deployment Date:** _To be filled_  
**Deployed By:** _To be filled_  
**Version:** Judge & Tone Matrix Update v1.0  
**Status:** Ready for Deployment

