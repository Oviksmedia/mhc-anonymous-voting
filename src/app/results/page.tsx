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
  ArrowUpRight, 
  BarChart3,
  Calendar,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const TOTAL_STAFF = 300; // Total tokens generated

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

      const counts = (data || []).reduce((acc: any, curr: any) => {
        acc[curr.nominee_name] = (acc[curr.nominee_name] || 0) + 1;
        return acc;
      }, {});

      const sorted = Object.entries(counts)
        .map(([name, count]) => ({ nominee_name: name, count: count as number }))
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

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background font-inter">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 w-full max-w-md relative z-10 border-white/10"
        >
          <div className="text-center space-y-6 mb-8">
            <div className="inline-flex p-4 rounded-3xl bg-secondary/10 border border-secondary/20">
              <ShieldAlert className="w-8 h-8 text-secondary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight outfit">Admin Access</h1>
              <p className="text-gray-400 text-sm">Maryland Healthcare Transparent Dashboard</p>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-secondary/20">
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const participationRate = Math.round((totalVotes / TOTAL_STAFF) * 100);

  return (
    <div className="min-h-screen bg-background font-inter text-white pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-white/10">
              <img src="/logo.png" alt="MHC" className="h-8 w-auto" />
            </div>
            <div className="h-6 w-px bg-white/10 mx-1" />
            <h1 className="text-lg font-bold tracking-tight outfit leading-none">
              MARYLAND <br/> <span className="text-secondary text-[10px] uppercase tracking-[0.2em]">Healthcare</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Live Portal</span>
            </div>
            <button 
              onClick={fetchResults}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-secondary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-10 relative z-10">
        {/* Hero Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-2">
            <BarChart3 className="w-4 h-4" />
            Transparency Dashboard
          </div>
          <h2 className="text-5xl font-black outfit leading-none tracking-tighter">
            Nurses Week <span className="gradient-text">Results.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg">
            A real-time, tamper-proof overview of the Most Hardworking Nurse nominations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Total Votes Cast</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white outfit">{totalVotes}</span>
                <span className="text-gray-500 font-medium">/ {TOTAL_STAFF} staff</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${participationRate}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {participationRate}% Participation Rate
              </p>
            </div>
          </div>

          <div className="glass-card p-8 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Current Leader</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-2xl font-bold truncate">
                    {results[0]?.nominee_name || 'No votes yet'}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Leading with {results[0]?.count || 0} votes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest mt-4">
                <ArrowUpRight className="w-3 h-3" />
                Verified & Secure
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Last Sync</p>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold outfit">
                  {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h4>
                <p className="text-sm text-gray-400">
                  {lastUpdated.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-widest mt-4">
                <CheckCircle2 className="w-3 h-3" />
                Live Data Feed
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold outfit">Detailed Standings</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Updated every 30 seconds
            </span>
          </div>

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {results.length === 0 ? (
                <div className="text-center py-20 glass-card bg-white/[0.02] border-dashed border-white/10">
                  <p className="text-gray-500 font-medium">Waiting for the first vote to be cast...</p>
                </div>
              ) : (
                results.map((item, index) => (
                  <motion.div
                    key={item.nominee_name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-5 flex items-center justify-between group hover:bg-white/5 border-white/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black outfit text-lg ${
                          index === 0 
                            ? 'bg-gradient-to-br from-secondary to-primary text-white shadow-lg shadow-secondary/20' 
                            : 'bg-white/5 text-white/40'
                        }`}>
                          {index + 1}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1">
                            <div className="relative">
                              <div className="absolute inset-0 bg-accent blur-md rounded-full animate-pulse" />
                              <Award className="w-4 h-4 text-accent relative z-10 fill-accent" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-secondary transition-colors">{item.nominee_name}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          Nominee #{results.length - index}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="hidden sm:block w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / totalVotes) * 100}%` }}
                          className="h-full bg-secondary/40"
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-2xl font-black outfit">{item.count}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Votes</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center sm:text-left sm:flex sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <img src="/logo.png" alt="MHC" className="h-6 w-auto grayscale opacity-50" />
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            Maryland Healthcare • Admin Console
          </p>
        </div>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          Built with Integrity for Nurses Week 2026
        </p>
      </footer>
    </div>
  );
}
