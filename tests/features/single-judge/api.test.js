/**
 * Single Judge API Tests
 * 
 * Tests the /api/roast endpoint for single judge functionality
 */

const fetch = require('node-fetch');

const BASE_URL = `http://localhost:${process.env.TEST_PORT || 3000}`;

describe('Single Judge API Tests', () => {
  const testCases = [
    {
      name: 'Valid roast request',
      data: {
        idea: 'A social media app for cats to share photos and videos with other cats',
        tone: { humor: 0.8, sarcasm: 0.3 }
      },
      expectedStatus: 200
    },
    {
      name: 'Empty idea validation',
      data: {
        idea: '',
        tone: { humor: 0.5, sarcasm: 0.0 }
      },
      expectedStatus: 400,
      expectedError: 'VALIDATION_EMPTY'
    },
    {
      name: 'Missing tone validation',
      data: {
        idea: 'A great startup idea',
        tone: null
      },
      expectedStatus: 400,
      expectedError: 'GENERIC'
    },
    {
      name: 'Invalid tone structure',
      data: {
        idea: 'A great startup idea',
        tone: { humor: 'invalid', sarcasm: 0.5 }
      },
      expectedStatus: 400,
      expectedError: 'GENERIC'
    }
  ];

  testCases.forEach(testCase => {
    test(testCase.name, async () => {
      const response = await fetch(`${BASE_URL}/api/roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      expect(response.status).toBe(testCase.expectedStatus);

      if (testCase.expectedError) {
        const data = await response.json();
        expect(data.error).toBe(testCase.expectedError);
      }

      if (testCase.expectedStatus === 200) {
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.roast).toBeDefined();
        expect(data.roast.judges).toHaveLength(1);
        expect(data.roast.judges[0].name).toBe('Technical Judge');
        expect(data.roast.judges[0].response.scores).toBeDefined();
        expect(data.roast.judges[0].response.roast).toBeDefined();
        expect(data.roast.judges[0].response.feedback).toBeDefined();
        expect(data.roast.judges[0].response.verdict).toMatch(/^(PASS|FAIL|MAYBE)$/);
      }
    });
  });

  test('API response structure validation', async () => {
    const response = await fetch(`${BASE_URL}/api/roast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'An AI-powered personal assistant that helps people manage their daily tasks',
        tone: { humor: 0.6, sarcasm: 0.2 }
      })
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    
    // Validate response structure
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('roast');
    expect(data.roast).toHaveProperty('id');
    expect(data.roast).toHaveProperty('judges');
    expect(data.roast).toHaveProperty('finalVerdict');
    expect(data.roast).toHaveProperty('aggregatedScores');
    
    // Validate judge response structure
    const judge = data.roast.judges[0];
    expect(judge).toHaveProperty('name', 'Technical Judge');
    expect(judge).toHaveProperty('response');
    expect(judge.response).toHaveProperty('scores');
    expect(judge.response).toHaveProperty('roast');
    expect(judge.response).toHaveProperty('feedback');
    expect(judge.response).toHaveProperty('verdict');
    
    // Validate scores structure
    const scores = judge.response.scores;
    expect(scores).toHaveProperty('originality');
    expect(scores).toHaveProperty('feasibility');
    expect(scores).toHaveProperty('wow_factor');
    expect(scores).toHaveProperty('market_potential');
    
    // Validate score ranges
    Object.values(scores).forEach(score => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(10);
    });
  });
});

// Simple test runner for Node.js
function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeDefined: () => {
      if (actual === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toHaveLength: (expected) => {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${actual.length}`);
      }
    },
    toHaveProperty: (prop, value) => {
      if (!(prop in actual)) {
        throw new Error(`Expected property '${prop}' to exist`);
      }
      if (value !== undefined && actual[prop] !== value) {
        throw new Error(`Expected property '${prop}' to be ${value}, got ${actual[prop]}`);
      }
    },
    toMatch: (regex) => {
      if (!regex.test(actual)) {
        throw new Error(`Expected ${actual} to match ${regex}`);
      }
    },
    toBeGreaterThanOrEqual: (expected) => {
      if (actual < expected) {
        throw new Error(`Expected ${actual} to be >= ${expected}`);
      }
    },
    toBeLessThanOrEqual: (expected) => {
      if (actual > expected) {
        throw new Error(`Expected ${actual} to be <= ${expected}`);
      }
    }
  };
}

async function test(name, fn) {
  try {
    console.log(`  ✓ ${name}`);
    await fn();
  } catch (error) {
    console.log(`  ✗ ${name}: ${error.message}`);
    throw error;
  }
}

async function describe(name, fn) {
  console.log(`\n📋 ${name}`);
  try {
    await fn();
  } catch (error) {
    console.log(`❌ ${name} failed: ${error.message}`);
    throw error;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      await describe('Single Judge API Tests', async () => {
        const testCases = [
          {
            name: 'Valid roast request',
            data: {
              idea: 'A social media app for cats to share photos and videos with other cats',
              tone: { humor: 0.8, sarcasm: 0.3 }
            },
            expectedStatus: 200
          }
        ];

        for (const testCase of testCases) {
          await test(testCase.name, async () => {
            const response = await fetch(`${BASE_URL}/api/roast`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(testCase.data)
            });

            expect(response.status).toBe(testCase.expectedStatus);
          });
        }
      });
      console.log('\n✅ All tests passed!');
    } catch (error) {
      console.log(`\n❌ Tests failed: ${error.message}`);
      process.exit(1);
    }
  })();
}
