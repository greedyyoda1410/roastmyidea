'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmail, signUpWithEmail, signOut, onAuthStateChange } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName);
        setAuthError('Check your email for confirmation link!');
      } else {
        await signInWithEmail(email, password);
        setShowAuthModal(false);
      }
    } catch (error) {
      setAuthError((error as Error).message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.user_metadata?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.full_name || 'User'}
              className="w-8 h-8 rounded-full border border-accent"
            />
          )}
          <span className="text-sm text-muted-foreground">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-mono bg-surface border border-muted-foreground/30 rounded-xl hover:bg-surface/80 transition-all duration-200"
        >
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="px-4 py-2 text-sm font-mono bg-accent/10 border border-accent/50 text-accent rounded-xl hover:bg-accent/20 transition-all duration-200"
      >
        Sign In
      </button>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowAuthModal(false)}>
          <div className="bg-surface border border-muted-foreground/30 rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            
            <form onSubmit={handleSignIn} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-background border border-muted-foreground/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-muted-foreground/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-background border border-muted-foreground/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="••••••••"
                />
              </div>

              {authError && (
                <div className={`text-sm p-3 rounded-xl ${
                  authError.includes('Check your email') 
                    ? 'bg-accent/10 text-accent' 
                    : 'bg-danger/10 text-danger'
                }`}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-accent text-background rounded-xl font-mono font-semibold hover:bg-accent-2 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError('');
                }}
                className="text-sm text-accent hover:text-accent-2 transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
