import { pgTable, uuid, text, timestamp, real, jsonb } from 'drizzle-orm/pg-core';

export const roasts = pgTable('roasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: uuid('user_id'), // Optional - null if anonymous
  projectName: text('project_name').notNull(), // Required - for leaderboard display
  ideaText: text('idea_text').notNull(),
  toneHumor: real('tone_humor'),
  toneSarcasm: real('tone_sarcasm'),
  judgesData: jsonb('judges_data'),
  finalVerdict: text('final_verdict'),
  scores: jsonb('scores'),
  errorLog: jsonb('error_log'),
  processedFiles: jsonb('processed_files'),
});

export const roastFiles = pgTable('roast_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  roastId: uuid('roast_id').references(() => roasts.id),
  fileType: text('file_type'), // 'pitch_deck', 'demo_video', 'image', 'app_screenshot', 'repo_analysis'
  fileUrl: text('file_url'),
  processedContent: text('processed_content'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leaderboard = pgTable('leaderboard', {
  id: uuid('id').primaryKey().defaultRandom(),
  roastId: uuid('roast_id').references(() => roasts.id).notNull(),
  ideaText: text('idea_text').notNull(),
  totalScore: real('total_score').notNull(),
  originality: real('originality').notNull(),
  feasibility: real('feasibility').notNull(),
  wowFactor: real('wow_factor').notNull(),
  marketPotential: real('market_potential').notNull(),
  verdict: text('verdict').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
