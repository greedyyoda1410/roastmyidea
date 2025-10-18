# End-to-End Testing Checklist

## Pre-Testing Setup

### Verify Environment:
- [ ] Development server running: `npm run dev`
- [ ] Database tables created in Supabase
- [ ] Storage bucket `roast-files` created
- [ ] All environment variables set in `.env.local`
- [ ] Browser: http://localhost:3000 loads successfully

---

## Test 1: Basic Anonymous Roast (Core Flow)

**Expected Time:** 2-3 minutes

### Steps:
1. [ ] Visit http://localhost:3000
2. [ ] **Project Name:** Enter "CoffeeConnect"
3. [ ] **Startup Idea:** Enter "A mobile app that helps people find nearby coffee shops with real-time seating availability"
4. [ ] **Tone Matrix:** Drag to top-right (Funny + Sarcastic)
5. [ ] **Click:** "Roast Me!" button

### Expected Results:
- [ ] Loading state shows: "🎬 JUDGES DELIBERATING" with spinning star
- [ ] **5 judges appear sequentially** (800ms delay between each):
  1. Technical Judge
  2. Business Judge
  3. Creative Judge
  4. Customer Support Expert
  5. Generalist Judge
- [ ] Each judge shows:
  - Name and role
  - 4 scores (Originality, Feasibility, Wow Factor, Market Potential)
  - Roast text (funny/sarcastic based on tone)
  - Feedback text
  - Verdict (PASS/FAIL/MAYBE)
  - **Voice player button** with "Play Voice Roast (2 left)"
- [ ] Final verdict appears after all 5 judges
- [ ] Leaderboard updates with "CoffeeConnect" entry

---

## Test 2: Voice Synthesis (Play Limits)

**Expected Time:** 2-3 minutes

### Steps:
1. [ ] From Test 1 results, click "Play Voice Roast" on **Technical Judge**
2. [ ] Wait for voice generation (~2-3 seconds)
3. [ ] Listen to audio playback
4. [ ] Let audio finish or click "Stop"
5. [ ] Click "Play Voice Roast" again on same judge (2nd play)
6. [ ] Try to click "Play" a 3rd time

### Expected Results:
- [ ] **First play:** Audio generates and plays successfully
- [ ] Button shows: "Play Voice Roast (1 left)"
- [ ] **Second play:** Audio generates and plays successfully
- [ ] Button shows: "Play Voice Roast (0 left)" or "No Plays Left"
- [ ] **Third play:** Button is disabled, shows "🔇 No Plays Left"
- [ ] Error message: "Play limit reached (2 plays per judge)"
- [ ] Other judges still have 2 plays each

### Verify:
- [ ] Refresh page - play count persists (stored in localStorage)
- [ ] Test another judge - has full 2 plays available
- [ ] Each judge has independent play counter

---

## Test 3: File Upload

**Expected Time:** 3-4 minutes

### Steps:
1. [ ] Click "Roast Me!" to start fresh roast
2. [ ] Enter project name: "TaskMaster"
3. [ ] Enter idea: "AI-powered task management for teams"
4. [ ] **Upload 2-3 demo images** (drag and drop or click)
5. [ ] **Upload PDF pitch deck** (any PDF file)
6. [ ] Verify previews show
7. [ ] Submit roast

### Expected Results:
- [ ] Image previews display with thumbnails
- [ ] File names and sizes shown
- [ ] Remove buttons (✕) work for each file
- [ ] "1 pitch deck + 3 images attached" message shows
- [ ] Roast processes successfully
- [ ] Check Supabase Storage → roast-files bucket → files uploaded

---

## Test 4: AI Agent Review

**Expected Time:** 4-5 minutes (agents take time)

### Steps:
1. [ ] Start new roast
2. [ ] Enter project name: "GitAnalyzer"
3. [ ] Enter idea: "Analytics dashboard for GitHub repositories"
4. [ ] **Production App Link:** `https://github.com`
5. [ ] **Git Repository Link:** `https://github.com/vercel/next.js`
6. [ ] Submit roast (will take 30-60 seconds)

### Expected Results:
- [ ] Loading takes longer (~30-60 seconds)
- [ ] Judges' feedback mentions:
  - App features detected (login, navigation, etc.)
  - Repository analysis (languages, commits, stars)
  - Specific insights from agent review
- [ ] Check console - no agent errors
- [ ] Roast quality is enhanced with agent context

---

## Test 5: Authentication Flow

**Expected Time:** 5 minutes

### Steps:
1. [ ] Click "Sign In" button in header
2. [ ] Click "Need an account? Sign Up"
3. [ ] Enter:
   - Full Name: "Test User"
   - Email: your_test_email@example.com
   - Password: testpass123
4. [ ] Click "Sign Up"
5. [ ] Check email for confirmation link
6. [ ] Click confirmation link
7. [ ] Return to app and sign in
8. [ ] Submit a roast while signed in
9. [ ] Click "Sign Out"

