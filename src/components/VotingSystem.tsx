'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, AlertCircle, Loader2, Heart, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

type Step = 'code' | 'vote' | 'success';
const STEPS: Step[] = ['code', 'vote', 'success'];

export default function VotingSystem() {
  const [step, setStep] = useState<Step>('code');
  const [code, setCode] = useState('');
  const [nominee, setNominee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);

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
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async () => {
    if (!nominee.trim()) { setError('Please enter a name.'); return; }
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
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#0D7377', '#14919B', '#E8B931', '#00A3E0'] });
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#EAF6F7] via-white to-[#F0F9FF]">
      {/* Top Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0D7377] via-[#14919B] to-[#00A3E0] shrink-0" />

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* ─── HEADER ─── */}
          <div className="text-center mb-8 space-y-4">
            <img
              src="/logo.png"
              alt="Maryland Healthcare"
              className="h-14 w-auto mx-auto"
            />
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#0D7377] bg-[#0D7377]/8 border border-[#0D7377]/15">
                <Sparkles className="w-3 h-3" />
                Nurses Week 2026
              </span>
              <h1 className="text-[28px] font-bold text-[#1A2332] tracking-tight leading-tight">
                Most Hardworking Nurse
              </h1>
              <p className="text-[15px] text-[#5A6B7F]">Honoring Excellence in Care</p>
            </div>
          </div>

          {/* ─── STEP INDICATOR ─── */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400
                  ${i === stepIndex ? 'bg-[#0D7377] text-white ring-4 ring-[#0D7377]/20' :
                    i < stepIndex ? 'bg-[#10B981] text-white' :
                    'bg-white text-[#8E9BAA] border border-[#E5EAF0]'}
                `}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                {i < 2 && (
                  <div className={`w-14 h-0.5 rounded-full transition-colors duration-400 ${i < stepIndex ? 'bg-[#10B981]' : 'bg-[#E5EAF0]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ─── MAIN CARD ─── */}
          <div
            className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_48px_rgba(0,0,0,0.08)] border border-[#E5EAF0]"
            style={{ borderTop: '3px solid #0D7377' }}
          >
            <div className="p-8">
              <AnimatePresence mode="wait">

                {/* ── STEP 1: Code ── */}
                {step === 'code' && (
                  <motion.div key="code" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="space-y-6">
                    <div>
                      <h2 className="text-[18px] font-bold text-[#1A2332] mb-1">Enter Access Code</h2>
                      <p className="text-[14px] text-[#5A6B7F] leading-relaxed">
                        Enter the unique code sent to you. Each code is valid for one vote only.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="MHC-XXXXXX"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && validateCode()}
                        className="w-full bg-[#F8FAFB] border-2 border-[#E5EAF0] rounded-2xl px-5 py-4 text-center text-[20px] font-mono tracking-[0.2em] text-[#1A2332] focus:outline-none focus:border-[#0D7377] focus:ring-4 focus:ring-[#0D7377]/10 transition-all"
                      />

                      {error && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px]">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          {error}
                        </motion.div>
                      )}

                      <button
                        onClick={validateCode}
                        disabled={loading || code.length < 5}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-[15px] text-white transition-all duration-300"
                        style={{ background: 'linear-gradient(135deg, #0D7377 0%, #14919B 100%)', boxShadow: '0 4px 14px rgba(13,115,119,0.3)' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#8E9BAA]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Your identity remains 100% anonymous
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Vote ── */}
                {step === 'vote' && (
                  <motion.div key="vote" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="space-y-6">
                    <div>
                      <h2 className="text-[18px] font-bold text-[#1A2332] mb-1">Cast Your Vote</h2>
                      <p className="text-[14px] text-[#5A6B7F] leading-relaxed">
                        Nominate the nurse you believe is the most hardworking. This vote is final.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#5A6B7F] uppercase tracking-wider mb-2">Nurse&apos;s Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Nurse Jane Doe"
                          value={nominee}
                          onChange={(e) => setNominee(e.target.value)}
                          autoFocus
                          className="w-full bg-[#F8FAFB] border-2 border-[#E5EAF0] rounded-2xl px-5 py-4 text-[16px] text-[#1A2332] focus:outline-none focus:border-[#0D7377] focus:ring-4 focus:ring-[#0D7377]/10 transition-all"
                        />
                      </div>

                      {error && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px]">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          {error}
                        </motion.div>
                      )}

                      <button
                        onClick={submitVote}
                        disabled={loading || !nominee.trim()}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-[15px] text-white transition-all duration-300"
                        style={{ background: 'linear-gradient(135deg, #0D7377 0%, #14919B 100%)', boxShadow: '0 4px 14px rgba(13,115,119,0.3)' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Heart className="w-4 h-4" /><span>Cast Anonymous Vote</span></>}
                      </button>

                      <button onClick={() => { setStep('code'); setError(null); }} className="w-full py-2.5 text-[13px] text-[#8E9BAA] hover:text-[#1A2332] transition-colors font-medium">
                        ← Go Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: Success ── */}
                {step === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center space-y-6 py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 220 }} className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                    <div>
                      <h2 className="text-[22px] font-bold text-[#1A2332] mb-2">Vote Recorded!</h2>
                      <p className="text-[14px] text-[#5A6B7F] leading-relaxed">
                        Thank you for participating in Nurses Week 2026. Your anonymous vote has been securely recorded.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-[#E5EAF0] space-y-3">
                      <p className="text-[13px] text-[#5A6B7F]">You can now safely close this window.</p>
                      <div className="h-px bg-[#E5EAF0]" />
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" /> Anonymous & Verified
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* ─── FOOTER ─── */}
          <div className="mt-8 text-center space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8E9BAA]">Secure • Anonymous • Tamper-Proof</p>
            <p className="text-[10px] text-[#C4CDD6]">© 2026 Maryland Healthcare. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
