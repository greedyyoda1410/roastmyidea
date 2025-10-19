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
    
    // Convert y to sarcasm (-1 to 1, where top is +1 and bottom is -1)
    // y=0 (top) should be sarcasm=1, y=1 (bottom) should be sarcasm=-1
    const sarcasm = 1 - (y * 2);
    
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

  const getToneLabel = () => {
    // Generate descriptive labels based on position
    const humorLabel = value.humor > 0.6 ? "Funny" : value.humor < 0.4 ? "Serious" : "Balanced";
    const sarcasmLabel = value.sarcasm > 0.3 ? "Sarcastic" : value.sarcasm < -0.3 ? "Supportive" : "Neutral";
    return `${sarcasmLabel} & ${humorLabel}`;
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
              top: `${((1 - value.sarcasm) / 2) * 100}%`,
            }}
          />
          
          {/* Quadrant dividers - subtle */}
          <div className="absolute left-0 top-1/2 w-full h-[1px] bg-neutral-700 opacity-60" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-neutral-700 opacity-60" />
          
          {/* Axis labels - centered on edges */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-accent font-mono">
            🧐 Serious
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-accent font-mono">
            😂 Funny
          </div>
          <div className="absolute left-1/2 top-2 -translate-x-1/2 text-xs font-bold text-accent font-mono">
            😏 Sarcastic
          </div>
          <div className="absolute left-1/2 bottom-2 -translate-x-1/2 text-xs font-bold text-accent font-mono">
            💚 Supportive
          </div>
          
          {/* Draggable point (spotlight knob) */}
          <div
            className="absolute w-6 h-6 bg-accent rounded-full border-4 border-accent-2 transform -translate-x-3 -translate-y-3 spotlight-glow transition-all duration-200 z-10"
            style={{
              left: `${value.humor * 100}%`,
              top: `${((1 - value.sarcasm) / 2) * 100}%`,
            }}
          />
        </div>
        
        {/* Current selection display */}
        <div className="mt-6 text-center bg-surface/80 border border-accent/30 rounded-xl p-4 bold-shadow">
          <div className="text-sm text-muted-foreground mb-1">
            Current Tone
          </div>
          <div className="text-lg font-bold text-accent font-mono glow-text">
            {getToneLabel()}
          </div>
        </div>
      </div>
    </div>
  );
}
