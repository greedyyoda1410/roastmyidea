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

    // Generate roast using Technical Judge (single judge for now)
    const technicalJudge = JUDGE_PERSONAS[0];
    const judgeResponse = await generateRoast(idea, tone as ToneMatrix, technicalJudge);

    // Save to database
    const roastData = {
      ideaText: idea,
      toneHumor: tone.humor,
      toneSarcasm: tone.sarcasm,
      judgesData: {
        judges: [{
          name: technicalJudge.name,
          response: judgeResponse
        }]
      },
      finalVerdict: judgeResponse.verdict,
      scores: judgeResponse.scores,
    };

    const [savedRoast] = await db.insert(roasts).values(roastData).returning();

    return NextResponse.json({
      success: true,
      roast: {
        id: savedRoast.id,
        judges: [{
          name: technicalJudge.name,
          response: judgeResponse
        }],
        finalVerdict: judgeResponse.verdict,
        aggregatedScores: judgeResponse.scores,
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
