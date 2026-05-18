/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shield, Target, Cpu, ChevronRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TrailerProps {
  onComplete: () => void;
}

export function Trailer({ onComplete }: TrailerProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500), // Logo drop
      setTimeout(() => setStep(2), 3500), // Feature 1
      setTimeout(() => setStep(3), 5500), // Feature 2
      setTimeout(() => setStep(4), 7500), // Feature 3
      setTimeout(() => setStep(5), 9500), // Call to action
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const features = [
    {
      id: 2,
      icon: <Target className="text-cyan-400" />,
      title: "TRUE 3D PERSPECTIVE",
      desc: "Experience the matrix from a dynamic third-person viewpoint.",
      tag: "DIMENSIONAL_SHIFT"
    },
    {
      id: 3,
      icon: <Zap className="text-magenta-400" />,
      title: "NEON FLOW GRID",
      desc: "Navigate through an atmospheric, flowing cyber-field.",
      tag: "ATMOSPHERIC_CORE"
    },
    {
      id: 4,
      icon: <Cpu className="text-yellow-400" />,
      title: "COMBO OVERDRIVE",
      desc: "Stack clears, trigger chains, and break the system limits.",
      tag: "LOGIC_BREAKER"
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#050508] z-[100] flex items-center justify-center overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#1a1a2e_0%,_transparent_60%)] opacity-60"></div>
      
      {/* Starting hint */}
      {step === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-cyan-500/30 font-mono text-sm tracking-[1em] uppercase"
            >
                System Booting...
            </motion.div>
        </div>
      )}

      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}
      />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -100 }}
            className="text-center z-10"
          >
            <div className="mb-6 flex justify-center">
              <motion.div 
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)]"
              >
                <span className="font-black text-4xl text-black">T</span>
              </motion.div>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-2">
              NEON <span className="text-cyan-400">OVERDRIVE</span>
            </h1>
            <p className="text-white/40 tracking-[0.4em] uppercase text-xs font-bold">
              ESTABLISHING UPLINK...
            </p>
          </motion.div>
        )}

        {features.map((f) => step === f.id && (
          <motion.div
            key={`feature-${f.id}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-2xl text-center z-10 px-6"
          >
            <div className="flex justify-center mb-8">
              <div className="p-6 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                {f.icon}
              </div>
            </div>
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest text-white/60 mb-4 border border-white/5 uppercase">
              {f.tag}
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-6 leading-tight whitespace-pre-line">
              {f.title}
            </h2>
            <p className="text-xl text-white/40 font-medium">
              {f.desc}
            </p>
          </motion.div>
        ))}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10 p-12 bg-black/40 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            <div className="mb-10">
              <h2 className="text-7xl font-black italic tracking-tighter uppercase text-white mb-2">
                READY TO <span className="text-magenta-500">BATTLE?</span>
              </h2>
              <p className="text-white/40 tracking-[0.2em] font-bold uppercase text-sm">
                System status: OPTIMIZED | Connection: SECURE
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="group relative bg-cyan-500 text-black font-black uppercase py-6 px-16 rounded-2xl flex items-center justify-center gap-4 text-2xl tracking-tighter transition-all"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <Play fill="black" size={28} />
              ENTER THE MATRIX
              <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>

            <div className="mt-12 flex justify-center gap-12 text-[10px] font-black tracking-widest text-white/20 uppercase">
              <div className="flex items-center gap-2 saturate-0 opacity-50">
                <Shield size={12} /> ANTI-CHEAT
              </div>
              <div className="flex items-center gap-2 saturate-0 opacity-50">
                <Target size={12} /> COMPETITIVE
              </div>
              <div className="flex items-center gap-2 saturate-0 opacity-50">
                <Cpu size={12} /> AI_POWERED
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0, 0.4, 0] 
            }}
            transition={{ 
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-12 h-12 border border-cyan-500/20 rounded rotate-45"
          />
        ))}
      </div>
    </div>
  );
}
