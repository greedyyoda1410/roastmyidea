'use client';

import React from 'react';
import VoicePlayer from './VoicePlayer';
import { type JudgeResponse } from '@/types';

interface JudgeCardProps {
  name: string;
  response: JudgeResponse;
  isVisible: boolean;
}

export default function JudgeCard({ name, response, isVisible }: JudgeCardProps) {
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
      bg-surface/80 border border-muted-foreground/20 rounded-2xl p-6
      transition-all duration-500 transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
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

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Originality</span>
            <span className={`font-mono font-semibold ${getScoreColor(response.scores.originality)}`}>
              {response.scores.originality}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(response.scores.originality / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Feasibility</span>
            <span className={`font-mono font-semibold ${getScoreColor(response.scores.feasibility)}`}>
              {response.scores.feasibility}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(response.scores.feasibility / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Wow Factor</span>
            <span className={`font-mono font-semibold ${getScoreColor(response.scores.wow_factor)}`}>
              {response.scores.wow_factor}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(response.scores.wow_factor / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Potential</span>
            <span className={`font-mono font-semibold ${getScoreColor(response.scores.market_potential)}`}>
              {response.scores.market_potential}/10
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-1000"
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

      {/* Feedback */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Constructive Feedback</h4>
        <p className="text-foreground/80 leading-relaxed text-sm">
          {response.feedback}
        </p>
      </div>

      {/* Voice Player */}
      <VoicePlayer text={response.roast} judgeName={name} />
    </div>
  );
}
