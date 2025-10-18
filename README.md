# RoastMyIdea.AI

An AI-powered hackathon judge simulator that **roasts** your startup idea — balancing humor, sarcasm, and real critique.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

🎯 **Multi-Judge System** - Get roasted by 3 AI judges with distinct personalities
- **Technical Judge** - Analytical engineer focused on feasibility
- **Business Judge** - VC partner focused on market potential  
- **Creative Judge** - Design director focused on innovation

🎨 **Interactive Tone Control** - 2-axis matrix to adjust humor and sarcasm levels

🎭 **3 Visual Themes** - Terminal, Lab, and Game Show interfaces

🔊 **Voice Synthesis** - Hear your roast with ElevenLabs voices (coming soon)

📊 **Leaderboard** - See top-rated startup ideas (coming soon)

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS v4, Framer Motion
- **Backend:** Supabase (PostgreSQL), Drizzle ORM
- **AI:** Google Gemini (gemini-1.5-flash)
- **Voice:** ElevenLabs API
- **Deployment:** Vercel
- **Testing:** Custom test framework with feature branches

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/roastmyidea.git
cd roastmyidea
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/wmjkfjcmtimhrmujkbbc/sql)
2. Run the SQL from `database-setup.sql` in the SQL Editor

### 4. Configure Environment

The `.env.local` file is already configured. Verify it contains:

```bash
GOOGLE_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
ENABLE_MULTI_JUDGE=true
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the app!

## Usage

1. **Enter your startup idea** (required, 1-1000 characters)
2. **Adjust tone** using the interactive matrix:
   - X-axis: Funny ↔ Serious
   - Y-axis: Supportive ↔ Sarcastic
3. **Click "Roast Me!"** to get evaluated
4. **Watch judges appear** sequentially with their verdicts
5. **See final verdict** based on all judges' evaluations

## Testing

```bash
# Run all tests
npm test

# Test specific features
npm run test:single-judge
npm run test:multi-judge

# Lint code
npm run lint

# Build for production
npm run build
```

## Feature Branches

Work on features in parallel:

```bash
# Multi-judge system
git checkout feature/multi-judge
npm run dev -- --port 3001

# File upload
git checkout feature/file-upload
npm run dev -- --port 3002

# Voice synthesis
git checkout feature/voice-synthesis
npm run dev -- --port 3003

# Additional themes
git checkout feature/themes
npm run dev -- --port 3004
```

## Project Status

| Stage | Feature | Status | Documentation |
|-------|---------|--------|---------------|
| 1 | Foundation + Terminal Theme | ✅ Complete | [FEATURES.md](docs/FEATURES.md) |
| 2 | Single Judge AI | ✅ Complete | [FEATURES.md](docs/FEATURES.md) |
| 3 | Multi-Judge System | ✅ Complete | [SETUP.md](SETUP.md) |
| 4 | File Upload | 🚧 Pending | - |
| 5 | Advanced Agents | 🚧 Pending | - |
| 6 | Voice Synthesis | 🚧 Pending | - |
| 7 | Leaderboard | 🚧 Pending | - |
| 8 | Streaming + Animations | 🚧 Pending | - |
| 9 | Lab + Game Show Themes | 🚧 Pending | - |
| 10 | Polish + Deployment | 🚧 Pending | - |

## Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [docs/FEATURES.md](docs/FEATURES.md) - Complete feature documentation
- [tests/README.md](tests/README.md) - Testing guide
- [Comprehensive_UX_Plan_V2.md](../Comprehensive_UX_Plan_V2.md) - Original UX plan

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GOOGLE_API_KEY` | Gemini API access | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key | Yes |
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `ELEVENLABS_API_KEY` | Voice synthesis | No (Stage 6) |
| `ENABLE_MULTI_JUDGE` | Toggle multi-judge | No (default: false) |

## Performance

- **Build Time:** ~3 seconds
- **First Load JS:** 117kB
- **API Response Time:** 5-15 seconds (depending on number of judges)
- **Database Queries:** Optimized with indexes

## Contributing

This is a hackathon project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [Google Gemini](https://ai.google.dev)
- Database by [Supabase](https://supabase.com)
- Voice by [ElevenLabs](https://elevenlabs.io)

---

Made with ❤️ for hackathons
