'use client';

import { ERROR_TYPES, type ErrorType } from '@/lib/constants';

interface ErrorDisplayProps {
  errorType: ErrorType;
  onRetry: () => void;
}

export default function ErrorDisplay({ errorType, onRetry }: ErrorDisplayProps) {
  const error = ERROR_TYPES[errorType];

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-center max-w-md mx-auto">
      <div className="text-red-400 text-sm uppercase tracking-wide mb-2 font-mono">
        {error.category}
      </div>
      <h3 className="text-red-300 text-xl font-bold mb-3">
        {error.headline}
      </h3>
      <p className="text-red-200/80 text-sm mb-6 leading-relaxed">
        {error.detail}
      </p>
      <button
        onClick={onRetry}
        className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 px-6 py-2 rounded-xl font-mono text-sm transition-all duration-200 hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
}