### Expected Results:
- [ ] Sign up shows: "Check your email for confirmation link!"
- [ ] Email received from Supabase
- [ ] After confirmation, can sign in
- [ ] User profile shows in header (name)
- [ ] Message shows: "Signed in - Your roasts will be saved to your profile"
- [ ] Check database: roasts table has user_id filled
- [ ] Sign out clears profile from header
- [ ] App still works after sign out (anonymous mode)

---

## Test 6: Leaderboard

**Expected Time:** 2 minutes

### Steps:
1. [ ] Scroll to bottom of page
2. [ ] Click "All Time" filter
3. [ ] Click "This Week" filter
4. [ ] Click "Today" filter
5. [ ] Submit another roast with higher scores
6. [ ] Verify leaderboard updates

### Expected Results:
- [ ] Leaderboard shows all submitted roasts
- [ ] Entries show: 🥇🥈🥉 for top 3
- [ ] Project names display (not full ideas)
- [ ] Scores displayed for each entry
- [ ] Verdicts color-coded (green/red/yellow)
- [ ] Filters work correctly
- [ ] New roasts appear in leaderboard
- [ ] Sorted by total score (highest first)

---

## Test 7: Error Handling

**Expected Time:** 2 minutes

### Steps:
1. [ ] Try to submit with empty project name
2. [ ] Try to submit with empty idea
3. [ ] Try to upload file >10MB (if possible)
4. [ ] Try to upload 6 images (over limit)
5. [ ] Try invalid URL for app/repo link

### Expected Results:
- [ ] Validation prevents submission
- [ ] Error messages appear with personality
- [ ] File upload shows specific errors
- [ ] "Roast Me!" button stays disabled until valid
- [ ] No crashes or console errors

---

## Test 8: Mobile Responsiveness

**Expected Time:** 3 minutes

### Steps:
1. [ ] Open DevTools (F12)
2. [ ] Toggle device emulation
3. [ ] Test on iPhone SE (375px)
4. [ ] Test on iPad (768px)
5. [ ] Test on Desktop (1920px)
6. [ ] Submit a roast on mobile view

### Expected Results:
- [ ] Layout adapts to screen size
- [ ] All buttons are tappable (minimum 44x44px)
- [ ] Text is readable
- [ ] Tone Matrix works on touch
- [ ] Judge cards stack properly
- [ ] Leaderboard is scrollable
- [ ] No horizontal overflow

---

## Test 9: Performance Check

**Expected Time:** 1 minute

### Steps:
1. [ ] Open DevTools → Network tab
2. [ ] Reload page
3. [ ] Submit a roast
4. [ ] Check timing in Network tab

### Expected Results:
- [ ] Initial page load: < 3 seconds
- [ ] First Load JS: ~168kB (acceptable)
- [ ] API roast request: 10-20 seconds (5 judges)
- [ ] Voice synthesis: 2-3 seconds per judge
- [ ] No failed requests (all 200/201)
- [ ] No console errors

---

## Test 10: Cross-Browser Testing

**Expected Time:** 5 minutes

### Steps:
1. [ ] Test in Chrome
2. [ ] Test in Safari
3. [ ] Test in Firefox
4. [ ] Test audio playback in each

### Expected Results:
- [ ] UI renders correctly in all browsers
- [ ] Animations work smoothly
- [ ] Voice playback works
- [ ] No browser-specific errors
- [ ] LocalStorage works in all browsers

---

## Bugs Found During Testing

**Document any issues here:**

| Issue | Severity | Steps to Reproduce | Status |
|-------|----------|-------------------|--------|
| Example: Voice fails on Safari | Medium | Play voice in Safari | 🔧 Fix needed |
|  |  |  |  |
|  |  |  |  |

---

## Test Results Summary

**Date Tested:** __________  
**Tester:** __________  
**Environment:** Local Development  

### Pass/Fail:
- [ ] Test 1: Basic Roast - **PASS / FAIL**
- [ ] Test 2: Voice Synthesis - **PASS / FAIL**
- [ ] Test 3: File Upload - **PASS / FAIL**
- [ ] Test 4: AI Agents - **PASS / FAIL**
- [ ] Test 5: Authentication - **PASS / FAIL**
- [ ] Test 6: Leaderboard - **PASS / FAIL**
- [ ] Test 7: Error Handling - **PASS / FAIL**
- [ ] Test 8: Mobile - **PASS / FAIL**
- [ ] Test 9: Performance - **PASS / FAIL**
- [ ] Test 10: Cross-Browser - **PASS / FAIL**

### Overall Status:
- [ ] **READY FOR PRODUCTION** ✅
- [ ] **NEEDS FIXES** 🔧

---

## Post-Testing Actions

### If All Tests Pass:
1. Document test results
2. Proceed to deployment
3. Run same tests on production after deploy

### If Tests Fail:
1. Document bugs found
2. Fix issues locally
3. Re-run failed tests
4. Repeat until all pass

---

*Run this checklist before every major deployment*
