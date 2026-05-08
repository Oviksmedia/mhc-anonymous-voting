'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, AlertCircle, Loader2, Award, Heart, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

type Step = 'code' | 'vote' | 'success';

export default function VotingSystem() {
  const [step, setStep] = useState<Step>('code');
  const [code, setCode] = useState('');
  const [nominee, setNominee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('voter_tokens')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .eq('is_used', false)
        .single();

      if (supabaseError || !data) {
        setError('Invalid or already used access code. Please check and try again.');
      } else {
        setStep('vote');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async () => {
    if (!nominee.trim()) {
      setError('Please enter a name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Call the Supabase RPC function for atomic vote
      const { data, error: rpcError } = await supabase.rpc('cast_anonymous_vote', {
        target_code: code.toUpperCase().trim(),
        nominee: nominee.trim()
      });

      if (rpcError || (data && !data.success)) {
        setError(rpcError?.message || data?.message || 'Failed to record vote.');
      } else {
        setStep('success');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#003366', '#00A3E0', '#FFD700']
        });
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-4 mb-4"
          >
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute inset-[-20px] bg-secondary/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Logo Badge Container */}
              <div className="relative z-10 bg-white p-3 rounded-[2rem] shadow-[0_0_40px_rgba(0,163,224,0.15)] border border-white/20 transition-transform duration-500 group-hover:scale-105">
                <img 
                  src="/logo.png" 
                  alt="Maryland Healthcare" 
                  className="h-14 w-auto object-contain"
                />
              </div>
              
              {/* Floating Decorative Elements */}
              <div className="absolute -top-2 -right-2 bg-secondary text-black p-1.5 rounded-full shadow-lg z-20">
                <Award className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-white/90">
                MARYLAND <span className="text-secondary">HEALTHCARE</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-white/10" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Nurses Week 2026</p>
                <div className="h-px w-8 bg-white/10" />
              </div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-extrabold gradient-text mb-2 tracking-tight outfit">
            Most Hardworking Nurse
          </h2>
          <p className="text-sm text-gray-400 font-medium italic">Honoring Excellence in Care</p>
        </div>

        <div className="glass-card p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'code' && (
              <motion.div
                key="code-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Enter Access Code</h2>
                  <p className="text-sm text-gray-400">Please enter the unique code provided to you. Each code can only be used once.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="MHC-XXXXXX"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-secondary transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && validateCode()}
                    />
                  </div>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    onClick={validateCode}
                    disabled={loading || code.length < 5}
                    className="w-full btn-primary flex items-center justify-center gap-2 group"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4">
                  <ShieldCheck className="w-3 h-3" />
                  Your identity remains 100% anonymous
                </div>
              </motion.div>
            )}

            {step === 'vote' && (
              <motion.div
                key="vote-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Cast Your Vote</h2>
                  <p className="text-sm text-gray-400">Nominate the most hardworking nurse you know.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1">Nurse's Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Nurse Jane Doe"
                      value={nominee}
                      onChange={(e) => setNominee(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    onClick={submitVote}
                    disabled={loading || !nominee.trim()}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Heart className="w-5 h-5 fill-current" />
                        Cast Anonymous Vote
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setStep('code')}
                    className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-8"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                  <div className="relative h-24 w-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-black outfit leading-tight">Your Vote is <span className="text-green-500">Live.</span></h2>
                  <p className="text-gray-400 font-medium">Thank you for participating in Nurses Week 2026. Your contribution helps us celebrate excellence at Maryland Healthcare.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-400 space-y-4">
                  <p className="font-medium">You can now safely close this window.</p>
                  <div className="h-px w-full bg-white/5" />
                  <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                    <ShieldCheck className="w-4 h-4" />
                    Secure & Anonymous Receipt Verified
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-3 grayscale opacity-30 group hover:opacity-100 transition-opacity">
            <img src="/logo.png" alt="MHC" className="h-8 w-auto" />
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">
              Maryland Healthcare
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-700">
            <div className="h-px w-4 bg-white/5" />
            <p className="text-[8px] uppercase tracking-widest font-black">
              Authorized Digital Portal 2026
            </p>
            <div className="h-px w-4 bg-white/5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
