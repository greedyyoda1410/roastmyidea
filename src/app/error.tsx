'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-surface/50 border border-danger/30 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">🔥</div>
        <h2 className="text-2xl font-bold text-danger mb-4">
          Something Went Wrong!
        </h2>
        <p className="text-muted-foreground mb-6">
          Our judges encountered an unexpected error. This is embarrassing.
        </p>
        {error.message && (
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-danger/80 font-mono">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-accent text-background rounded-xl font-mono font-semibold hover:bg-accent-2 transition-all duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-surface border border-muted-foreground/30 text-foreground rounded-xl font-mono hover:bg-surface/80 transition-all duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
