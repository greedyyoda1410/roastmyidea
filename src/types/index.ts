export interface ToneMatrix {
  humor: number; // 0-1
  sarcasm: number; // -1 to 1
}

export interface JudgeResponse {
  scores: {
    originality: number;
    feasibility: number;
    wow_factor: number;
    market_potential: number;
  };
  roast: string;
  feedback: string;
  verdict: 'PASS' | 'FAIL' | 'MAYBE';
}

export interface MultiJudgeResponse {
  id: string;
  judges: Array<{
    name: string;
    response: JudgeResponse;
  }>;
  finalVerdict: 'PASS' | 'FAIL' | 'MAYBE';
  aggregatedScores: {
    originality: number;
    feasibility: number;
    wow_factor: number;
    market_potential: number;
  };
}

export interface FileUpload {
  pitchDeck?: File;
  demoVideo?: File;
  demoImages: File[];
  appLink?: string;
  repoLink?: string;
}

export interface ProcessedFiles {
  ideaText: string;
  pitchDeckText?: string;
  demoContent?: {
    type: 'video' | 'images';
    frames?: string[];
    images?: string[];
  };
  appScreenshot?: string;
  repoAnalysis?: {
    readme: string;
    structure: Record<string, unknown>;
    languages: Record<string, number>;
    hasTests: boolean;
    hasDocs: boolean;
    hasCI: boolean;
    recentCommits: Array<{
      message: string;
      author: string;
      date: string;
      hash: string;
    }>;
  };
}

export interface RoastSession {
  id: string;
  createdAt: Date;
  userId?: string;
  projectName: string;
  ideaText: string;
  toneHumor: number;
  toneSarcasm: number;
  judgesData: MultiJudgeResponse;
  finalVerdict: string;
  scores: Record<string, number>;
  errorLog?: Record<string, unknown>;
  processedFiles?: ProcessedFiles;
}

export type ErrorType = 'GENERIC' | 'PARSE_FAIL' | 'UNSAFE_CONTENT' | 'NETWORK_QUOTA' | 'VALIDATION_EMPTY';
