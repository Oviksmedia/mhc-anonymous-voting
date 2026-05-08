'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, Users, Award, ShieldAlert } from 'lucide-react';

export default function ResultsPage() {
  const [results, setResults] = useState<{ nominee_name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  const fetchResults = async () => {
    setLoading(true);
    try {
      // Fetch all votes and aggregate manually (or use a view/RPC if preferred)
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="glass-card p-8 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <ShieldAlert className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-sm text-gray-400">Enter password to view voting results.</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
            <button type="submit" className="w-full btn-primary">
              View Results
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Voting Results</h1>
          <p className="text-gray-400">Nurses Week 2026 Live Tally</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-4 flex items-center gap-4">
            <Users className="text-secondary" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Votes</p>
              <p className="text-2xl font-bold">{results.reduce((a, b) => a + b.count, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {results.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No votes cast yet.</div>
          ) : (
            results.map((item, index) => (
              <motion.div
                key={item.nominee_name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 flex items-center justify-between group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-accent text-black' : 'bg-white/10'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.nominee_name}</h3>
                    {index === 0 && <span className="text-xs text-accent font-bold uppercase tracking-widest">Current Leader</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{item.count}</p>
                    <p className="text-xs text-gray-500">votes</p>
                  </div>
                  <TrendingUp className={`w-5 h-5 ${index === 0 ? 'text-accent' : 'text-gray-600'}`} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      <button 
        onClick={fetchResults}
        className="text-sm text-gray-500 hover:text-white transition-colors underline"
      >
        Refresh Data
      </button>
    </div>
  );
}
