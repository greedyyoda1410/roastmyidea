'use client';

import React, { useState, useEffect } from 'react';

interface ProjectNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function ProjectNameInput({ value, onChange, onValidationChange }: ProjectNameInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 100;
  const isValid = value.trim().length > 0 && value.length <= maxLength;

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-muted-foreground">
        Project Name *
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="e.g., CoffeeConnect, ParkingPal, FitQuest..."
          className={`
            w-full px-4 py-3 bg-surface border rounded-2xl
            text-foreground placeholder-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
            transition-all duration-200
            ${isFocused ? 'ring-2 ring-accent/50 border-accent' : 'border-muted-foreground/30'}
            ${!isValid && value.length > 0 ? 'border-danger/50 ring-2 ring-danger/20' : ''}
          `}
          maxLength={maxLength}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-3 text-xs text-muted-foreground font-mono">
          {value.length}/{maxLength}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        This name will appear on the leaderboard. Not used for roasting.
      </p>
      {!isValid && value.length > 0 && (
        <p className="text-danger text-sm">
          Please enter a valid project name (1-{maxLength} characters)
        </p>
      )}
    </div>
  );
}
