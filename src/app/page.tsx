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
  const [files, setFiles] = useState<{ pitchDeck: File | null; demoImages: File[]; appLink: string; repoLink: string }>({
    pitchDeck: null,
    demoImages: [],
    appLink: '',
    repoLink: ''
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
      let agentAnalysis = '';
      
      // Step 1: Call agents if URLs provided (before roasting)
      if (files.appLink || files.repoLink) {
        const agentPromises = [];
        
        if (files.appLink) {
          agentPromises.push(
            fetch('/api/agents/review-app', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ appUrl: files.appLink }),
            }).then(res => res.json())
          );
        }
        
        if (files.repoLink) {
          agentPromises.push(
            fetch('/api/agents/review-repo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ repoUrl: files.repoLink }),
            }).then(res => res.json())
          );
        }
        
        const agentResults = await Promise.all(agentPromises);
        agentAnalysis = agentResults
          .filter(r => r.success)
          .map(r => r.summary)
          .join('\n\n');
      }

      // Step 2: Create roast with agent analysis
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
          agentAnalysis: agentAnalysis || undefined
        }),
      });

      const roastData = await initialResponse.json();

      if (!initialResponse.ok) {
        setError(roastData.error || 'GENERIC');
        return;
      }

      // Step 3: Upload files if any (in background)
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
      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded-xl focus:font-mono"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-muted-foreground/20" role="banner">
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
      <main id="main-content" className="max-w-4xl mx-auto px-6 py-12" role="main">
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
                  aria-label={isLoading ? 'Judges are deliberating' : 'Submit idea for roasting'}
                  aria-busy={isLoading}
                  className={`
                    px-12 py-5 rounded-2xl font-mono text-xl font-bold
                    transition-all duration-300 transform relative overflow-hidden
                    bold-shadow
                    ${isValid && !isLoading
                      ? 'bg-accent text-background hover:bg-accent-2 hover:scale-105 pulse-cta'
                      : 'bg-muted-foreground/20 text-muted-foreground cursor-not-allowed'
                    }
                    ${isLoading ? 'animate-pulse' : ''}
                  `}
                >
                  {/* Radial highlight overlay */}
                  {isValid && !isLoading && (
                    <div className="absolute inset-0 radial-highlight opacity-50" />
                  )}
                  <span className="relative z-10">
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <span className="cursor-blink glow-text">🎬 JUDGES DELIBERATING</span>
                        <span className="animate-spin text-2xl">⭐</span>
                      </span>
                    ) : (
                      <span className="glow-text">🎪 ROAST ME!</span>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Roast Results */}
          {roastResult && (
            <div className="space-y-6">
              {/* Show verdict only after all judges are visible */}
              {visibleJudges === roastResult.judges.length && (
                <div className="text-center bounce-in">
                  <h2 className="text-3xl font-bold text-foreground mb-4 glow-text">
                    🎉 FINAL VERDICT 🎉
                  </h2>
                  <div className={`
                    inline-block px-10 py-5 rounded-2xl border-4 font-mono text-2xl font-bold
                    transform transition-all duration-500 hover:scale-110 spotlight-glow
                    ${roastResult.finalVerdict === 'PASS' ? 'text-success border-success bg-success/20' :
                      roastResult.finalVerdict === 'FAIL' ? 'text-danger border-danger bg-danger/20' :
                      'text-warning border-warning bg-warning/20'}
                  `}>
                    {roastResult.finalVerdict}
                  </div>
                  {roastResult.judges.length > 1 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      📊 Based on {roastResult.judges.length} judges&apos; evaluations
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
