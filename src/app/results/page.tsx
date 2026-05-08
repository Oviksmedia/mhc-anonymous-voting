'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, TrendingUp, Users, Award, 
  ShieldAlert, BarChart3, CheckCircle2, 
  RefreshCw, Trophy, Clock, Lock, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const TOTAL_STAFF = 50;

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
      const { data, error } = await supabase.from('votes').select('nominee_name');
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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin-mhc-2026') { setAuthorized(true); fetchResults(); }
    else { alert('Incorrect password'); }
  };

  // ─── AUTH PAGE (The Vault) ───
  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#052E30', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '20px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-block', background: 'white', borderRadius: '16px', padding: '10px 14px', marginBottom: '20px' }}>
                <img src="/logo.png" alt="MHC" style={{ height: '40px' }} />
              </div>
              <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>Admin Console</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Restricted Access Area</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', backdropFilter: 'blur(20px)' }}>
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px 16px 16px 48px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'white', color: '#052E30', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                  Unlock Dashboard
                </button>
              </form>
            </div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '13px' }}>
              <ArrowLeft style={{ width: '14px' }} /> Back to Portal
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const participationRate = Math.round((totalVotes / TOTAL_STAFF) * 100);
  const leader = results[0];

  // ─── DASHBOARD (The War Room) ───
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFB', fontFamily: "'Inter', sans-serif" }}>
      {/* Header Hero */}
      <div style={{ background: 'linear-gradient(160deg, #052E30 0%, #0D7377 100%)', padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '8px 10px' }}>
                  <img src="/logo.png" alt="MHC" style={{ height: '32px' }} />
                </div>
                <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                <span style={{ color: 'white', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.8 }}>ADMIN DASHBOARD</span>
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                  <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>LIVE SYNC</span>
                </div>
                <button onClick={fetchResults} style={{ background: 'white', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer' }}>
                  <RefreshCw style={{ width: '18px', color: '#0D7377', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                </button>
             </div>
          </div>

          <div style={{ color: 'white' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px' }}>Nurses Week <span style={{ color: '#00A3E0' }}>Results</span></h2>
            <p style={{ opacity: 0.6, fontSize: '15px' }}>Official tally for Most Hardworking Nurse 2026</p>
          </div>
        </div>
      </div>

      {/* Stats Area */}
      <div style={{ maxWidth: '1100px', margin: '-40px auto 0', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #E8ECF0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9DAAB8', textTransform: 'uppercase' }}>Participation</span>
              <Users style={{ width: '18px', color: '#0D7377' }} />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F1F2E', marginBottom: '8px' }}>{totalVotes} / {TOTAL_STAFF}</div>
            <div style={{ height: '6px', background: '#F1F4F6', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${participationRate}%`, background: '#0D7377', borderRadius: '10px', transition: 'width 1s' }} />
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #E8ECF0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9DAAB8', textTransform: 'uppercase' }}>Current Leader</span>
              <Trophy style={{ width: '18px', color: '#FFD700' }} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F1F2E', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leader?.nominee_name || '—'}</div>
            <div style={{ fontSize: '13px', color: '#6B7C93' }}>{leader ? `${leader.count} votes cast` : 'Awaiting first vote'}</div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #E8ECF0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9DAAB8', textTransform: 'uppercase' }}>Nominees</span>
              <Award style={{ width: '18px', color: '#00A3E0' }} />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F1F2E', marginBottom: '4px' }}>{results.length}</div>
            <div style={{ fontSize: '13px', color: '#6B7C93' }}>Unique staff nominated</div>
          </div>

        </div>

        {/* List Section */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #F1F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F1F2E' }}>Detailed Standings</h3>
            <span style={{ fontSize: '12px', color: '#9DAAB8' }}>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>

          <div style={{ padding: '8px' }}>
            <AnimatePresence>
              {results.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#9DAAB8' }}>No votes have been recorded yet.</div>
              ) : (
                results.map((item, index) => {
                  const percentage = totalVotes > 0 ? Math.round((item.count / totalVotes) * 100) : 0;
                  return (
                    <motion.div
                      key={item.nominee_name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        borderBottom: index === results.length - 1 ? 'none' : '1px solid #F1F4F6'
                      }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: index === 0 ? '#0D7377' : '#F1F4F6', color: index === 0 ? 'white' : '#9DAAB8', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#0F1F2E' }}>{item.nominee_name}</div>
                        {index === 0 && <div style={{ fontSize: '10px', fontWeight: 700, color: '#0D7377', textTransform: 'uppercase', marginTop: '2px' }}>Current Frontrunner</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F1F2E' }}>{item.count}</div>
                        <div style={{ fontSize: '11px', color: '#9DAAB8' }}>{percentage}% share</div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
