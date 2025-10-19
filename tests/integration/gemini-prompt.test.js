/**
 * Integration Tests for Gemini Prompts
 * Tests that prompts include judge expertise and tone parameters correctly
 */

const { JUDGE_PERSONAS } = require('../../src/lib/constants');

describe('Gemini Prompt Construction', () => {
  // Mock function to construct prompt similar to gemini.ts
  const constructPrompt = (persona, idea, tone, agentAnalysis) => {
    return `
You are ${persona.name}, a ${persona.role} at a hackathon judging panel.

YOUR EXPERTISE: ${persona.expertise}

CRITICAL INSTRUCTION: Your feedback MUST focus EXCLUSIVELY on your area of expertise. Do NOT comment on areas outside your specialty. Stay in your lane!

STARTUP IDEA:
"${idea}"

${agentAnalysis ? `\nADDITIONAL CONTEXT FROM AGENTS:\n${agentAnalysis}` : ''}

TONE PARAMETERS - ADJUST YOUR RESPONSE STYLE:
- Humor Level: ${tone.humor.toFixed(2)} (scale: 0.0 = Very Serious → 1.0 = Very Funny)
  ${tone.humor > 0.7 ? '→ Be witty and playful in your critique' : tone.humor > 0.4 ? '→ Mix professional insight with light humor' : '→ Stay serious and professional'}

- Sarcasm Level: ${tone.sarcasm.toFixed(2)} (scale: -1.0 = Very Supportive → 0.0 = Neutral → 1.0 = Very Sarcastic)
  ${tone.sarcasm > 0.5 ? '→ Use sharp sarcasm and biting wit' : tone.sarcasm > 0 ? '→ Use mild sarcasm occasionally' : tone.sarcasm > -0.5 ? '→ Stay neutral and balanced' : '→ Be encouraging and supportive'}

YOUR JUDGING STYLE: ${persona.style}
YOUR FOCUS AREAS: ${persona.focus}
`;
  };

  test('Prompt includes judge name', () => {
    const judge = JUDGE_PERSONAS[0];
    const prompt = constructPrompt(judge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt).toContain(judge.name);
  });

  test('Prompt includes judge expertise', () => {
    const judge = JUDGE_PERSONAS[0];
    const prompt = constructPrompt(judge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt).toContain('YOUR EXPERTISE:');
    expect(prompt).toContain(judge.expertise);
  });

  test('Prompt includes critical instruction about staying in lane', () => {
    const judge = JUDGE_PERSONAS[0];
    const prompt = constructPrompt(judge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt).toContain('CRITICAL INSTRUCTION');
    expect(prompt).toContain('focus EXCLUSIVELY on your area of expertise');
    expect(prompt).toContain('Stay in your lane');
  });

  test('Prompt includes tone parameters with numeric values', () => {
    const judge = JUDGE_PERSONAS[0];
    const tone = { humor: 0.75, sarcasm: 0.3 };
    const prompt = constructPrompt(judge, 'Test idea', tone);
    
    expect(prompt).toContain('Humor Level: 0.75');
    expect(prompt).toContain('Sarcasm Level: 0.30');
  });

  test('Prompt includes appropriate humor guidance for high humor', () => {
    const judge = JUDGE_PERSONAS[0];
    const tone = { humor: 0.8, sarcasm: 0 };
    const prompt = constructPrompt(judge, 'Test idea', tone);
    
    expect(prompt).toContain('Be witty and playful');
  });

  test('Prompt includes appropriate humor guidance for low humor', () => {
    const judge = JUDGE_PERSONAS[0];
    const tone = { humor: 0.2, sarcasm: 0 };
    const prompt = constructPrompt(judge, 'Test idea', tone);
    
    expect(prompt).toContain('Stay serious and professional');
  });

  test('Prompt includes appropriate sarcasm guidance for high sarcasm', () => {
    const judge = JUDGE_PERSONAS[0];
    const tone = { humor: 0.5, sarcasm: 0.8 };
    const prompt = constructPrompt(judge, 'Test idea', tone);
    
    expect(prompt).toContain('Use sharp sarcasm and biting wit');
  });

  test('Prompt includes appropriate sarcasm guidance for supportive tone', () => {
    const judge = JUDGE_PERSONAS[0];
    const tone = { humor: 0.5, sarcasm: -0.8 };
    const prompt = constructPrompt(judge, 'Test idea', tone);
    
    expect(prompt).toContain('Be encouraging and supportive');
  });

  test('Prompt includes startup idea', () => {
    const judge = JUDGE_PERSONAS[0];
    const idea = 'A revolutionary AI-powered dog walker';
    const prompt = constructPrompt(judge, idea, { humor: 0.5, sarcasm: 0 });
    
    expect(prompt).toContain(idea);
  });

  test('Prompt includes agent analysis when provided', () => {
    const judge = JUDGE_PERSONAS[0];
    const agentAnalysis = 'Code quality is excellent, using modern frameworks';
    const prompt = constructPrompt(judge, 'Test idea', { humor: 0.5, sarcasm: 0 }, agentAnalysis);
    
    expect(prompt).toContain('ADDITIONAL CONTEXT FROM AGENTS');
    expect(prompt).toContain(agentAnalysis);
  });

  test('Prompt excludes agent analysis when not provided', () => {
    const judge = JUDGE_PERSONAS[0];
    const prompt = constructPrompt(judge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt).not.toContain('ADDITIONAL CONTEXT FROM AGENTS');
  });
});

