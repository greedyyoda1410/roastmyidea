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
    if (value.humor > 0.5 && value.sarcasm > 0) return 'Sarcastic & Funny';
    if (value.humor > 0.5 && value.sarcasm <= 0) return 'Supportive & Funny';
    if (value.humor <= 0.5 && value.sarcasm > 0) return 'Sarcastic & Serious';
    return 'Supportive & Serious';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Tone Matrix</h3>
        <p className="text-sm text-muted-foreground">
          Drag to set your preferred roasting style
        </p>
      </div>
      
      <div className="relative">
        <div
          ref={containerRef}
          className="relative w-64 h-64 mx-auto bg-surface border-2 border-muted-foreground/30 rounded-2xl cursor-crosshair overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-muted-foreground/20" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          </div>
          
          {/* Quadrant labels */}
          <div className="absolute top-2 left-2 text-xs text-muted-foreground font-mono">
            Sarcastic
          </div>
          <div className="absolute top-2 right-2 text-xs text-muted-foreground font-mono">
            Funny
          </div>
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground font-mono">
            Supportive
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground font-mono">
            Serious
          </div>
          
          {/* Draggable point */}
          <div
            className="absolute w-4 h-4 bg-accent rounded-full border-2 border-accent-2 transform -translate-x-2 -translate-y-2 shadow-lg transition-all duration-150"
            style={{
              left: `${value.humor * 100}%`,
              top: `${(value.sarcasm + 1) * 50}%`,
            }}
          />
          
          {/* Glow effect */}
          <div
            className="absolute w-8 h-8 bg-accent/20 rounded-full transform -translate-x-4 -translate-y-4 pointer-events-none"
            style={{
              left: `${value.humor * 100}%`,
              top: `${(value.sarcasm + 1) * 50}%`,
            }}
          />
        </div>
        
        {/* Current selection display */}
        <div className="mt-4 text-center">
          <div className="text-sm font-mono text-accent">
            {getQuadrantLabel()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Humor: {Math.round(value.humor * 100)}% | Sarcasm: {Math.round(value.sarcasm * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
