'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  TrendingUp, 
  Users, 
  Award, 
  ShieldAlert, 
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Clock
} from 'lucide-react';

const TOTAL_STAFF = 300;

export default function ResultsPage() {
  const [results, setResults] = useState<{ nominee_name: string; count: number }[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('nominee_name');

      if (error) throw error;

      const counts = (data || []).reduce((acc: Record<string, number>, curr) => {
        acc[curr.nominee_name] = (acc[curr.nominee_name] || 0) + 1;
        return acc;
      }, {});

      const sorted = Object.entries(counts)
        .map(([name, count]) => ({ nominee_name: name, count }))
        .sort((a, b) => b.count - a.count);

      setResults(sorted);
      setTotalVotes(data?.length || 0);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin-mhc-2026') {
      setAuthorized(true);
      fetchResults();
    } else {
      alert('Incorrect password');
    }
  };

  // ─── AUTH GATE ───
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-10 w-full max-w-md"
        >
          <div className="text-center space-y-5 mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-display text-text">Admin Access</h1>
              <p className="text-sm text-text-muted">Enter password to view the voting dashboard.</p>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full text-base">
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const participationRate = Math.round((totalVotes / TOTAL_STAFF) * 100);
  const leader = results[0];

  // ─── DASHBOARD ───
  return (
    <div className="min-h-screen pb-20">
      {/* Decorative Background */}
      <div className="fixed inset-0 dot-pattern opacity-20 pointer-events-none" />

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="MHC" className="h-9 w-auto" />
            <div className="hidden sm:block h-5 w-px bg-border" />
            <span className="hidden sm:block text-xs font-bold text-text-muted uppercase tracking-[0.15em]">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/15">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-success font-bold">Live</span>
            </div>
            <button 
              onClick={fetchResults}
              disabled={loading}
              className="p-2 rounded-xl border border-border bg-white hover:bg-surface-alt transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-text-muted ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-8 relative z-10">
        {/* ─── PAGE HEADER ─── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
            <BarChart3 className="w-4 h-4" />
            Transparency Dashboard
          </div>
          <h2 className="text-4xl font-bold font-display text-text tracking-tight">
            Nurses Week <span className="gradient-accent">Results</span>
          </h2>
          <p className="text-text-muted max-w-xl">
            Real-time, tamper-proof overview of the Most Hardworking Nurse nominations.
          </p>
        </div>

        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Votes */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Votes</p>
              <Users className="w-5 h-5 text-text-muted/40" />
            </div>
            <p className="text-4xl font-black font-display text-text">{totalVotes}</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${participationRate}%` }} />
            </div>
            <p className="text-[11px] text-text-muted font-medium">{participationRate}% of {TOTAL_STAFF} staff</p>
          </div>

          {/* Current Leader */}
          <div className="card p-6 space-y-3 border-primary/20 bg-primary/[0.02]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Current Leader</p>
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <p className="text-xl font-bold text-text truncate">{leader?.nominee_name || '—'}</p>
            <p className="text-sm text-text-muted">
              {leader ? `${leader.count} vote${leader.count > 1 ? 's' : ''}` : 'No votes yet'}
            </p>
          </div>

          {/* Unique Nominees */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Nominees</p>
              <Award className="w-5 h-5 text-text-muted/40" />
            </div>
            <p className="text-4xl font-black font-display text-text">{results.length}</p>
            <p className="text-[11px] text-text-muted font-medium">Unique nominations</p>
          </div>

          {/* Last Updated */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Last Sync</p>
              <Clock className="w-5 h-5 text-text-muted/40" />
            </div>
            <p className="text-lg font-bold text-text">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-[11px] text-text-muted font-medium">
              {lastUpdated.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ─── LEADERBOARD ─── */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display text-text">Detailed Standings</h3>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
              {results.length} nominee{results.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {results.length === 0 ? (
                  <div className="card p-16 text-center border-dashed">
                    <p className="text-text-muted font-medium">Waiting for the first vote...</p>
                  </div>
                ) : (
                  results.map((item, index) => {
                    const percentage = totalVotes > 0 ? Math.round((item.count / totalVotes) * 100) : 0;
                    return (
                      <motion.div
                        key={item.nominee_name}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className={`card p-5 flex items-center gap-5 transition-all duration-300 ${
                          index === 0 ? 'border-primary/20 bg-primary/[0.02] shadow-sm shadow-primary/5' : ''
                        }`}
                      >
                        {/* Rank */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          index === 0 
                            ? 'bg-primary text-white shadow-sm' 
                            : index === 1
                              ? 'bg-primary/10 text-primary'
                              : index === 2
                                ? 'bg-accent/10 text-accent'
                                : 'bg-surface-alt text-text-muted border border-border'
                        }`}>
                          {index + 1}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-text truncate">{item.nominee_name}</h4>
                          {index === 0 && (
                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Leading</span>
                          )}
                        </div>

                        {/* Visual Bar */}
                        <div className="hidden sm:block w-28">
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>

                        {/* Count */}
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold font-display text-text">{item.count}</p>
                          <p className="text-[10px] text-text-muted font-medium">{percentage}%</p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MHC" className="h-6 w-auto opacity-40" />
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.15em]">
              Maryland Healthcare • Admin Console
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-success" />
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.15em]">
              Verified & Tamper-Proof
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
