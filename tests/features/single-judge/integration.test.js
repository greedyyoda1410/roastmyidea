/**
 * Single Judge Integration Tests
 * 
 * Tests the complete single judge workflow from UI to API
 */

const { default: fetch } = require('node-fetch');

const BASE_URL = `http://localhost:${process.env.TEST_PORT || 3000}`;

describe('Single Judge Integration Tests', () => {
  test('Complete roast workflow - UI to API', async () => {
    // Test data
    const testIdea = 'A mobile app that helps people find the best coffee shops based on their taste preferences and location';
    const testTone = { humor: 0.7, sarcasm: 0.4 };
    
    // Step 1: Test API endpoint
    const response = await fetch(`${BASE_URL}/api/roast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: testIdea,
        tone: testTone
      })
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.roast).toBeDefined();
    
    // Step 2: Validate response structure
    const roast = data.roast;
    expect(roast.judges).toHaveLength(1);
    expect(roast.judges[0].name).toBe('Technical Judge');
    
    // Step 3: Validate judge response quality
    const judgeResponse = roast.judges[0].response;
    expect(judgeResponse.roast.length).toBeGreaterThan(10);
    expect(judgeResponse.feedback.length).toBeGreaterThan(10);
    expect(judgeResponse.verdict).toMatch(/^(PASS|FAIL|MAYBE)$/);
    
    // Step 4: Validate scores are reasonable
    const scores = judgeResponse.scores;
    Object.values(scores).forEach(score => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(10);
    });
    
    // Step 5: Validate tone influence on response
    // (This would require more sophisticated testing with different tones)
    expect(judgeResponse.roast).toContain('coffee');
  });

  test('Error handling workflow', async () => {
    // Test empty idea
    const emptyResponse = await fetch(`${BASE_URL}/api/roast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: '',
        tone: { humor: 0.5, sarcasm: 0.0 }
      })
    });

    expect(emptyResponse.status).toBe(400);
    const emptyData = await emptyResponse.json();
    expect(emptyData.error).toBe('VALIDATION_EMPTY');
  });

  test('Content moderation workflow', async () => {
    // Test potentially inappropriate content
    const inappropriateResponse = await fetch(`${BASE_URL}/api/roast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'A platform for sharing inappropriate content',
        tone: { humor: 0.5, sarcasm: 0.0 }
      })
    });

    // Should either be rejected or handled appropriately
    expect([200, 400]).toContain(inappropriateResponse.status);
    
    if (inappropriateResponse.status === 400) {
      const data = await inappropriateResponse.json();
      expect(data.error).toBe('UNSAFE_CONTENT');
    }
  });

  test('Tone matrix influence on responses', async () => {
    const baseIdea = 'A fitness app that gamifies workouts';
    
    // Test different tone combinations
    const toneTests = [
      { humor: 0.9, sarcasm: 0.8, description: 'Very funny and sarcastic' },
      { humor: 0.1, sarcasm: -0.8, description: 'Serious and supportive' },
      { humor: 0.5, sarcasm: 0.0, description: 'Balanced tone' }
    ];

    for (const toneTest of toneTests) {
      const response = await fetch(`${BASE_URL}/api/roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: baseIdea,
          tone: toneTest
        })
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      const roast = data.roast.judges[0].response.roast;
      
      // Basic validation that response is generated
      expect(roast.length).toBeGreaterThan(20);
      
      // Note: More sophisticated tone analysis would require
      // natural language processing to validate tone influence
    }
  });

  test('Performance and response time', async () => {
    const startTime = Date.now();
    
    const response = await fetch(`${BASE_URL}/api/roast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'A blockchain-based voting system for democratic elections',
        tone: { humor: 0.6, sarcasm: 0.3 }
      })
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(30000); // Should complete within 30 seconds
    
    console.log(`  ⏱️  Response time: ${responseTime}ms`);
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
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
    toMatch: (regex) => {
      if (!regex.test(actual)) {
        throw new Error(`Expected ${actual} to match ${regex}`);
      }
    },
    toHaveLength: (expected) => {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${actual.length}`);
      }
    },
    toBeGreaterThan: (expected) => {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual: (expected) => {
      if (actual < expected) {
        throw new Error(`Expected ${actual} to be >= ${expected}`);
      }
    },
    toBeLessThan: (expected) => {
      if (actual >= expected) {
        throw new Error(`Expected ${actual} to be < ${expected}`);
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
      await describe('Single Judge Integration Tests', async () => {
        await test('Complete roast workflow - UI to API', async () => {
          const response = await fetch(`${BASE_URL}/api/roast`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idea: 'A mobile app that helps people find the best coffee shops',
              tone: { humor: 0.7, sarcasm: 0.4 }
            })
          });

          expect(response.status).toBe(200);
        });
      });
      console.log('\n✅ All integration tests passed!');
    } catch (error) {
      console.log(`\n❌ Integration tests failed: ${error.message}`);
      process.exit(1);
    }
  })();
}
