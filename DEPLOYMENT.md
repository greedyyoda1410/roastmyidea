# RoastMyIdea.AI - Deployment Guide

## 🎉 Current Status

### ✅ Completed Features (Ready for Deployment)

| Stage | Feature | Status | Test Status |
|-------|---------|--------|-------------|
| 1 | Foundation + Terminal Theme | ✅ Complete | ✅ Passing |
| 2 | Single Judge AI | ✅ Complete | ✅ Passing |
| 3 | Multi-Judge System (3 judges) | ✅ Complete | ✅ Passing |
| 3a | Email Authentication | ✅ Complete | ⏳ Manual |
| 3b | Project Name Field | ✅ Complete | ✅ Passing |
| 4 | File Upload (Images + PDF) | ✅ Complete | ✅ Passing |
| 5 | AI Agents (App + Repo Review) | ✅ Complete | ✅ Passing |
| 6 | ElevenLabs Voice Synthesis | ✅ Complete | ⏳ Needs API key |
| 7 | Public Leaderboard | ✅ Complete | ✅ Passing |

### 🚧 Pending Features (Optional)

| Stage | Feature | Priority |
|-------|---------|----------|
| 8 | Streaming Responses | Low |
| 9 | Additional Themes | Low |
| 10 | Sentry + Polish | Medium |

## 🚀 Pre-Deployment Checklist

### 1. Database Setup ✅

Run this SQL in Supabase SQL Editor:

```bash
# Location: https://supabase.com/dashboard/project/wmjkfjcmtimhrmujkbbc/sql
# File: database-setup.sql
```

**Verify tables created:**
- ✅ `roasts` table
- ✅ `roast_files` table
- ✅ `leaderboard` table
- ✅ Indexes created
- ✅ RLS policies enabled
- ✅ Trigger function for leaderboard

### 2. Supabase Storage Setup

1. Go to Storage in Supabase Dashboard
2. Create bucket: `roast-files`
3. Set bucket to **Public**
4. Enable RLS policies:
   ```sql
   -- Allow public read
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'roast-files');
   
   -- Allow public upload
   CREATE POLICY "Public upload access"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'roast-files');
   ```

### 3. Authentication Setup (Optional)

Email auth is enabled by default in Supabase.

**To disable email confirmation for testing:**
1. Go to Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle OFF for testing
4. Set Site URL to your domain

### 4. Environment Variables Check

Verify `.env.local` has all required values:

```bash
✅ GOOGLE_API_KEY=AIzaSyCvS51X6lXxDT8RREdm2quZYFJ3K3C6eIc
✅ NEXT_PUBLIC_SUPABASE_URL=https://wmjkfjcmtimhrmujkbbc.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
✅ SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
✅ DATABASE_URL=postgresql://postgres:...
✅ ENABLE_MULTI_JUDGE=true
⏳ ELEVENLABS_API_KEY=your_key (optional - get from elevenlabs.io)
```

### 5. Build Test

```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
Route (app)                         Size  First Load JS
┌ ○ /                            53.2 kB         166 kB
├ ƒ /api/agents/review-app           0 B            0 B
├ ƒ /api/agents/review-repo          0 B            0 B
├ ƒ /api/leaderboard                 0 B            0 B
├ ƒ /api/roast                       0 B            0 B
├ ƒ /api/upload                      0 B            0 B
├ ƒ /api/voice                       0 B            0 B
└ ƒ /auth/callback                   0 B            0 B
```

### 6. Run Tests

```bash
# Run all tests
npm run test:single-judge

# Expected: ✅ All tests passed!
```

## 📦 Deploy to Vercel

### Step 1: Push to GitHub

```bash
# Run the GitHub setup script
./github-setup.sh

# OR manually:
git remote add origin https://github.com/YOUR_USERNAME/roastmyidea.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Add Environment Variables

In Vercel dashboard, add all environment variables:

```bash
GOOGLE_API_KEY=AIzaSyCvS51X6lXxDT8RREdm2quZYFJ3K3C6eIc
NEXT_PUBLIC_SUPABASE_URL=https://wmjkfjcmtimhrmujkbbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
DATABASE_URL=postgresql://postgres:252PasirPanjang@db.wmjkfjcmtimhrmujkbbc.supabase.co:5432/postgres
ELEVENLABS_API_KEY=your_key_here (optional)
ENABLE_MULTI_JUDGE=true
ENABLE_FILE_PROCESSING=true
ENABLE_VOICE_SYNTHESIS=true
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Get your production URL (e.g., `https://roastmyidea.vercel.app`)

### Step 5: Update Supabase Redirect URLs

1. Go to Supabase Authentication → URL Configuration
2. Add production URL to:
   - Site URL: `https://roastmyidea.vercel.app`
   - Redirect URLs: `https://roastmyidea.vercel.app/**`

## 🧪 Testing Checklist

### Manual Testing

#### Test 1: Basic Roast (Anonymous User)
- [ ] Enter project name: "TestApp"
- [ ] Enter idea: "A social media app for cats"
- [ ] Adjust tone matrix
- [ ] Click "Roast Me!"
- [ ] Verify 3 judges appear sequentially
- [ ] Verify final verdict displays
- [ ] Verify scores are shown

