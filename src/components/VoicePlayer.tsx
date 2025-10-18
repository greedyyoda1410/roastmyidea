'use client';

import React, { useState, useRef } from 'react';

interface VoicePlayerProps {
  text: string;
  judgeName: string;
}

export default function VoicePlayer({ text, judgeName }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
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

      audio.onplay = () => setIsPlaying(true);
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

  return (
    <div className="mt-4">
      <button
        onClick={isPlaying ? handleStop : handlePlay}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all duration-200
          ${isPlaying
            ? 'bg-danger/20 border border-danger/50 text-danger hover:bg-danger/30'
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
        ) : (
          <>
            <span>🔊</span>
            <span>Play Voice Roast</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-danger/80 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
