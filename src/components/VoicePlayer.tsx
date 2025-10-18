'use client';

import React, { useState, useRef } from 'react';

interface VoicePlayerProps {
  text: string;
  judgeName: string;
  roastId?: string; // To track plays per roast
}

const MAX_PLAYS = 2; // Maximum plays per judge per roast

export default function VoicePlayer({ text, judgeName, roastId }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load play count from localStorage on mount
  React.useEffect(() => {
    if (!roastId) return;
    const key = `voice_plays_${roastId}_${judgeName}`;
    const stored = localStorage.getItem(key);
    setPlayCount(stored ? parseInt(stored) : 0);
  }, [roastId, judgeName]);

  const handlePlay = async () => {
    // Check play limit
    if (playCount >= MAX_PLAYS) {
      setError(`Play limit reached (${MAX_PLAYS} plays per judge)`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch audio from API
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, judgeName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Voice synthesis failed');
      }

      // Convert response to audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        // Increment play count
        const newCount = playCount + 1;
        setPlayCount(newCount);
        // Save to localStorage
        if (roastId) {
          const key = `voice_plays_${roastId}_${judgeName}`;
          localStorage.setItem(key, newCount.toString());
        }
      };
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setError('Audio playback failed');
      };

      await audio.play();
    } catch (err) {
      console.error('Voice playback error:', err);
      setError((err as Error).message);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const playsRemaining = MAX_PLAYS - playCount;
  const isDisabled = playCount >= MAX_PLAYS || isLoading;

  return (
    <div className="mt-4">
      <button
        onClick={isPlaying ? handleStop : handlePlay}
        disabled={isDisabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all duration-200
          ${isPlaying
            ? 'bg-danger/20 border border-danger/50 text-danger hover:bg-danger/30'
            : playCount >= MAX_PLAYS
            ? 'bg-muted-foreground/10 border border-muted-foreground/30 text-muted-foreground cursor-not-allowed'
            : 'bg-accent/10 border border-accent/50 text-accent hover:bg-accent/20'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⚡</span>
            <span>Generating voice...</span>
          </>
        ) : isPlaying ? (
          <>
            <span>⏹</span>
            <span>Stop Voice Roast</span>
          </>
        ) : playCount >= MAX_PLAYS ? (
          <>
            <span>🔇</span>
            <span>No Plays Left</span>
          </>
        ) : (
          <>
            <span>🔊</span>
            <span>Play Voice Roast {playsRemaining > 0 && `(${playsRemaining} left)`}</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-danger/80 mt-2">
          {error}
        </p>
      )}
      
      {playCount > 0 && playCount < MAX_PLAYS && !error && (
        <p className="text-xs text-muted-foreground mt-2">
          {playsRemaining} play{playsRemaining !== 1 ? 's' : ''} remaining for this judge
        </p>
      )}
    </div>
  );
}
