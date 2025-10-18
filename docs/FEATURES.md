# RoastMyIdea.AI - Feature Documentation

## Overview

This document provides comprehensive documentation for all implemented features in RoastMyIdea.AI, organized by feature branches and implementation stages.

## Feature Branches

### 🌟 Main Branch (`main`)
**Status:** ✅ Complete  
**Description:** Foundation + Single Judge AI Integration  
**Port:** 3000

#### Implemented Features

##### 1. Project Foundation
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS v4** with custom theme system
- **ESLint 9** configuration
- **Drizzle ORM** with PostgreSQL schema
- **Supabase** integration for database and storage

##### 2. Terminal Theme
- **CSS Variables** system for theme switching
- **Glitch effects** and animations
- **Scanlines** and retro terminal aesthetics
- **Responsive design** with mobile support
- **Accessibility** features (AA+ contrast, keyboard navigation)

##### 3. Core Components

###### IdeaInput Component
```typescript
interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}
```
- **Validation:** 1-1000 characters, non-empty
- **Real-time feedback** with character counter
- **Error states** with visual indicators
- **Accessibility** with proper labels and ARIA attributes

###### ToneMatrix Component
```typescript
interface ToneMatrixProps {
  value: ToneMatrixType;
  onChange: (tone: ToneMatrixType) => void;
}
```
- **2-axis control:** Humor (0-1) and Sarcasm (-1 to 1)
- **Interactive dragging** with visual feedback
- **Quadrant labels** for user guidance
- **Real-time updates** with smooth animations

###### ErrorDisplay Component
```typescript
interface ErrorDisplayProps {
  errorType: ErrorType;
  onRetry: () => void;
}
```
- **5 error types** with personality-driven messages
- **Consistent styling** across all error states
- **Retry functionality** for user recovery

###### JudgeCard Component
```typescript
interface JudgeCardProps {
  name: string;
  response: JudgeResponse;
  isVisible: boolean;
}
```
- **Score visualization** with progress bars
- **Color-coded ratings** (green/yellow/red)
- **Animated reveals** with Framer Motion
- **Responsive layout** for all screen sizes

##### 4. Single Judge AI Integration

###### API Endpoint: `/api/roast`
```typescript
POST /api/roast
{
  "idea": string;
  "tone": {
    "humor": number; // 0-1
    "sarcasm": number; // -1 to 1
  }
}
```

**Response:**
```typescript
{
  "success": boolean;
  "roast": {
    "id": string;
    "judges": Array<{
      "name": string;
      "response": {
        "scores": {
          "originality": number;
          "feasibility": number;
          "wow_factor": number;
          "market_potential": number;
        };
        "roast": string;
        "feedback": string;
        "verdict": "PASS" | "FAIL" | "MAYBE";
      };
    }>;
    "finalVerdict": string;
    "aggregatedScores": Record<string, number>;
  }
}
```

###### Google Gemini Integration
- **Model:** `gemini-1.5-flash`
- **Content moderation** with safety checks
- **Structured prompts** for consistent responses
- **Error handling** with retry logic
- **Rate limiting** compliance

