/**
 * Test Configuration for RoastMyIdea.AI
 * 
 * This file contains configuration for running tests across different features
 * and environments. Each feature branch can run its own test suite.
 */

const testConfig = {
  // Feature-specific test configurations
  features: {
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
    },
    'multi-judge': {
      branch: 'feature/multi-judge',
      port: 3001,
      description: 'Multi-judge system with 3 personas and sequential roasting',
      testFiles: [
        'tests/features/multi-judge/api.test.js',
        'tests/features/multi-judge/sequential.test.js',
        'tests/features/multi-judge/integration.test.js'
      ],
      environment: {
        ENABLE_MULTI_JUDGE: 'true',
        ENABLE_FILE_PROCESSING: 'false',
        ENABLE_VOICE_SYNTHESIS: 'false'
      }
    },
    'file-upload': {
      branch: 'feature/file-upload',
      port: 3002,
      description: 'Basic file upload for images and PDF pitch decks',
      testFiles: [
        'tests/features/file-upload/upload.test.js',
        'tests/features/file-upload/processing.test.js',
        'tests/features/file-upload/integration.test.js'
      ],
      environment: {
        ENABLE_MULTI_JUDGE: 'false',
        ENABLE_FILE_PROCESSING: 'true',
        ENABLE_VOICE_SYNTHESIS: 'false'
      }
    },
    'voice-synthesis': {
      branch: 'feature/voice-synthesis',
      port: 3003,
      description: 'ElevenLabs voice synthesis for judge roasts',
      testFiles: [
        'tests/features/voice-synthesis/api.test.js',
        'tests/features/voice-synthesis/audio.test.js',
        'tests/features/voice-synthesis/integration.test.js'
      ],
      environment: {
        ENABLE_MULTI_JUDGE: 'false',
        ENABLE_FILE_PROCESSING: 'false',
        ENABLE_VOICE_SYNTHESIS: 'true'
      }
    },
    'themes': {
      branch: 'feature/themes',
      port: 3004,
      description: 'Lab and Game Show themes with theme switcher',
      testFiles: [
        'tests/features/themes/theme-switching.test.js',
        'tests/features/themes/styling.test.js',
        'tests/features/themes/integration.test.js'
      ],
      environment: {
        ENABLE_MULTI_JUDGE: 'false',
        ENABLE_FILE_PROCESSING: 'false',
        ENABLE_VOICE_SYNTHESIS: 'false'
      }
    }
  },

  // Integration test configuration
  integration: {
    description: 'Full integration tests across all features',
    testFiles: [
      'tests/integration/end-to-end.test.js',
      'tests/integration/performance.test.js',
      'tests/integration/regression.test.js'
    ],
    environment: {
      ENABLE_MULTI_JUDGE: 'true',
      ENABLE_FILE_PROCESSING: 'true',
      ENABLE_VOICE_SYNTHESIS: 'true'
    }
  },

  // Test utilities
  utilities: {
    timeout: 30000, // 30 seconds
    retries: 3,
    parallel: false, // Run tests sequentially for stability
    verbose: true,
    coverage: true
  }
};

module.exports = testConfig;
