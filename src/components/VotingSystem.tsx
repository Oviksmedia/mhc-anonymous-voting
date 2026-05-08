'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, AlertCircle, Loader2, Heart, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
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
      const { data, error: rpcError } = await supabase.rpc('cast_anonymous_vote', {
        target_code: code.toUpperCase().trim(),
        nominee: nominee.trim()
      });

      if (rpcError || (data && !data.success)) {
        setError(rpcError?.message || data?.message || 'Failed to record vote.');
      } else {
        setStep('success');
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#0D7377', '#14919B', '#E8B931', '#00A3E0', '#FFFFFF']
        });
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-8">
      {['code', 'vote', 'success'].map((s, i) => (
        <React.Fragment key={s}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
            step === s 
              ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110' 
              : i < ['code', 'vote', 'success'].indexOf(step)
                ? 'bg-success text-white'
                : 'bg-surface-alt text-text-muted border border-border'
          }`}>
            {i < ['code', 'vote', 'success'].indexOf(step) ? '✓' : i + 1}
          </div>
          {i < 2 && (
            <div className={`w-12 h-0.5 rounded-full transition-colors duration-500 ${
              i < ['code', 'vote', 'success'].indexOf(step) ? 'bg-success' : 'bg-border'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Decorative Background */}
      <div className="fixed inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-5"
          >
            <img 
              src="/logo.png" 
              alt="Maryland Healthcare" 
              className="h-16 w-auto drop-shadow-sm"
            />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-[0.15em]">Nurses Week 2026</span>
              </div>
              <h1 className="text-2xl font-bold font-display text-text tracking-tight">
                Most Hardworking Nurse
              </h1>
              <p className="text-sm text-text-muted">Honoring Excellence in Care</p>
            </div>
          </motion.div>
        </div>

        {/* Step Indicator */}
        {stepIndicator}

        {/* Main Card */}
        <div className="card-elevated p-8 relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-secondary" />
          
          <AnimatePresence mode="wait">
            {/* ─── STEP 1: ACCESS CODE ─── */}
            {step === 'code' && (
              <motion.div
                key="code-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-text">Enter Access Code</h2>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Enter the unique code provided to you. Each code can only be used once to ensure voting integrity.
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="MHC-XXXXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="input-field text-center text-xl font-mono tracking-[0.25em]"
                    onKeyDown={(e) => e.key === 'Enter' && validateCode()}
                  />
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-error/5 border border-error/15 text-error text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button
                    onClick={validateCode}
                    disabled={loading || code.length < 5}
                    className="btn btn-primary w-full text-base"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-xs text-text-muted font-medium">Your identity remains 100% anonymous</span>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: CAST VOTE ─── */}
            {step === 'vote' && (
              <motion.div
                key="vote-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-text">Cast Your Vote</h2>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Nominate the nurse you believe is the most hardworking. This vote is final and cannot be changed.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Nurse&apos;s Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Nurse Jane Doe"
                      value={nominee}
                      onChange={(e) => setNominee(e.target.value)}
                      className="input-field text-lg"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-error/5 border border-error/15 text-error text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button
                    onClick={submitVote}
                    disabled={loading || !nominee.trim()}
                    className="btn btn-primary w-full text-base"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Cast Anonymous Vote
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => { setStep('code'); setError(null); }}
                    className="w-full py-2 text-sm text-text-muted hover:text-text transition-colors font-medium"
                  >
                    ← Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: SUCCESS ─── */}
            {step === 'success' && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-6 space-y-6"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto w-20 h-20 rounded-full bg-success/10 border-2 border-success/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </motion.div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display text-text">Vote Recorded!</h2>
                  <p className="text-text-muted leading-relaxed">
                    Thank you for participating in Nurses Week 2026. Your vote has been securely recorded.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-alt border border-border space-y-3">
                  <p className="text-sm text-text-secondary font-medium">You can now safely close this window.</p>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span className="text-xs text-success font-semibold uppercase tracking-wider">Anonymous & Verified</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold">
            Secure • Anonymous • Tamper-Proof
          </p>
          <p className="text-[10px] text-text-muted/50">
            © 2026 Maryland Healthcare. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
