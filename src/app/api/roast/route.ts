import { NextRequest, NextResponse } from 'next/server';
import { generateRoast, moderateContent } from '@/lib/gemini';
import { db } from '@/lib/db';
import { roasts } from '@/lib/db/schema';
import { type ToneMatrix } from '@/types';
import { JUDGE_PERSONAS } from '@/lib/constants';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { idea, tone } = await request.json();

    // Validate input
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return NextResponse.json(
        { error: 'VALIDATION_EMPTY' },
        { status: 400 }
      );
    }

    if (!tone || typeof tone.humor !== 'number' || typeof tone.sarcasm !== 'number') {
      return NextResponse.json(
        { error: 'GENERIC' },
        { status: 400 }
      );
    }

    // Content moderation
    const isSafe = await moderateContent(idea);
    if (!isSafe) {
      return NextResponse.json(
        { error: 'UNSAFE_CONTENT' },
        { status: 400 }
      );
    }

    // Check if multi-judge is enabled
    const enableMultiJudge = process.env.ENABLE_MULTI_JUDGE === 'true';
    
    const judgeResults = [];
    
    if (enableMultiJudge) {
      // Generate roasts from all 3 judges sequentially
      for (const judge of JUDGE_PERSONAS) {
        // Apply slight tone variations per judge
        const judgeTone: ToneMatrix = {
          humor: judge.name === 'Business Judge' ? tone.humor + 0.1 : tone.humor,
          sarcasm: judge.name === 'Technical Judge' ? tone.sarcasm + 0.2 : 
                   judge.name === 'Creative Judge' ? tone.sarcasm - 0.1 : tone.sarcasm
        };
        
        // Clamp values
        judgeTone.humor = Math.max(0, Math.min(1, judgeTone.humor));
        judgeTone.sarcasm = Math.max(-1, Math.min(1, judgeTone.sarcasm));
        
        const judgeResponse = await generateRoast(idea, judgeTone, judge);
        judgeResults.push({
          name: judge.name,
          response: judgeResponse
        });
      }
    } else {
      // Single judge mode (Technical Judge only)
      const technicalJudge = JUDGE_PERSONAS[0];
      const judgeResponse = await generateRoast(idea, tone as ToneMatrix, technicalJudge);
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

    // Save to database
    const roastData = {
      ideaText: idea,
      toneHumor: tone.humor,
      toneSarcasm: tone.sarcasm,
      judgesData: { judges: judgeResults },
      finalVerdict: finalVerdict,
      scores: aggregatedScores,
    };

    const [savedRoast] = await db.insert(roasts).values(roastData).returning();

    return NextResponse.json({
      success: true,
      roast: {
        id: savedRoast.id,
        judges: judgeResults,
        finalVerdict: finalVerdict,
        aggregatedScores: aggregatedScores,
      }
    });

  } catch (error) {
    console.error('Error in /api/roast:', error);
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'PARSE_FAIL' },
        { status: 500 }
      );
    }
    
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        { error: 'NETWORK_QUOTA' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'GENERIC' },
      { status: 500 }
    );
  }
}
