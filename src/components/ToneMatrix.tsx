'use client';

import React, { useState, useRef, useEffect } from 'react';
import { type ToneMatrix as ToneMatrixType } from '@/types';

interface ToneMatrixProps {
  value: ToneMatrixType;
  onChange: (tone: ToneMatrixType) => void;
}

export default function ToneMatrix({ value, onChange }: ToneMatrixProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updatePosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updatePosition = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    // Convert y to sarcasm (-1 to 1, where top is -1 and bottom is 1)
    const sarcasm = (y - 0.5) * 2;
    
    onChange({
      humor: x,
      sarcasm: sarcasm
    });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const getQuadrantLabel = () => {
    // humor > 0.5 = Funny (right), humor <= 0.5 = Serious (left)
    // sarcasm > 0 = Sarcastic (top), sarcasm <= 0 = Supportive (bottom)
    
    if (value.humor > 0.5 && value.sarcasm > 0) return 'Sarcastic & Funny';
    if (value.humor > 0.5 && value.sarcasm <= 0) return 'Supportive & Funny';
    if (value.humor <= 0.5 && value.sarcasm > 0) return 'Sarcastic & Serious';
    return 'Supportive & Serious';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2 glow-text">🎭 Tone Control Stage</h3>
        <p className="text-sm text-muted-foreground">
          Drag the spotlight to set your roasting style
        </p>
      </div>
      
      <div className="relative">
        <div
          ref={containerRef}
          className="relative w-80 h-80 mx-auto bg-surface border-4 border-accent/30 rounded-3xl cursor-crosshair overflow-hidden stage-floor bold-shadow"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Spotlight effect following the knob */}
          <div
            className="absolute w-64 h-64 spotlight-circle transform -translate-x-32 -translate-y-32 transition-all duration-200"
            style={{
              left: `${value.humor * 100}%`,
              top: `${(value.sarcasm + 1) * 50}%`,
            }}
          />
          
          {/* Center crosshair */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent/40" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/40" />
          </div>
          
          {/* Corner labels with emojis */}
          <div className="absolute top-3 left-3 text-sm font-bold text-accent font-mono">
            😏 SARCASTIC
          </div>
          <div className="absolute top-3 right-3 text-sm font-bold text-accent font-mono">
            😂 FUNNY
          </div>
          <div className="absolute bottom-3 left-3 text-sm font-bold text-accent font-mono">
            🧐 SERIOUS
          </div>
          <div className="absolute bottom-3 right-3 text-sm font-bold text-accent font-mono">
            💚 SUPPORTIVE
          </div>
          
          {/* Draggable point (spotlight knob) */}
          <div
            className="absolute w-6 h-6 bg-accent rounded-full border-4 border-accent-2 transform -translate-x-3 -translate-y-3 spotlight-glow transition-all duration-200 z-10"
            style={{
              left: `${value.humor * 100}%`,
              top: `${(value.sarcasm + 1) * 50}%`,
            }}
          />
        </div>
        
        {/* Current selection display */}
        <div className="mt-6 text-center bg-surface/80 border border-accent/30 rounded-xl p-4 bold-shadow">
          <div className="text-lg font-bold text-accent font-mono glow-text">
            {getQuadrantLabel()}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Humor: {Math.round(value.humor * 100)}% | Sarcasm: {Math.round(value.sarcasm * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
