'use client';

import React from 'react';
import VoicePlayer from './VoicePlayer';
import { type JudgeResponse } from '@/types';

interface JudgeCardProps {
  name: string;
  response: JudgeResponse;
  isVisible: boolean;
  roastId?: string;
}

export default function JudgeCard({ name, response, isVisible, roastId }: JudgeCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-danger';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'PASS': return 'text-success border-success';
      case 'FAIL': return 'text-danger border-danger';
      case 'MAYBE': return 'text-warning border-warning';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  return (
    <div className={`
      bg-surface/80 border-4 border-accent/30 rounded-3xl p-8
      transition-all duration-500 transform bold-shadow
      ${isVisible ? 'opacity-100 translate-y-0 bounce-in' : 'opacity-0 translate-y-4'}
    `}>
      {/* Judge Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground font-mono">
          {name}
        </h3>
        <div className={`
          px-3 py-1 rounded-full border text-sm font-mono
          ${getVerdictColor(response.verdict)}
        `}>
          {response.verdict}
        </div>
      </div>

      {/* Scores with flip animation */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2 flip-animation" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground">💡 ORIGINALITY</span>
            <span className={`font-mono text-xl font-bold ${getScoreColor(response.scores.originality)} glow-text`}>
              {response.scores.originality}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent to-accent-2 h-3 rounded-full score-fill"
              style={{ width: `${(response.scores.originality / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 flip-animation" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground">⚙️ FEASIBILITY</span>
            <span className={`font-mono text-xl font-bold ${getScoreColor(response.scores.feasibility)} glow-text`}>
              {response.scores.feasibility}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent to-accent-2 h-3 rounded-full score-fill"
              style={{ width: `${(response.scores.feasibility / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 flip-animation" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground">⚡ WOW FACTOR</span>
            <span className={`font-mono text-xl font-bold ${getScoreColor(response.scores.wow_factor)} glow-text`}>
              {response.scores.wow_factor}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent to-accent-2 h-3 rounded-full score-fill"
              style={{ width: `${(response.scores.wow_factor / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 flip-animation" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground">💰 MARKET</span>
            <span className={`font-mono text-xl font-bold ${getScoreColor(response.scores.market_potential)} glow-text`}>
              {response.scores.market_potential}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent to-accent-2 h-3 rounded-full score-fill"
              style={{ width: `${(response.scores.market_potential / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roast */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">The Roast</h4>
        <p className="text-foreground leading-relaxed font-mono text-sm">
          {response.roast}
        </p>
      </div>

      {/* Voice Player - Centered between Roast and Feedback */}
      <div className="flex justify-center my-6">
        <VoicePlayer text={response.roast} judgeName={name} roastId={roastId} />
      </div>

      {/* Feedback */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Constructive Feedback</h4>
        <p className="text-foreground/80 leading-relaxed text-sm">
          {response.feedback}
        </p>
      </div>
    </div>
  );
}
