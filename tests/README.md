# RoastMyIdea.AI Testing Guide

## Overview

This testing system allows you to run tests for different features in parallel, with each feature having its own development environment and test suite.

## Quick Start

### Running Tests

```bash
# Test current feature (single-judge)
npm run test

# Test specific features
npm run test:single-judge
npm run test:multi-judge
npm run test:file-upload
npm run test:voice-synthesis
npm run test:themes

# Run integration tests
npm run test:integration
```

### Development Servers

```bash
# Main application (single-judge)
npm run dev

# Feature-specific servers
npm run dev:multi-judge    # Port 3001
npm run dev:file-upload    # Port 3002
npm run dev:voice-synthesis # Port 3003
npm run dev:themes         # Port 3004
```

## Feature Branches

### Current Features

| Feature | Branch | Port | Status | Description |
|---------|--------|------|--------|-------------|
| **Single Judge** | `main` | 3000 | ✅ Complete | AI judge with Gemini API |
| **Multi-Judge** | `feature/multi-judge` | 3001 | 🚧 Planned | 3 sequential judges |
| **File Upload** | `feature/file-upload` | 3002 | 🚧 Planned | Images & PDF processing |
| **Voice Synthesis** | `feature/voice-synthesis` | 3003 | 🚧 Planned | ElevenLabs integration |
| **Themes** | `feature/themes` | 3004 | 🚧 Planned | Lab & Game Show themes |

## Test Structure

```
tests/
├── test-config.js              # Test configuration
├── run-tests.js               # Test runner
├── features/                  # Feature-specific tests
│   ├── single-judge/
│   │   ├── api.test.js        # API endpoint tests
│   │   ├── components.test.js # React component tests
│   │   └── integration.test.js # End-to-end tests
│   ├── multi-judge/
│   ├── file-upload/
│   ├── voice-synthesis/
│   └── themes/
├── integration/               # Cross-feature tests
│   ├── end-to-end.test.js
│   ├── performance.test.js
│   └── regression.test.js
└── fixtures/                  # Test data and mocks
```

## Test Categories

### 1. Unit Tests
- **Component tests:** Individual React component functionality
- **API tests:** Endpoint validation and response structure
- **Utility tests:** Helper functions and data processing

### 2. Integration Tests
- **End-to-end workflows:** Complete user journeys
- **API integration:** External service interactions
- **Database operations:** CRUD operations and data integrity

### 3. Feature Tests
- **Single Judge:** Complete single judge workflow
- **Multi-Judge:** Sequential judge processing
- **File Upload:** File processing pipeline
- **Voice Synthesis:** Audio generation
- **Themes:** Theme switching and styling

## Running Tests in Parallel

### Option 1: Multiple Terminal Windows

```bash
# Terminal 1 - Single Judge
git checkout main
npm run dev

# Terminal 2 - Multi-Judge (when implemented)
git checkout feature/multi-judge
npm run dev -- --port 3001

# Terminal 3 - File Upload (when implemented)
git checkout feature/file-upload
npm run dev -- --port 3002
```

### Option 2: Test Runner

```bash
# Run all feature tests
npm run test

# Run specific feature tests
npm run test:single-judge
npm run test:multi-judge
```

## Test Configuration

Each feature has its own configuration in `test-config.js`:

```javascript
'single-judge': {
  branch: 'main',
  port: 3000,
  description: 'Single judge AI integration with Gemini API',
  testFiles: [
    'tests/features/single-judge/api.test.js',
    'tests/features/single-judge/components.test.js',
    'tests/features/single-judge/integration.test.js'
  ],
  environment: {
    ENABLE_MULTI_JUDGE: 'false',
    ENABLE_FILE_PROCESSING: 'false',
    ENABLE_VOICE_SYNTHESIS: 'false'
  }
}
```

## Writing Tests

### API Tests

```javascript
test('Valid roast request', async () => {
  const response = await fetch(`${BASE_URL}/api/roast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idea: 'A great startup idea',
      tone: { humor: 0.8, sarcasm: 0.3 }
    })
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
});
```

### Component Tests

```javascript
test('IdeaInput component validation', () => {
  const content = fs.readFileSync('src/components/IdeaInput.tsx', 'utf8');
  expect(content).toContain('maxLength = 1000');
  expect(content).toContain('isValid = value.trim().length > 0');
});
```

### Integration Tests

```javascript
test('Complete roast workflow', async () => {
  // Test API endpoint
  const response = await fetch(`${BASE_URL}/api/roast`, {
    method: 'POST',
    body: JSON.stringify({ idea: 'Test idea', tone: { humor: 0.5, sarcasm: 0.0 } })
  });

  expect(response.status).toBe(200);
  
  // Validate response structure
  const data = await response.json();
  expect(data.roast.judges).toHaveLength(1);
});
```

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
```

### Database Setup

1. Create Supabase project
2. Run migrations:
   ```bash
   npx drizzle-kit push
   ```
3. Set up RLS policies

## Troubleshooting

### Common Issues

1. **Port conflicts:** Make sure each feature uses a different port
2. **Branch mismatches:** Ensure you're on the correct feature branch
3. **Environment variables:** Check that all required env vars are set
4. **Database connection:** Verify Supabase credentials and connection

### Debug Mode

```bash
# Run tests with verbose output
node tests/run-tests.js single-judge --verbose

# Run specific test file
node tests/features/single-judge/api.test.js
```

## Contributing

### Adding New Tests

1. Create test file in appropriate feature directory
2. Follow existing test patterns and naming conventions
3. Add test to feature configuration in `test-config.js`
4. Update this README with new test information

### Test Standards

- **Coverage:** Aim for 90%+ test coverage
- **Naming:** Use descriptive test names
- **Structure:** Follow Arrange-Act-Assert pattern
- **Documentation:** Comment complex test logic

---

*For more information, see the main [FEATURES.md](../docs/FEATURES.md) documentation.*
