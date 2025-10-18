# Post-Production Handling Guide

## ✅ Yes, You Can Continue Local Development After Deployment!

### How It Works:

**Production (Vercel):**
- Deploys from your `main` branch on GitHub
- Has its own environment variables in Vercel
- Runs independently from your local machine

**Local Development:**
- Continues to run on `localhost:3000`
- Uses `.env.local` (different from production)
- You can make changes, test, and commit

**They're completely separate!** You can work locally while production is live.

---

## 🔄 Recommended Git Workflow

### For New Features:

```bash
# 1. Create a feature branch
git checkout -b feature/new-feature

# 2. Make changes locally
# ... code, test, iterate ...

# 3. Commit changes
git add .
git commit -m "feat: Add new feature"

# 4. Test locally
npm run build
npm run test

# 5. Push feature branch
git push origin feature/new-feature

# 6. Merge to main when ready
git checkout main
git merge feature/new-feature
git push origin main

# 7. Vercel auto-deploys from main
# (Production updates automatically)
```

### For Quick Fixes:

```bash
# 1. Fix locally on main branch
git add .
git commit -m "fix: Bug fix"

# 2. Test locally
npm run build

# 3. Push to GitHub
git push origin main

# 4. Vercel auto-deploys
# (Production updates in ~2-3 minutes)
```

---

## 🐛 Handling Production Bugs

### Scenario 1: Critical Bug (Breaks Production)

**Immediate Fix:**
```bash
# 1. Fix the bug locally
# 2. Test thoroughly: npm run build && npm run test
# 3. Commit: git commit -m "fix: Critical bug - production down"
# 4. Push: git push origin main
# 5. Vercel auto-deploys (2-3 minutes)
# 6. Verify fix in production
```

**Alternative - Rollback:**
```bash
# In Vercel dashboard:
# Deployments → Find last working deployment → Click "Promote to Production"
# (Instant rollback)
```

### Scenario 2: Non-Critical Bug

**Planned Fix:**
```bash
# 1. Create bugfix branch
git checkout -b bugfix/issue-name

# 2. Fix and test locally
# 3. Commit and push
git push origin bugfix/issue-name

# 4. Merge to main when ready
# 5. Production updates automatically
```

### Scenario 3: Need to Test in Production Environment

**Preview Deployments:**
```bash
# 1. Push any branch to GitHub
git push origin feature/test-something

# 2. Vercel creates preview URL automatically
# Example: https://roastmyidea-git-feature-username.vercel.app

# 3. Test on preview URL (uses production env vars)
# 4. If works, merge to main for production
```

---

## 🔧 Environment Management

### Local (.env.local):
```bash
# Your personal development keys
GOOGLE_API_KEY=your_key
ELEVENLABS_API_KEY=sk_xxx
# etc.
```

### Production (Vercel Dashboard):
```bash
# Same keys but managed in Vercel UI
# Settings → Environment Variables
# Can be different from local if needed
```

### Best Practice:
- **Same keys** for consistency
- **Different database** (optional - use staging DB for local)
- **Feature flags** to enable/disable features per environment

---

## 📊 Monitoring Production Issues

### Vercel Dashboard:
- **Deployments** - See all deploys and rollback if needed
- **Functions** - See API route errors and logs
- **Analytics** - Track page views and performance
- **Real-time logs** - Stream function logs live

### Supabase Dashboard:
- **Database** - Check for errors in data
- **Storage** - Verify files are uploading
- **Auth** - Monitor authentication issues
- **Logs** - See database queries and errors

### Error Tracking (When You Add Sentry):
```bash
# Sentry will email you when errors occur
# Dashboard shows: 
# - Error frequency
# - Stack traces
# - User context
# - Which deployment caused it
```

---

## 🚀 Typical Post-Deployment Workflow

### Day 1 (After Deployment):
```
Deploy → Monitor → Find small bug → Fix locally → Push → Auto-deploy → Verify
```

### Week 1 (Active Development):
```
Use feature branches → Test locally → Merge to main → Auto-deploy → Repeat
```

### Production (Stable):
```
Make changes locally → Test thoroughly → Deploy on schedule (not every commit)
```

---

## 🎯 Your Specific Workflow After Today's Deployment:

### Production will have:
- 5 AI judges with voice synthesis
- All features working
- Stable baseline for demos

### You can locally work on:
- Adding streaming (Stage 8)
- Adding new themes (Stage 9)
- Fixing any reported bugs
- Improving UI/UX
- Adding new features

