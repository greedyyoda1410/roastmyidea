# RoastMyIdea.AI - Setup Guide

## Quick Setup (5 Minutes)

### Step 1: Database Setup

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wmjkfjcmtimhrmujkbbc
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `database-setup.sql` and paste it
5. Click "Run" to execute the SQL
6. Verify tables created: Go to "Table Editor" and you should see `roasts`, `roast_files`, and `leaderboard` tables

### Step 2: Environment Variables

Your `.env.local` file is already configured with the correct values:
```bash
✅ GOOGLE_API_KEY - Set
✅ NEXT_PUBLIC_SUPABASE_URL - Set
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY - Set
✅ SUPABASE_SERVICE_ROLE_KEY - Set
✅ DATABASE_URL - Set
✅ ENABLE_MULTI_JUDGE - Set to true
```

### Step 3: Start the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 and test the application!

## Testing the Multi-Judge System

1. **Enter a startup idea** in the text area
2. **Adjust the tone matrix** - drag to set humor and sarcasm levels
3. **Click "Roast Me!"** button
4. **Watch the magic happen:**
   - All 3 judges will evaluate your idea (takes ~10-15 seconds)
   - Judges appear sequentially with animations
   - Final verdict appears after all judges complete
   - Scores are aggregated from all 3 judges

## Implemented Features

### ✅ Stage 1 & 2: Foundation + Single Judge
- Next.js 14 with TypeScript and Tailwind CSS v4
- Terminal theme with glitch effects
- Google Gemini API integration
- Content moderation
- Error handling system
- Database schema

### ✅ Stage 3: Multi-Judge System
- **3 Judge Personas:**
  - **Technical Judge** (Senior Engineer) - Analytical, detail-oriented
  - **Business Judge** (VC Partner) - Market-focused, ROI-driven
  - **Creative Judge** (Design Director) - User-obsessed, innovation-focused
- Sequential API calls with tone variations
- Aggregated scoring (averaged from all judges)
- Majority verdict system (PASS/FAIL/MAYBE)
- Sequential reveal animations
- Loading states between judges

## Project Structure

```
roastmyidea/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── roast/
│   │   │       └── route.ts          # Multi-judge API endpoint
│   │   ├── globals.css               # Terminal theme + animations
│   │   ├── layout.tsx                # App layout
│   │   └── page.tsx                  # Main page with UI
│   ├── components/
│   │   ├── ErrorDisplay.tsx          # Error handling UI
│   │   ├── IdeaInput.tsx            # Idea input with validation
│   │   ├── JudgeCard.tsx            # Judge results display
│   │   └── ToneMatrix.tsx           # 2-axis tone control
│   ├── lib/
│   │   ├── constants.ts             # Judge personas + errors
│   │   ├── gemini.ts                # Gemini API integration
│   │   ├── supabase.ts              # Supabase client
│   │   └── db/
│   │       ├── index.ts             # Database connection
│   │       └── schema.ts            # Drizzle ORM schema
│   └── types/
│       └── index.ts                 # TypeScript types
├── tests/
│   ├── features/
│   │   └── single-judge/            # Feature tests
│   ├── test-config.js               # Test configuration
│   └── run-tests.js                 # Test runner
├── docs/
│   └── FEATURES.md                  # Complete feature docs
├── database-setup.sql               # SQL to run in Supabase
└── .env.local                       # Environment variables

```

## Running Tests

```bash
# Test single judge feature
npm run test:single-judge

# Run linting
npm run lint

# Build for production
npm run build
```

## Feature Flags

Toggle features by updating `.env.local`:

```bash
# Enable/disable multi-judge system
ENABLE_MULTI_JUDGE=true    # 3 judges (default)
ENABLE_MULTI_JUDGE=false   # 1 judge only

# File processing (Stage 4 - not yet implemented)
ENABLE_FILE_PROCESSING=false

# Voice synthesis (Stage 6 - not yet implemented)
ENABLE_VOICE_SYNTHESIS=false
```

## Troubleshooting

### Database Connection Issues

If you get database errors:
1. Verify your Supabase project is active
2. Check that the database URL is correct
3. Make sure you ran the SQL script in Supabase SQL Editor
4. Verify RLS policies are set up correctly

### API Key Issues

If you get "API key not valid" errors:
1. Verify your Gemini API key at https://makersuite.google.com/app/apikey
2. Make sure there are no extra spaces in the `.env.local` file
3. Restart the development server after updating `.env.local`

### Build Errors

If build fails:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

## Next Steps

With Stage 3 complete, you can now implement:

- **Stage 4:** File upload for images and PDF pitch decks
- **Stage 6:** ElevenLabs voice synthesis
- **Stage 7:** Public leaderboard
- **Stage 8:** Streaming responses and advanced animations
- **Stage 9:** Lab and Game Show themes

## Deployment to Vercel

When ready to deploy:

```bash
# 1. Build locally to verify
npm run build

# 2. Push to GitHub
git push origin main

# 3. Deploy to Vercel
# - Go to vercel.com
# - Import your GitHub repository
# - Add environment variables from .env.local
# - Deploy!
```

## API Rate Limits

**Google Gemini (Free Tier):**
- 15 requests per minute
- 1 million tokens per day
- **Multi-judge uses 3 requests per roast** (or 4 with moderation)

**Supabase (Free Tier):**
- 500MB database
- 1GB file storage
- 50,000 monthly active users

For your hackathon, these limits should be more than sufficient!

---

*For detailed feature documentation, see [docs/FEATURES.md](docs/FEATURES.md)*
