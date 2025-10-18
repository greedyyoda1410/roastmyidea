'use client';

import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
  id: string;
  projectName: string;
  ideaText: string;
  totalScore: number;
  originality: number;
  feasibility: number;
  wowFactor: number;
  marketPotential: number;
  verdict: string;
  createdAt: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?time=${timeFilter}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setEntries(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'PASS': return 'text-success';
      case 'FAIL': return 'text-danger';
      case 'MAYBE': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="bg-surface/50 border border-muted-foreground/20 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground font-mono">
          Leaderboard
        </h2>
        
        {/* Time Filter */}
        <div className="flex gap-2">
          {(['all', 'week', 'today'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`
                px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200
                ${timeFilter === filter
                  ? 'bg-accent text-background'
                  : 'bg-surface border border-muted-foreground/30 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {filter === 'all' ? 'All Time' : filter === 'week' ? 'This Week' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-muted-foreground">
            Loading leaderboard...
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No roasts yet. Be the first to submit!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`
                bg-background/50 border rounded-xl p-4 transition-all duration-200 hover:border-accent/50
                ${index < 3 ? 'border-accent/30' : 'border-muted-foreground/20'}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 text-2xl w-12 text-center">
                  {getRankBadge(index)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {entry.projectName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.ideaText}
                      </p>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-xs font-mono font-semibold flex-shrink-0
                      ${getVerdictColor(entry.verdict)}
                    `}>
                      {entry.verdict}
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Originality</div>
                      <div className="text-lg font-bold text-accent">{entry.originality}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Feasibility</div>
                      <div className="text-lg font-bold text-accent">{entry.feasibility}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Wow Factor</div>
                      <div className="text-lg font-bold text-accent">{entry.wowFactor}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Market</div>
                      <div className="text-lg font-bold text-accent">{entry.marketPotential}</div>
                    </div>
                  </div>

                  {/* Total Score */}
                  <div className="mt-3 text-center">
                    <div className="inline-block bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
                      <span className="text-xs text-muted-foreground mr-2">Total Score:</span>
                      <span className="text-xl font-bold text-accent font-mono">
                        {entry.totalScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
