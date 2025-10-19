import { NextRequest, NextResponse } from 'next/server';
import { generateRoast, moderateContent } from '@/lib/gemini';
import { db } from '@/lib/db';
import { roasts } from '@/lib/db/schema';
import { type ToneMatrix } from '@/types';
import { JUDGE_PERSONAS } from '@/lib/constants';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('[Roast API] Request received');
    const { projectName, idea, tone, userId, agentAnalysis } = await request.json();

    // Validate project name
    if (!projectName || typeof projectName !== 'string' || projectName.trim().length === 0) {
      console.log('[Roast API] Validation failed: Missing project name');
      return NextResponse.json(
        { error: 'VALIDATION_EMPTY', message: 'Project name is required' },
        { status: 400 }
      );
    }

    // Validate idea
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      console.log('[Roast API] Validation failed: Missing idea');
      return NextResponse.json(
        { error: 'VALIDATION_EMPTY', message: 'Startup idea is required' },
        { status: 400 }
      );
    }

    if (!tone || typeof tone.humor !== 'number' || typeof tone.sarcasm !== 'number') {
      console.log('[Roast API] Validation failed: Invalid tone');
      return NextResponse.json(
        { error: 'GENERIC' },
        { status: 400 }
      );
    }

    console.log('[Roast API] Starting content moderation');
    // Content moderation
    const isSafe = await moderateContent(idea);
    if (!isSafe) {
      console.log('[Roast API] Content moderation failed: Unsafe content detected');
      return NextResponse.json(
        { error: 'UNSAFE_CONTENT' },
        { status: 400 }
      );
    }
    console.log('[Roast API] Content moderation passed');

    // Check if multi-judge is enabled
    const enableMultiJudge = process.env.ENABLE_MULTI_JUDGE === 'true';
    console.log('[Roast API] Multi-judge mode:', enableMultiJudge);
    
    const judgeResults = [];
    
    if (enableMultiJudge) {
      console.log('[Roast API] Generating roasts from 3 judges');
      // Generate roasts from all 3 judges sequentially
      for (const judge of JUDGE_PERSONAS) {
        console.log(`[Roast API] Generating roast from: ${judge.name}`);
        // Apply slight tone variations per judge
        const judgeTone: ToneMatrix = {
          humor: judge.name === 'Business Judge' ? tone.humor + 0.1 : tone.humor,
          sarcasm: judge.name === 'Technical Judge' ? tone.sarcasm + 0.2 : 
                   judge.name === 'Creative Judge' ? tone.sarcasm - 0.1 : tone.sarcasm
        };
        
        // Clamp values
        judgeTone.humor = Math.max(0, Math.min(1, judgeTone.humor));
        judgeTone.sarcasm = Math.max(-1, Math.min(1, judgeTone.sarcasm));
        
        try {
          const judgeResponse = await generateRoast(idea, judgeTone, judge, agentAnalysis);
          console.log(`[Roast API] Successfully generated roast from: ${judge.name}`);
          judgeResults.push({
            name: judge.name,
            response: judgeResponse
          });
        } catch (error) {
          console.error(`[Roast API] Failed to generate roast from ${judge.name}:`, error);
          throw error; // Re-throw to be caught by main catch block
        }
      }
    } else {
      console.log('[Roast API] Generating roast from single judge');
      // Single judge mode (Technical Judge only)
      const technicalJudge = JUDGE_PERSONAS[0];
      const judgeResponse = await generateRoast(idea, tone as ToneMatrix, technicalJudge, agentAnalysis);
      console.log('[Roast API] Successfully generated single judge roast');
      judgeResults.push({
        name: technicalJudge.name,
        response: judgeResponse
      });
    }

    // Calculate aggregated scores and final verdict
    const aggregatedScores = {
      originality: 0,
      feasibility: 0,
      wow_factor: 0,
      market_potential: 0
    };
    
    let passCount = 0;
    let failCount = 0;
    let maybeCount = 0;
    
    judgeResults.forEach(judge => {
      aggregatedScores.originality += judge.response.scores.originality;
      aggregatedScores.feasibility += judge.response.scores.feasibility;
      aggregatedScores.wow_factor += judge.response.scores.wow_factor;
      aggregatedScores.market_potential += judge.response.scores.market_potential;
      
      if (judge.response.verdict === 'PASS') passCount++;
      else if (judge.response.verdict === 'FAIL') failCount++;
      else maybeCount++;
    });
    
    // Average the scores
    const judgeCount = judgeResults.length;
    aggregatedScores.originality = Math.round((aggregatedScores.originality / judgeCount) * 10) / 10;
    aggregatedScores.feasibility = Math.round((aggregatedScores.feasibility / judgeCount) * 10) / 10;
    aggregatedScores.wow_factor = Math.round((aggregatedScores.wow_factor / judgeCount) * 10) / 10;
    aggregatedScores.market_potential = Math.round((aggregatedScores.market_potential / judgeCount) * 10) / 10;
    
    // Determine final verdict by majority
    let finalVerdict: 'PASS' | 'FAIL' | 'MAYBE';
    if (passCount > failCount && passCount > maybeCount) {
      finalVerdict = 'PASS';
    } else if (failCount > passCount && failCount > maybeCount) {
      finalVerdict = 'FAIL';
    } else {
      finalVerdict = 'MAYBE';
    }

    console.log('[Roast API] Saving to database');
    // Save to database (temporarily skip userId until schema is fixed)
    const roastData = {
      // userId: userId || null, // Temporarily commented out
      projectName: projectName,
      ideaText: idea,
      toneHumor: tone.humor,
      toneSarcasm: tone.sarcasm,
      judgesData: { judges: judgeResults },
      finalVerdict: finalVerdict,
      scores: aggregatedScores,
    };

    try {
      const [savedRoast] = await db.insert(roasts).values(roastData).returning();
      console.log('[Roast API] Successfully saved to database, ID:', savedRoast.id);

      return NextResponse.json({
        success: true,
        roast: {
          id: savedRoast.id,
          judges: judgeResults,
          finalVerdict: finalVerdict,
          aggregatedScores: aggregatedScores,
        }
      });
    } catch (dbError) {
      console.error('[Roast API] Database save failed:', dbError);
      throw dbError; // Re-throw to be caught by main catch block
    }

  } catch (error) {
    console.error('Error in /api/roast:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name
    });
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      console.error('JSON parsing failed in Gemini response');
      return NextResponse.json(
        { error: 'PARSE_FAIL' },
        { status: 500 }
      );
    }
    
    if (error instanceof Error && error.message.includes('quota')) {
      console.error('API quota exceeded');
      return NextResponse.json(
        { error: 'NETWORK_QUOTA' },
        { status: 429 }
      );
    }

    // Check for Gemini API errors
    if (error instanceof Error && (
      error.message.includes('API key') || 
      error.message.includes('authentication') ||
      error.message.includes('GOOGLE_API_KEY')
    )) {
      console.error('Gemini API authentication failed');
      return NextResponse.json(
        { error: 'GENERIC', details: 'AI service authentication failed' },
        { status: 500 }
      );
    }

    // Check for database errors
    if (error instanceof Error && (
      error.message.includes('database') || 
      error.message.includes('postgres') ||
      error.message.includes('connection')
    )) {
      console.error('Database operation failed');
      return NextResponse.json(
        { error: 'GENERIC', details: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'GENERIC', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