###### Database Schema
```sql
-- Roasts table
CREATE TABLE roasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  idea_text TEXT NOT NULL,
  tone_humor FLOAT,
  tone_sarcasm FLOAT,
  judges_data JSONB,
  final_verdict TEXT,
  scores JSONB,
  error_log JSONB,
  processed_files JSONB
);

-- Roast files table
CREATE TABLE roast_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roast_id UUID REFERENCES roasts(id),
  file_type TEXT,
  file_url TEXT,
  processed_content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roast_id UUID REFERENCES roasts(id),
  idea_text TEXT NOT NULL,
  total_score FLOAT NOT NULL,
  originality FLOAT NOT NULL,
  feasibility FLOAT NOT NULL,
  wow_factor FLOAT NOT NULL,
  market_potential FLOAT NOT NULL,
  verdict TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### 5. Error Handling System

| Error Type | Headline | Detail | Tone |
|------------|----------|--------|------|
| `GENERIC` | "Our judge just dropped the mic." | "Something went wrong behind the scenes. Try again in a few seconds." | light humor |
| `PARSE_FAIL` | "Roast interrupted mid-punchline." | "The AI lost its train of thought — rerun to get a proper burn." | playful |
| `UNSAFE_CONTENT` | "Referee Timeout 🛑" | "This idea touches areas the AI can't roast responsibly. Rephrase your pitch so we can critique the concept, not the people." | empathetic, non-judgmental |
| `NETWORK_QUOTA` | "Judges are catching their breath." | "Our servers might be full from other pitches. Give them a moment." | light, friendly |
| `VALIDATION_EMPTY` | "You didn't give us anything to roast!" | "Write a short idea first — the judges need material." | funny, direct |

## Testing Infrastructure

### Test Categories

#### 1. Unit Tests
- **Component tests:** Individual React component functionality
- **API tests:** Endpoint validation and response structure
- **Utility tests:** Helper functions and data processing

#### 2. Integration Tests
- **End-to-end workflows:** Complete user journeys
- **API integration:** External service interactions
- **Database operations:** CRUD operations and data integrity

#### 3. Feature Tests
- **Single Judge:** Complete single judge workflow
- **Multi-Judge:** Sequential judge processing (planned)
- **File Upload:** File processing pipeline (planned)
- **Voice Synthesis:** Audio generation (planned)
- **Themes:** Theme switching and styling (planned)

### Running Tests

#### Single Feature Tests
```bash
# Test single judge feature
node tests/run-tests.js single-judge

# Test multi-judge feature (when implemented)
node tests/run-tests.js multi-judge --port 3001

# Test file upload feature (when implemented)
node tests/run-tests.js file-upload --port 3002
```

#### Integration Tests
```bash
# Run all integration tests
node tests/run-tests.js integration --verbose
```

#### Manual Testing
```bash
# Start development server
npm run dev

# Start specific feature server
npm run dev -- --port 3001
```

## Development Workflow

### Feature Development Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Implement feature**
   - Write code following existing patterns
   - Add comprehensive tests
   - Update documentation

3. **Test feature**
   ```bash
   node tests/run-tests.js feature-name
   ```

4. **Merge to main**
   ```bash
   git checkout main
   git merge feature/feature-name
   ```

### Code Quality Standards

- **TypeScript:** Strict type checking enabled
- **ESLint:** Zero linting errors required
- **Testing:** 90%+ test coverage
- **Documentation:** All public APIs documented
- **Accessibility:** WCAG 2.1 AA compliance

## Environment Setup

### Required Environment Variables

```bash
# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Feature Flags
ENABLE_MULTI_JUDGE=true
ENABLE_FILE_PROCESSING=true
ENABLE_VOICE_SYNTHESIS=false

# ElevenLabs (for voice synthesis)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Database Setup

1. **Create Supabase project**
2. **Run migrations:**
   ```bash
   npx drizzle-kit push
   ```
3. **Set up RLS policies** for public access

## Performance Metrics

### Current Performance
- **Build time:** ~2 seconds
- **First load JS:** 117kB
- **API response time:** <30 seconds
- **Bundle size:** Optimized with tree shaking

### Optimization Strategies
- **Code splitting:** Dynamic imports for heavy components
- **Image optimization:** Next.js Image component
- **Caching:** API response caching
- **CDN:** Static asset delivery

## Security Considerations

### Data Protection
- **Input validation:** All user inputs sanitized
- **Content moderation:** AI-powered safety checks
- **Rate limiting:** API abuse prevention
- **Environment variables:** Sensitive data protection

### Privacy
- **No data retention:** Roasts not permanently stored
- **Anonymous usage:** No user tracking
- **GDPR compliance:** Data processing transparency

## Future Roadmap

### Planned Features
1. **Multi-Judge System** (Stage 3)
2. **File Upload Processing** (Stage 4)
3. **Voice Synthesis** (Stage 6)
4. **Advanced Themes** (Stage 9)
5. **Performance Optimization** (Stage 10)

### Technical Debt
- **Test coverage:** Increase to 95%+
- **Error boundaries:** React error handling
- **Monitoring:** Sentry integration
- **Analytics:** Usage tracking

---

*Last updated: October 18, 2024*
*Version: 1.0.0*
