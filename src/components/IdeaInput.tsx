'use client';

import React, { useState, useEffect } from 'react';

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function IdeaInput({ value, onChange, onValidationChange }: IdeaInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 1000;
  const isValid = value.trim().length > 0 && value.length <= maxLength;

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-muted-foreground">
        Your Startup Idea *
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your startup idea in detail... What problem does it solve? Who are your customers? What makes it unique?"
          className={`
            w-full h-32 px-4 py-3 bg-surface border-2 rounded-2xl resize-none
            text-foreground placeholder-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
            transition-all duration-200
            ${isFocused ? 'ring-2 ring-accent/50 border-accent border-2' : 'border-accent/40 border-2'}
            ${!isValid && value.length > 0 ? 'border-danger/50 ring-2 ring-danger/20' : ''}
          `}
          maxLength={maxLength}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
          {value.length}/{maxLength}
        </div>
      </div>
      {!isValid && value.length > 0 && (
        <p className="text-danger text-sm">
          Please enter a valid startup idea (1-{maxLength} characters)
        </p>
      )}
    </div>
  );
}
