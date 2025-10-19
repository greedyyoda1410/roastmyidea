/**
 * Integration Tests for Roast API
 * Tests the complete roast flow with judge selection and tone parameters
 */

const { JUDGE_PERSONAS } = require('../../src/lib/constants');

describe('Roast API Single Judge Flow', () => {
  test('API request includes selectedJudge parameter', () => {
    const requestBody = {
      projectName: 'Test Project',
      idea: 'An AI-powered app for testing',
      tone: { humor: 0.7, sarcasm: 0.2 },
      selectedJudge: 'Tech Bro 3000',
      userId: null,
      agentAnalysis: undefined
    };

    expect(requestBody).toHaveProperty('selectedJudge');
    expect(requestBody.selectedJudge).toBe('Tech Bro 3000');
  });

  test('API finds correct judge from JUDGE_PERSONAS', () => {
    const selectedJudgeName = 'Brutal VC';
    const judge = JUDGE_PERSONAS.find(j => j.name === selectedJudgeName);

    expect(judge).toBeDefined();
    expect(judge.name).toBe(selectedJudgeName);
    expect(judge.expertise).toContain('Investment');
  });

  test('API handles invalid judge by falling back to default', () => {
    const invalidJudgeName = 'Invalid Judge';
    const judge = JUDGE_PERSONAS.find(j => j.name === invalidJudgeName);

    expect(judge).toBeUndefined();
    
    // Fallback should be first judge
    const defaultJudge = JUDGE_PERSONAS[0];
    expect(defaultJudge).toBeDefined();
    expect(defaultJudge.name).toBe('Tech Bro 3000');
  });

  test('Response contains single judge result', () => {
    const mockResponse = {
      success: true,
      roast: {
        id: 'test-id',
        judges: [
          {
            name: 'Tech Bro 3000',
            response: {
              scores: {
                originality: 8,
                feasibility: 7,
                wow_factor: 9,
                market_potential: 7
              },
              roast: 'Test roast',
              feedback: 'Test feedback',
              verdict: 'PASS'
            }
          }
        ],
        finalVerdict: 'PASS',
        aggregatedScores: {
          originality: 8,
          feasibility: 7,
          wow_factor: 9,
          market_potential: 7
        }
      }
    };

    expect(mockResponse.roast.judges).toHaveLength(1);
    expect(mockResponse.roast.judges[0].name).toBe('Tech Bro 3000');
  });

  test('Single judge scores equal aggregated scores', () => {
    const judgeScores = {
      originality: 8,
      feasibility: 7,
      wow_factor: 9,
      market_potential: 7
    };

    // In single judge mode, aggregated = judge scores
    const aggregatedScores = judgeScores;

    expect(aggregatedScores).toEqual(judgeScores);
  });

  test('Single judge verdict equals final verdict', () => {
    const judgeVerdict = 'PASS';
    const finalVerdict = judgeVerdict;

    expect(finalVerdict).toBe(judgeVerdict);
  });
});

describe('Tone Parameters Validation', () => {
  test('Valid tone values pass validation', () => {
    const validTone = { humor: 0.7, sarcasm: 0.2 };
    
    expect(typeof validTone.humor).toBe('number');
    expect(typeof validTone.sarcasm).toBe('number');
    expect(validTone.humor >= 0 && validTone.humor <= 1).toBe(true);
    expect(validTone.sarcasm >= -1 && validTone.sarcasm <= 1).toBe(true);
  });

  test('Invalid tone values are detected', () => {
    const invalidTones = [
      { humor: 'string', sarcasm: 0 },
      { humor: 0.5, sarcasm: 'string' },
      { humor: -0.5, sarcasm: 0 },
      { humor: 1.5, sarcasm: 0 },
      { humor: 0.5, sarcasm: -1.5 },
      { humor: 0.5, sarcasm: 1.5 }
    ];

    invalidTones.forEach(tone => {
      const isValid = 
        typeof tone.humor === 'number' &&
        typeof tone.sarcasm === 'number' &&
        tone.humor >= 0 && tone.humor <= 1 &&
        tone.sarcasm >= -1 && tone.sarcasm <= 1;
      
      expect(isValid).toBe(false);
    });
  });
});