#### Test 2: File Upload
- [ ] Upload 1 image
- [ ] Upload 1 PDF pitch deck
- [ ] Verify file preview shows
- [ ] Submit roast
- [ ] Check files are uploaded to Supabase Storage

#### Test 3: Agent Review
- [ ] Enter app link: `https://github.com`
- [ ] Enter repo link: `https://github.com/vercel/next.js`
- [ ] Submit roast
- [ ] Verify judges mention app/repo in feedback

#### Test 4: Voice Synthesis (with API key)
- [ ] Get roast result
- [ ] Click "Play Voice Roast" on any judge
- [ ] Verify audio plays
- [ ] Click "Stop" to stop playback

#### Test 5: Leaderboard
- [ ] Scroll to bottom
- [ ] Verify leaderboard shows submitted roasts
- [ ] Click time filters (All Time, This Week, Today)
- [ ] Verify filtering works

#### Test 6: Authentication
- [ ] Click "Sign In"
- [ ] Click "Need an account? Sign Up"
- [ ] Create account with email/password
- [ ] Check email for confirmation
- [ ] Sign in
- [ ] Verify profile appears in header
- [ ] Submit roast while signed in
- [ ] Sign out

### Automated Tests

```bash
# Run test suite
npm run test:single-judge

# Expected output:
✅ All mock tests passed!
✅ All component tests passed!
✅ All tests completed successfully!
```

## 🔧 Configuration

### Feature Flags

Toggle features in `.env.local`:

```bash
# Multi-judge (3 judges vs 1 judge)
ENABLE_MULTI_JUDGE=true

# File processing
ENABLE_FILE_PROCESSING=true

# Voice synthesis (requires ElevenLabs API key)
ENABLE_VOICE_SYNTHESIS=true
```

### Performance Optimization

**Current Performance:**
- Build time: ~3-5 seconds
- First load JS: 166 kB (good)
- API response time: 5-15 seconds (multi-judge) / 2-5 seconds (single judge)

**Recommendations:**
- ✅ Code splitting already enabled
- ✅ Edge runtime for leaderboard and voice
- ✅ Image optimization with next/image (where applicable)
- ✅ Lazy loading for components

## 🐛 Known Issues & Limitations

### Current Limitations:

1. **PDF Text Extraction:** Not implemented yet (files stored but text not extracted)
2. **Email Confirmation:** Requires email setup in Supabase
3. **ElevenLabs Voice:** Requires API key (not free)
4. **Agent Processing Time:** Can take 30-60 seconds for app/repo review

### Workarounds:

1. **PDF:** Just store files for now, add text extraction later
2. **Email:** Disable confirmation for testing
3. **Voice:** Optional feature, works without it
4. **Agents:** Show loading indicator, run in parallel

## 📊 API Rate Limits

### Google Gemini (Free Tier)
- **15 requests/minute**
- **1 million tokens/day**
- **Multi-judge uses 3-4 requests per roast**
- **Estimated capacity:** ~200 roasts/day with multi-judge

### Supabase (Free Tier)
- **500MB database**
- **1GB file storage**
- **50,000 monthly active users**
- **Sufficient for hackathon demo**

### ElevenLabs (Free Tier)
- **10,000 characters/month**
- **~50-100 voice roasts/month**
- **Consider disabling for heavy usage**

## 🎯 Production Recommendations

### Security

1. **Add rate limiting** to prevent abuse
2. **Validate file uploads** more strictly
3. **Sanitize user inputs** (already done with moderation)
4. **Enable CORS** properly for production
5. **Use environment-specific configs**

### Monitoring

1. **Add Sentry** for error tracking (Stage 10)
2. **Enable Vercel Analytics**
3. **Monitor API usage** in Google Cloud Console
4. **Track Supabase usage** in dashboard

### Performance

1. **Enable caching** for leaderboard
2. **Optimize images** with Sharp
3. **Add CDN** for static assets (Vercel automatic)
4. **Consider Redis** for session storage (future)

## 📝 Post-Deployment Tasks

After deploying:

1. **Test all features** on production URL
2. **Monitor error logs** in Vercel dashboard
3. **Check API usage** in Google Console
4. **Verify database** is populating correctly
5. **Test file uploads** to Supabase Storage
6. **Share demo URL** with testers

## 🆘 Troubleshooting

### Build Fails on Vercel

1. Check environment variables are set
2. Verify Node.js version (should be 18.x or higher)
3. Check build logs for specific errors
4. Try building locally first

### Database Connection Issues

1. Verify DATABASE_URL is correct
2. Check Supabase project is active
3. Verify RLS policies allow public access
4. Check tables exist in database

### API Errors in Production

1. Check environment variables in Vercel
2. Verify API keys are valid
3. Check function logs in Vercel
4. Monitor rate limits

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Guides](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [ElevenLabs Docs](https://docs.elevenlabs.io/)

---

**Ready to deploy!** Follow the steps above and you'll have a live hackathon demo in minutes.