### When ready to deploy changes:
```bash
git add .
git commit -m "feat: Add streaming responses"
git push origin main
# Vercel auto-deploys in 2-3 minutes
```

---

## 🔥 Emergency Procedures

### Production is Down:

1. **Check Vercel Status:**
   - https://www.vercel-status.com
   - Check if it's a platform issue

2. **Check Recent Deployments:**
   - Vercel Dashboard → Deployments
   - See if latest deploy failed

3. **Rollback Immediately:**
   - Click previous working deployment
   - Click "Promote to Production"
   - Takes effect instantly

4. **Fix and Redeploy:**
   - Fix bug locally
   - Test thoroughly
   - Push to main

### Database Issues:

1. **Check Supabase Status:**
   - https://status.supabase.com

2. **Check Database Logs:**
   - Supabase Dashboard → Logs
   - Look for connection errors

3. **Verify RLS Policies:**
   - Make sure public access is enabled
   - Check table permissions

### API Rate Limits Hit:

**Google Gemini:**
```bash
# Free tier: 15 requests/minute
# With 5 judges: ~3 roasts/minute max
# If hit limit: Wait 60 seconds or upgrade
```

**ElevenLabs:**
```bash
# Free tier: 10,000 characters/month
# Monitor usage in dashboard
# If hit limit: Disable voice or upgrade
```

**Solution:**
```bash
# Add to .env.local:
ENABLE_VOICE_SYNTHESIS=false  # Temporarily disable voice
```

---

## 💡 Pro Tips:

### 1. Use Vercel Preview Deployments
- Every branch gets a unique URL
- Test features before merging to main
- Share preview links with testers

### 2. Keep Main Branch Stable
- Only merge tested code to main
- Use feature branches for experiments
- Test builds locally first

### 3. Monitor First 24 Hours
- Watch Vercel function logs
- Check for error spikes
- Monitor API usage

### 4. Have Rollback Ready
- Know how to revert in Vercel dashboard
- Keep last known-good commit hash
- Test rollback procedure

### 5. Test Locally First
- Always run `npm run build` before pushing
- Run tests: `npm run test`
- Check linting: `npm run lint`

---

## 🎯 Deployment Checklist

### Before Every Deploy:

```bash
# 1. Test build
npm run build

# 2. Run tests
npm run test

# 3. Lint code
npm run lint

# 4. Check for TypeScript errors
# (build will catch these)

# 5. Verify environment variables
# (compare .env.local with Vercel)

# 6. Commit and push
git add .
git commit -m "feat: Description"
git push origin main

# 7. Monitor deployment in Vercel
# 8. Test production URL
# 9. Check for errors in logs
```

---

## 📱 Testing Production vs Local

### Local Testing:
```bash
# Start: npm run dev
# URL: http://localhost:3000
# Database: Your Supabase (same as production)
# Files: Stored in same Supabase bucket
```

### Production Testing:
```bash
# URL: https://roastmyidea.vercel.app
# Database: Same Supabase
# Files: Same Supabase bucket
# Logs: Vercel dashboard
```

**Note:** Local and production share the same database and storage by default. If you want separate environments:

```bash
# Create staging Supabase project
# Update .env.local with staging credentials
# Keep production credentials in Vercel only
```

---

## 🔍 Debugging Production Issues

### View Logs:

**Vercel:**
```bash
# Dashboard → Project → Deployments → Latest → Function Logs
# Shows all console.log, errors, API calls
```

**Supabase:**
```bash
# Dashboard → Logs → Query Performance
# Shows database queries and errors
```

### Common Issues:

| Issue | Cause | Fix |
|-------|-------|-----|
| API 500 errors | Environment variable missing | Add to Vercel settings |
| Database connection failed | DATABASE_URL wrong | Verify connection string |
| Voice synthesis fails | ElevenLabs key invalid | Check API key in Vercel |
| File upload fails | Storage bucket not created | Create in Supabase |
| Auth not working | Redirect URLs wrong | Update in Supabase settings |

---

## 🎊 Summary

**After deployment:**
- ✅ Production runs independently on Vercel
- ✅ You continue developing locally
- ✅ Push to `main` branch to update production
- ✅ Use feature branches for safety
- ✅ Rollback instantly if needed
- ✅ Monitor with Vercel + Supabase dashboards

**Your workflow:**
```
Local Dev → Test → Commit → Push to main → Auto-deploy → Monitor → Repeat
```

**It's that simple!** Vercel handles everything automatically.

---

*For deployment steps, see DEPLOYMENT.md*  
*For final checklist, see FINAL_CHECKLIST.md*