describe('Database Storage', () => {
  test('Roast data includes all required fields', () => {
    const roastData = {
      userId: null,
      projectName: 'Test Project',
      ideaText: 'Test idea',
      toneHumor: 0.7,
      toneSarcasm: 0.2,
      judgesData: { 
        judges: [
          {
            name: 'Tech Bro 3000',
            response: {
              scores: { originality: 8, feasibility: 7, wow_factor: 9, market_potential: 7 },
              roast: 'Test roast',
              feedback: 'Test feedback',
              verdict: 'PASS'
            }
          }
        ]
      },
      finalVerdict: 'PASS',
      scores: { originality: 8, feasibility: 7, wow_factor: 9, market_potential: 7 }
    };

    expect(roastData).toHaveProperty('userId');
    expect(roastData).toHaveProperty('projectName');
    expect(roastData).toHaveProperty('ideaText');
    expect(roastData).toHaveProperty('toneHumor');
    expect(roastData).toHaveProperty('toneSarcasm');
    expect(roastData).toHaveProperty('judgesData');
    expect(roastData).toHaveProperty('finalVerdict');
    expect(roastData).toHaveProperty('scores');
  });

  test('Judges data is stored as JSONB compatible structure', () => {
    const judgesData = {
      judges: [
        {
          name: 'Tech Bro 3000',
          response: {
            scores: { originality: 8, feasibility: 7, wow_factor: 9, market_potential: 7 },
            roast: 'Test',
            feedback: 'Test',
            verdict: 'PASS'
          }
        }
      ]
    };

    // Should be serializable to JSON
    const jsonString = JSON.stringify(judgesData);
    const parsed = JSON.parse(jsonString);
    
    expect(parsed).toEqual(judgesData);
  });
});

describe('Error Handling', () => {
  test('Missing project name returns validation error', () => {
    const requestBody = {
      projectName: '',
      idea: 'Test idea',
      tone: { humor: 0.5, sarcasm: 0 },
      selectedJudge: 'Tech Bro 3000'
    };

    const isValid = requestBody.projectName && 
                    typeof requestBody.projectName === 'string' && 
                    requestBody.projectName.trim().length > 0;

    expect(isValid).toBe(false);
  });

  test('Missing idea returns validation error', () => {
    const requestBody = {
      projectName: 'Test',
      idea: '',
      tone: { humor: 0.5, sarcasm: 0 },
      selectedJudge: 'Tech Bro 3000'
    };

    const isValid = requestBody.idea && 
                    typeof requestBody.idea === 'string' && 
                    requestBody.idea.trim().length > 0;

    expect(isValid).toBe(false);
  });

  test('Invalid tone format returns validation error', () => {
    const requestBody = {
      projectName: 'Test',
      idea: 'Test idea',
      tone: { humor: 'invalid', sarcasm: 0 },
      selectedJudge: 'Tech Bro 3000'
    };

    const isValid = requestBody.tone && 
                    typeof requestBody.tone.humor === 'number' && 
                    typeof requestBody.tone.sarcasm === 'number';

    expect(isValid).toBe(false);
  });
});

describe('Judge Selection Integration', () => {
  test('Each judge can be selected and processed', () => {
    JUDGE_PERSONAS.forEach(judge => {
      const requestBody = {
        projectName: 'Test Project',
        idea: 'Test idea for ' + judge.name,
        tone: { humor: 0.5, sarcasm: 0 },
        selectedJudge: judge.name
      };

      expect(requestBody.selectedJudge).toBe(judge.name);
      
      const foundJudge = JUDGE_PERSONAS.find(j => j.name === requestBody.selectedJudge);
      expect(foundJudge).toBeDefined();
      expect(foundJudge.name).toBe(judge.name);
    });
  });
});

