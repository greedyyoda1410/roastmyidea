'use client';

import React, { useState, useEffect } from 'react';
import IdeaInput from '@/components/IdeaInput';
import ProjectNameInput from '@/components/ProjectNameInput';
import FileUpload from '@/components/FileUpload';
import ToneMatrix from '@/components/ToneMatrix';
import ErrorDisplay from '@/components/ErrorDisplay';
import JudgeCard from '@/components/JudgeCard';
import Leaderboard from '@/components/Leaderboard';
import AuthButton from '@/components/AuthButton';
import { getCurrentUser } from '@/lib/auth';
import { type ToneMatrix as ToneMatrixType, type ErrorType, type MultiJudgeResponse } from '@/types';
import type { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [projectName, setProjectName] = useState('');
  const [idea, setIdea] = useState('');
  const [files, setFiles] = useState<{ pitchDeck: File | null; demoImages: File[] }>({
    pitchDeck: null,
    demoImages: []
  });
  const [tone, setTone] = useState<ToneMatrixType>({ humor: 0.7, sarcasm: 0.2 });
  const [isProjectNameValid, setIsProjectNameValid] = useState(false);
  const [isIdeaValid, setIsIdeaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [roastResult, setRoastResult] = useState<MultiJudgeResponse | null>(null);
  const [visibleJudges, setVisibleJudges] = useState<number>(0);

  const isValid = isProjectNameValid && isIdeaValid;

  useEffect(() => {
    // Get current user on mount
    getCurrentUser().then(setUser);
  }, []);

  const handleSubmit = async () => {
    if (!isValid) return;
    
    setIsLoading(true);
    setError(null);
    setRoastResult(null);
    setVisibleJudges(0);
    
    try {
      // Step 1: Create initial roast to get ID
      const initialResponse = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          projectName,
          idea, 
          tone,
          userId: user?.id || null,
          filesAttached: files.pitchDeck !== null || files.demoImages.length > 0
        }),
      });

      const roastData = await initialResponse.json();

      if (!initialResponse.ok) {
        setError(roastData.error || 'GENERIC');
        return;
      }

      // Step 2: Upload files if any (in background while judges work)
      if (files.pitchDeck || files.demoImages.length > 0) {
        const fileFormData = new FormData();
        fileFormData.append('roastId', roastData.roast.id);
        
        if (files.pitchDeck) {
          fileFormData.append('pitchDeck', files.pitchDeck);
        }
        
        files.demoImages.forEach((image) => {
          fileFormData.append('images', image);
        });

        // Upload files in background (don't wait)
        fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        }).catch(err => console.error('File upload error:', err));
      }

      setRoastResult(roastData.roast);
      
      // Sequentially reveal judges with animation
      const judgeCount = roastData.roast.judges.length;
      for (let i = 0; i < judgeCount; i++) {
        setTimeout(() => {
          setVisibleJudges(i + 1);
        }, i * 800); // 800ms delay between each judge reveal
      }
    } catch (err) {
      console.error('Error submitting roast:', err);
      setError('GENERIC');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-muted-foreground/20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold glitch" data-text="RoastMyIdea.AI">
                RoastMyIdea.AI
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <AuthButton />
            </div>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">
              Get your startup idea roasted by AI judges with personality, humor, and real critique
            </p>
            {user && (
              <p className="text-xs text-accent mt-1">
                Signed in - Your roasts will be saved to your profile
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Error Display */}
          {error && (
            <div className="flex justify-center">
              <ErrorDisplay errorType={error} onRetry={handleRetry} />
            </div>
          )}

          {/* Input Form */}
          <div className="bg-surface/50 border border-muted-foreground/20 rounded-2xl p-8">
            <div className="space-y-8">
              {/* Project Name Input */}
              <ProjectNameInput
                value={projectName}
                onChange={setProjectName}
                onValidationChange={setIsProjectNameValid}
              />

              {/* Idea Input */}
              <IdeaInput
                value={idea}
                onChange={setIdea}
                onValidationChange={setIsIdeaValid}
              />

              {/* File Upload */}
              <FileUpload onFilesChange={setFiles} />

              {/* Tone Matrix */}
              <div className="flex justify-center">
                <ToneMatrix value={tone} onChange={setTone} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  className={`
                    px-8 py-4 rounded-2xl font-mono text-lg font-semibold
                    transition-all duration-200 transform
                    ${isValid && !isLoading
                      ? 'bg-accent text-background hover:bg-accent-2 hover:scale-105 shadow-lg hover:shadow-accent/25'
                      : 'bg-muted-foreground/20 text-muted-foreground cursor-not-allowed'
                    }
                    ${isLoading ? 'animate-pulse' : ''}
                  `}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="cursor-blink">Judges are deliberating</span>
                      <span className="animate-spin">⚡</span>
                    </span>
                  ) : (
                    'Roast Me!'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Roast Results */}
          {roastResult && (
            <div className="space-y-6">
              {/* Show verdict only after all judges are visible */}
              {visibleJudges === roastResult.judges.length && (
                <div className="text-center animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Final Verdict
                  </h2>
                  <div className={`
                    inline-block px-6 py-3 rounded-2xl border-2 font-mono text-lg font-semibold
                    transform transition-all duration-500 hover:scale-105
                    ${roastResult.finalVerdict === 'PASS' ? 'text-success border-success bg-success/10' :
                      roastResult.finalVerdict === 'FAIL' ? 'text-danger border-danger bg-danger/10' :
                      'text-warning border-warning bg-warning/10'}
                  `}>
                    {roastResult.finalVerdict}
                  </div>
                  {roastResult.judges.length > 1 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on {roastResult.judges.length} judges&apos; evaluations
                    </p>
                  )}
                </div>
              )}

              {/* Judge Cards - Sequential Reveal */}
              <div className="space-y-4">
                {roastResult.judges.map((judge, index) => (
                  <JudgeCard
                    key={index}
                    name={judge.name}
                    response={judge.response}
                    isVisible={index < visibleJudges}
                  />
                ))}
              </div>
              
              {/* Loading indicator while judges are being revealed */}
              {visibleJudges < roastResult.judges.length && (
                <div className="text-center text-muted-foreground">
                  <div className="animate-pulse">
                    Waiting for judge {visibleJudges + 1} of {roastResult.judges.length}...
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placeholder when no results */}
          {!roastResult && !isLoading && !error && (
            <div className="bg-surface/30 border border-muted-foreground/10 rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">
                Your roast results will appear here after submission
              </p>
            </div>
          )}

          {/* Leaderboard */}
          <div className="mt-16">
            <Leaderboard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-muted-foreground/20 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Tailwind CSS, and AI magic ✨</p>
        </div>
      </footer>
    </div>
  );
}
