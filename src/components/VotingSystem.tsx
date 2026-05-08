'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2, AlertCircle, Loader2, Heart,
  ShieldCheck, ArrowRight, Lock, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

type Step = 'code' | 'vote' | 'success';
const STEPS: Step[] = ['code', 'vote', 'success'];

export default function VotingSystem() {
  const [step, setStep] = useState<Step>('code');
  const [code, setCode] = useState('');
  const [nominee, setNominee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const validateCode = async () => {
    setLoading(true); setError(null);
    try {
      const { data, error: e } = await supabase
        .from('voter_tokens').select('*')
        .eq('code', code.toUpperCase().trim()).eq('is_used', false).single();
      if (e || !data) setError('Invalid or already used access code.');
      else setStep('vote');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const submitVote = async () => {
    if (!nominee.trim()) { setError('Please enter a name.'); return; }
    setLoading(true); setError(null);
    try {
      const { data, error: e } = await supabase.rpc('cast_anonymous_vote', {
        target_code: code.toUpperCase().trim(), nominee: nominee.trim()
      });
      if (e || (data && !data.success)) setError(e?.message || data?.message || 'Failed to record vote.');
      else {
        setStep('success');
        confetti({ particleCount: 220, spread: 100, origin: { y: 0.55 }, colors: ['#0D7377', '#14919B', '#FFD700', '#fff'] });
      }
    } catch { setError('Connection error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7F9', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ═══════════════════════════════════════════════
          HERO — Deep Teal Brand Section
      ═══════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(160deg, #052E30 0%, #0A4F53 50%, #0D7377 100%)',
        paddingTop: '56px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', top: '60%', right: '15%', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo Card with Float */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
            transition={{ 
              scale: { duration: 0.6, ease: "easeOut" },
              opacity: { duration: 0.6 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              display: 'inline-block',
              background: 'white',
              borderRadius: '20px',
              padding: '14px 20px',
              marginBottom: '28px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            <img src="/logo.png" alt="Maryland Healthcare" style={{ height: '52px', width: 'auto', display: 'block' }} />
          </motion.div>

          {/* Badge with Pulse Entrance */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ marginBottom: '12px' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '100px', padding: '6px 16px',
              fontSize: '12px', fontWeight: 900, letterSpacing: '0.2em',
              color: '#FFFFFF', textTransform: 'uppercase',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
              <Star style={{ width: '12px', height: '12px', fill: '#FFD700', color: '#FFD700' }} />
              NURSES WEEK 2026
            </span>
          </motion.div>

          {/* Title with Staggered Reveal */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', margin: '14px 0 8px', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Most Hardworking Nurse
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', margin: 0 }}
          >
            Honoring Excellence in Care — Maryland Healthcare
          </motion.p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          CARD — Floats over the hero bottom
      ═══════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 20px 48px',
        marginTop: '-64px',
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                  background: i === stepIndex ? '#FFFFFF' : i < stepIndex ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                  color: i === stepIndex ? '#0D7377' : i < stepIndex ? '#0A4F53' : 'rgba(255,255,255,0.6)',
                  boxShadow: i === stepIndex ? '0 2px 12px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.4s',
                }}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                {i < 2 && <div style={{ width: '40px', height: '2px', borderRadius: '2px', background: i < stepIndex ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)', transition: 'background 0.4s' }} />}
              </React.Fragment>
            ))}
          </div>

          {/* The Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}>
            <AnimatePresence mode="wait">

              {/* ── STEP 1 ── */}
              {step === 'code' && (
                <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }} style={{ padding: '36px 32px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F1F2E', margin: '0 0 8px' }}>Enter Access Code</h2>
                    <p style={{ fontSize: '14px', color: '#6B7C93', lineHeight: 1.6, margin: 0 }}>
                      Enter the unique code sent to you via WhatsApp. Each code is valid for one vote only.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="MHC-XXXXXX"
                      value={code}
                      onChange={e => setCode(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && validateCode()}
                      style={{
                        width: '100%', background: '#F6F8FA', border: '2px solid #E8ECF0',
                        borderRadius: '14px', padding: '16px 20px', fontSize: '22px',
                        fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.2em',
                        textAlign: 'center', color: '#0F1F2E', boxSizing: 'border-box',
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#0D7377'}
                      onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                    />

                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '12px 16px', borderRadius: '12px',
                        background: '#FEF2F2', border: '1px solid #FECACA',
                        color: '#DC2626', fontSize: '13px', lineHeight: 1.5,
                      }}>
                        <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '1px' }} />
                        {error}
                      </motion.div>
                    )}

                      <button
                        onClick={validateCode}
                        disabled={loading || code.length < 5}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          padding: '16px', borderRadius: '14px', border: 'none', cursor: loading || code.length < 5 ? 'not-allowed' : 'pointer',
                          background: loading || code.length < 5 ? '#B2D4D5' : 'linear-gradient(135deg, #0D7377 0%, #14919B 100%)',
                          color: 'white', fontSize: '15px', fontWeight: 700,
                          boxShadow: loading || code.length < 5 ? 'none' : '0 4px 16px rgba(13,115,119,0.35)',
                          transition: 'all 0.25s',
                        }}
                      >
                        {loading ? <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <><span>Continue</span><ArrowRight style={{ width: '18px', height: '18px' }} /></>}
                      </button>

                      <button 
                        onClick={() => setShowHelp(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9DAAB8', fontSize: '12px', fontWeight: 600, textDecoration: 'underline', marginTop: '4px' }}
                      >
                        See how it works
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#8E9BAA]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Your identity remains 100% anonymous
                    </div>
                  </motion.div>
                )}

              {/* ── STEP 2 ── */}
              {step === 'vote' && (
                <motion.div key="vote" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }} style={{ padding: '36px 32px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F1F2E', margin: '0 0 8px' }}>Cast Your Vote</h2>
                    <p style={{ fontSize: '14px', color: '#6B7C93', lineHeight: 1.6, margin: 0 }}>
                      Nominate the nurse you believe is most hardworking. This vote is anonymous and final.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7C93', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        Nurse&apos;s Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nurse Jane Doe"
                        value={nominee}
                        onChange={e => setNominee(e.target.value)}
                        autoFocus
                        style={{
                          width: '100%', background: '#F6F8FA', border: '2px solid #E8ECF0',
                          borderRadius: '14px', padding: '16px 20px', fontSize: '16px',
                          color: '#0F1F2E', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#0D7377'}
                        onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                      />
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '12px 16px', borderRadius: '12px',
                        background: '#FEF2F2', border: '1px solid #FECACA',
                        color: '#DC2626', fontSize: '13px', lineHeight: 1.5,
                      }}>
                        <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '1px' }} />
                        {error}
                      </motion.div>
                    )}

                    <button
                      onClick={submitVote}
                      disabled={loading || !nominee.trim()}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '16px', borderRadius: '14px', border: 'none', cursor: loading || !nominee.trim() ? 'not-allowed' : 'pointer',
                        background: loading || !nominee.trim() ? '#B2D4D5' : 'linear-gradient(135deg, #0D7377 0%, #14919B 100%)',
                        color: 'white', fontSize: '15px', fontWeight: 700,
                        boxShadow: loading || !nominee.trim() ? 'none' : '0 4px 16px rgba(13,115,119,0.35)',
                        transition: 'all 0.25s',
                      }}
                    >
                      {loading ? <Loader2 style={{ width: '20px', height: '20px' }} /> : <><Heart style={{ width: '18px', height: '18px' }} /><span>Cast Anonymous Vote</span></>}
                    </button>

                    <button onClick={() => { setStep('code'); setError(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#9DAAB8', fontSize: '13px', fontWeight: 500 }}>
                      ← Go Back
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3 ── */}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} style={{ padding: '48px 32px', textAlign: 'center' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200 }} style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: '#F0FDF4', border: '2px solid #BBF7D0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}>
                    <CheckCircle2 style={{ width: '40px', height: '40px', color: '#16A34A' }} />
                  </motion.div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F1F2E', margin: '0 0 10px' }}>Vote Recorded!</h2>
                  <p style={{ fontSize: '14px', color: '#6B7C93', lineHeight: 1.7, margin: '0 0 24px' }}>
                    Thank you for participating in Nurses Week 2026.<br />Your anonymous vote has been securely recorded.
                  </p>
                  <div style={{ background: '#F6F8FA', border: '1px solid #E8ECF0', borderRadius: '16px', padding: '16px 20px' }}>
                    <p style={{ fontSize: '13px', color: '#6B7C93', margin: '0 0 12px' }}>You can safely close this window.</p>
                    <div style={{ height: '1px', background: '#E8ECF0', margin: '0 0 12px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#16A34A', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <ShieldCheck style={{ width: '14px', height: '14px' }} />
                      Anonymous & Verified
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#9DAAB8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 6px' }}>
              Secure · Anonymous · Tamper-Proof
            </p>
            <p style={{ fontSize: '11px', color: '#C4CDD6', margin: 0 }}>
              © 2026 Maryland Healthcare. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showHelp && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHelp(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(5, 46, 48, 0.85)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'relative', background: 'white', borderRadius: '24px', width: '100%', maxWidth: '400px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <ShieldCheck style={{ width: '28px', height: '28px', color: '#16A34A' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F1F2E', margin: '0 0 8px' }}>Privacy & Integrity</h3>
                <p style={{ fontSize: '14px', color: '#6B7C93' }}>How we protect your anonymous vote</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0D7377', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>1</div>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}><strong>Validation:</strong> Your code is verified against a list of 50 authorized tickets.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0D7377', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>2</div>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}><strong>Severing:</strong> Once you vote, the system marks the code as used and permanently severs the link to the vote.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0D7377', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>3</div>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}><strong>Anonymity:</strong> Your vote is dropped into a "blind box." No one—including IT—can see which code cast which vote.</p>
                </div>
              </div>

              <button onClick={() => setShowHelp(false)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#0D7377', color: 'white', fontWeight: 700, marginTop: '32px', cursor: 'pointer' }}>
                Got it, thanks!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
