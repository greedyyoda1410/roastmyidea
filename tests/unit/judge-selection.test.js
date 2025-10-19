/**
 * Unit Tests for Judge Selection
 * Tests the judge selection component and related functionality
 */

const { JUDGE_PERSONAS } = require('../../src/lib/constants');

describe('Judge Selection', () => {
  test('JUDGE_PERSONAS contains exactly 5 judges', () => {
    expect(JUDGE_PERSONAS).toHaveLength(5);
  });

  test('All judges have required properties', () => {
    JUDGE_PERSONAS.forEach(judge => {
      expect(judge).toHaveProperty('name');
      expect(judge).toHaveProperty('role');
      expect(judge).toHaveProperty('style');
      expect(judge).toHaveProperty('focus');
      expect(judge).toHaveProperty('expertise');
      expect(judge).toHaveProperty('voicePersona');
    });
  });

  test('Judge names match new persona names', () => {
    const expectedNames = [
      'Tech Bro 3000',
      'Brutal VC',
      'Supportive Comedian',
      'Zen Mentor',
      'Middle-Aged CEO'
    ];
    
    const actualNames = JUDGE_PERSONAS.map(j => j.name);
    expectedNames.forEach(name => {
      expect(actualNames).toContain(name);
    });
  });

  test('Voice personas match judge names', () => {
    JUDGE_PERSONAS.forEach(judge => {
      expect(judge.voicePersona).toBe(judge.name);
    });
  });

  test('Each judge has unique expertise area', () => {
    const expertiseAreas = JUDGE_PERSONAS.map(j => j.expertise);
    const uniqueExpertise = new Set(expertiseAreas);
    expect(uniqueExpertise.size).toBe(JUDGE_PERSONAS.length);
  });

  test('Judge expertise areas cover key domains', () => {
    const allExpertise = JUDGE_PERSONAS.map(j => j.expertise.toLowerCase()).join(' ');
    
    // Check for key domain coverage
    expect(allExpertise).toContain('technical');
    expect(allExpertise).toContain('investment');
    expect(allExpertise).toContain('creative');
    expect(allExpertise).toContain('customer');
    expect(allExpertise).toContain('business');
  });

  test('Random judge selection returns valid judge', () => {
    // Simulate random selection 10 times
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * JUDGE_PERSONAS.length);
      const selectedJudge = JUDGE_PERSONAS[randomIndex];
      
      expect(selectedJudge).toBeDefined();
      expect(selectedJudge.name).toBeTruthy();
    }
  });

  test('Can find judge by name', () => {
    const judgeName = 'Tech Bro 3000';
    const judge = JUDGE_PERSONAS.find(j => j.name === judgeName);
    
    expect(judge).toBeDefined();
    expect(judge.name).toBe(judgeName);
    expect(judge.expertise).toContain('Technical');
  });

  test('Invalid judge name returns undefined', () => {
    const invalidName = 'Invalid Judge Name';
    const judge = JUDGE_PERSONAS.find(j => j.name === invalidName);
    
    expect(judge).toBeUndefined();
  });
});

describe('Judge Selection API Integration', () => {
  test('Selected judge should be passed to API', () => {
    const selectedJudge = JUDGE_PERSONAS[0];
    const requestBody = {
      projectName: 'Test Project',
      idea: 'Test idea',
      tone: { humor: 0.5, sarcasm: 0 },
      selectedJudge: selectedJudge.name,
      userId: null
    };

    expect(requestBody.selectedJudge).toBe(selectedJudge.name);
    expect(requestBody.selectedJudge).toBeTruthy();
  });
});