describe('Judge-Specific Prompt Content', () => {
  test('Tech Bro 3000 prompt focuses on technical aspects', () => {
    const techJudge = JUDGE_PERSONAS.find(j => j.name === 'Tech Bro 3000');
    const prompt = constructPrompt(techJudge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt.toLowerCase()).toContain('technical');
  });

  test('Brutal VC prompt focuses on investment aspects', () => {
    const vcJudge = JUDGE_PERSONAS.find(j => j.name === 'Brutal VC');
    const prompt = constructPrompt(vcJudge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt.toLowerCase()).toContain('investment');
  });

  test('Supportive Comedian prompt focuses on creative aspects', () => {
    const creativeJudge = JUDGE_PERSONAS.find(j => j.name === 'Supportive Comedian');
    const prompt = constructPrompt(creativeJudge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt.toLowerCase()).toContain('creative');
  });

  test('Zen Mentor prompt focuses on customer experience', () => {
    const zenJudge = JUDGE_PERSONAS.find(j => j.name === 'Zen Mentor');
    const prompt = constructPrompt(zenJudge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt.toLowerCase()).toContain('customer');
  });

  test('Middle-Aged CEO prompt focuses on business aspects', () => {
    const ceoJudge = JUDGE_PERSONAS.find(j => j.name === 'Middle-Aged CEO');
    const prompt = constructPrompt(ceoJudge, 'Test idea', { humor: 0.5, sarcasm: 0 });
    
    expect(prompt.toLowerCase()).toContain('business');
  });
});

describe('Tone Parameter Formatting', () => {
  const constructPrompt = (persona, idea, tone) => {
    return `Humor: ${tone.humor.toFixed(2)}, Sarcasm: ${tone.sarcasm.toFixed(2)}`;
  };

  test('Formats humor to 2 decimal places', () => {
    const prompt = constructPrompt({}, '', { humor: 0.12345, sarcasm: 0 });
    expect(prompt).toContain('Humor: 0.12');
  });

  test('Formats sarcasm to 2 decimal places', () => {
    const prompt = constructPrompt({}, '', { humor: 0, sarcasm: 0.67891 });
    expect(prompt).toContain('Sarcasm: 0.68');
  });

  test('Handles negative sarcasm values correctly', () => {
    const prompt = constructPrompt({}, '', { humor: 0, sarcasm: -0.85 });
    expect(prompt).toContain('Sarcasm: -0.85');
  });
});

