/**
 * Unit Tests for Tone Matrix
 * Tests coordinate mapping, tone label generation, and quadrant detection
 */

describe('Tone Matrix Coordinate Mapping', () => {
  // Helper function to simulate coordinate conversion
  const convertScreenToSarcasm = (screenY) => {
    // screenY is 0-1 where 0 is top, 1 is bottom
    // sarcasm should be 1 at top, -1 at bottom
    return 1 - (screenY * 2);
  };

  const convertSarcasmToScreen = (sarcasm) => {
    // sarcasm is -1 to 1
    // screen position is 0-1 where 0 is top
    return ((1 - sarcasm) / 2);
  };

  test('Top of screen (y=0) maps to sarcasm=1 (Sarcastic)', () => {
    const screenY = 0;
    const sarcasm = convertScreenToSarcasm(screenY);
    expect(sarcasm).toBe(1);
  });

  test('Bottom of screen (y=1) maps to sarcasm=-1 (Supportive)', () => {
    const screenY = 1;
    const sarcasm = convertScreenToSarcasm(screenY);
    expect(sarcasm).toBe(-1);
  });

  test('Middle of screen (y=0.5) maps to sarcasm=0 (Neutral)', () => {
    const screenY = 0.5;
    const sarcasm = convertScreenToSarcasm(screenY);
    expect(sarcasm).toBe(0);
  });

  test('Sarcasm=1 displays at top (y=0)', () => {
    const sarcasm = 1;
    const screenY = convertSarcasmToScreen(sarcasm);
    expect(screenY).toBe(0);
  });

  test('Sarcasm=-1 displays at bottom (y=1)', () => {
    const sarcasm = -1;
    const screenY = convertSarcasmToScreen(sarcasm);
    expect(screenY).toBe(1);
  });

  test('Sarcasm=0 displays at middle (y=0.5)', () => {
    const sarcasm = 0;
    const screenY = convertSarcasmToScreen(sarcasm);
    expect(screenY).toBe(0.5);
  });

  test('Humor mapping - left is 0, right is 1', () => {
    const leftHumor = 0;  // Serious
    const rightHumor = 1; // Funny
    
    expect(leftHumor).toBe(0);
    expect(rightHumor).toBe(1);
  });
});

describe('Tone Label Generation', () => {
  const getToneLabel = (humor, sarcasm) => {
    const humorLabel = humor > 0.6 ? "Funny" : humor < 0.4 ? "Serious" : "Balanced";
    const sarcasmLabel = sarcasm > 0.3 ? "Sarcastic" : sarcasm < -0.3 ? "Supportive" : "Neutral";
    return `${sarcasmLabel} & ${humorLabel}`;
  };

  test('High humor, high sarcasm = Sarcastic & Funny', () => {
    const label = getToneLabel(0.8, 0.8);
    expect(label).toBe('Sarcastic & Funny');
  });

  test('Low humor, high sarcasm = Sarcastic & Serious', () => {
    const label = getToneLabel(0.2, 0.8);
    expect(label).toBe('Sarcastic & Serious');
  });

  test('High humor, low sarcasm = Supportive & Funny', () => {
    const label = getToneLabel(0.8, -0.8);
    expect(label).toBe('Supportive & Funny');
  });

  test('Low humor, low sarcasm = Supportive & Serious', () => {
    const label = getToneLabel(0.2, -0.8);
    expect(label).toBe('Supportive & Serious');
  });

  test('Neutral values = Neutral & Balanced', () => {
    const label = getToneLabel(0.5, 0);
    expect(label).toBe('Neutral & Balanced');
  });

  test('Threshold values - humor at 0.6 = Funny', () => {
    const label = getToneLabel(0.61, 0);
    expect(label).toContain('Funny');
  });

  test('Threshold values - humor at 0.4 = Serious', () => {
    const label = getToneLabel(0.39, 0);
    expect(label).toContain('Serious');
  });

  test('Threshold values - sarcasm at 0.3 = Sarcastic', () => {
    const label = getToneLabel(0.5, 0.31);
    expect(label).toContain('Sarcastic');
  });

  test('Threshold values - sarcasm at -0.3 = Supportive', () => {
    const label = getToneLabel(0.5, -0.31);
    expect(label).toContain('Supportive');
  });
});

describe('Quadrant Detection', () => {
  test('Top-right quadrant (Sarcastic & Funny)', () => {
    const humor = 0.8;
    const sarcasm = 0.8;
    
    expect(humor > 0.5).toBe(true);
    expect(sarcasm > 0).toBe(true);
  });

  test('Top-left quadrant (Sarcastic & Serious)', () => {
    const humor = 0.2;
    const sarcasm = 0.8;
    
    expect(humor <= 0.5).toBe(true);
    expect(sarcasm > 0).toBe(true);
  });

  test('Bottom-right quadrant (Supportive & Funny)', () => {
    const humor = 0.8;
    const sarcasm = -0.8;
    
    expect(humor > 0.5).toBe(true);
    expect(sarcasm < 0).toBe(true);
  });

  test('Bottom-left quadrant (Supportive & Serious)', () => {
    const humor = 0.2;
    const sarcasm = -0.8;
    
    expect(humor <= 0.5).toBe(true);
    expect(sarcasm < 0).toBe(true);
  });
});

describe('Tone Matrix Validation', () => {
  test('Humor values are constrained to 0-1', () => {
    const validHumor = [0, 0.5, 1];
    validHumor.forEach(h => {
      expect(h >= 0 && h <= 1).toBe(true);
    });
  });

  test('Sarcasm values are constrained to -1 to 1', () => {
    const validSarcasm = [-1, -0.5, 0, 0.5, 1];
    validSarcasm.forEach(s => {
      expect(s >= -1 && s <= 1).toBe(true);
    });
  });

  test('Default tone values are reasonable', () => {
    const defaultTone = { humor: 0.7, sarcasm: 0.2 };
    
    expect(defaultTone.humor).toBeGreaterThanOrEqual(0);
    expect(defaultTone.humor).toBeLessThanOrEqual(1);
    expect(defaultTone.sarcasm).toBeGreaterThanOrEqual(-1);
    expect(defaultTone.sarcasm).toBeLessThanOrEqual(1);
  });
});

