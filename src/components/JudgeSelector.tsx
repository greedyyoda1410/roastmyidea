'use client';

import React, { useState, useEffect } from 'react';
import { JUDGE_PERSONAS } from '@/lib/constants';
import { type JudgePersona } from '@/lib/constants';

interface JudgeSelectorProps {
  selectedJudge: JudgePersona;
  onJudgeSelect: (judge: JudgePersona) => void;
}

export default function JudgeSelector({ selectedJudge, onJudgeSelect }: JudgeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2 glow-text">🎯 Choose Your Judge</h3>
        <p className="text-sm text-muted-foreground">
          Each judge evaluates your idea from their unique expertise
        </p>
      </div>

      {/* Judge Selection Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {JUDGE_PERSONAS.map((judge) => {
          const isSelected = selectedJudge.name === judge.name;
          
          return (
            <button
              key={judge.name}
              onClick={() => onJudgeSelect(judge)}
              className={`
                px-6 py-4 rounded-xl font-mono text-sm font-bold
                border-4 transition-all duration-300 transform
                bold-shadow
                ${isSelected
                  ? 'bg-accent text-background border-accent scale-105 spotlight-glow'
                  : 'bg-surface/80 text-foreground border-accent/30 hover:border-accent/60 hover:scale-102'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Select ${judge.name} - ${judge.role}`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className={isSelected ? 'glow-text' : ''}>{judge.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{judge.role}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Judge Info */}
      <div className="mt-4 text-center bg-surface/80 border border-accent/30 rounded-xl p-4 bold-shadow">
        <div className="text-sm">
          <span className="text-muted-foreground">Selected: </span>
          <span className="text-accent font-bold font-mono glow-text">{selectedJudge.name}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Expertise: {selectedJudge.expertise}
        </div>
      </div>
    </div>
  );
}

