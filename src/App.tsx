/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { GameScene } from './GameScene';
import { useGameStore } from './store';
import { useGameLoop } from './useGameLoop';
import { Trophy, Play, Pause, RotateCcw, Zap, Target, Layers, Settings, User, Monitor } from 'lucide-react';
import { TETROMINOS } from './constants';
import { Trailer } from './Trailer';
import { useState } from 'react';

function HUD() {
  const score = useGameStore((state) => state.score);
  const lines = useGameStore((state) => state.lines);
  const level = useGameStore((state) => state.level);
  const nextPiece = useGameStore((state) => state.nextPiece);
  const combo = useGameStore((state) => state.combo);
  const isPaused = useGameStore((state) => state.isPaused);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const startGame = useGameStore((state) => state.startGame);
  const pauseGame = useGameStore((state) => state.pauseGame);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col font-sans text-white select-none overflow-hidden">
      {/* Absolute Background Elements from Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a2e_0%,_transparent_70%)] opacity-40 pointer-events-none"></div>

      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 relative z-10 bg-black/40 backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <span className="font-black text-xl text-black">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase">Tetris Battle<span className="text-cyan-400">: Dimension</span></h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Competitive 3D Matrix System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase mb-1">Status</p>
            <p className={`font-mono text-xl font-bold ${isPaused || isGameOver ? 'text-red-400' : 'text-cyan-400'}`}>
              {isGameOver ? 'TERMINATED' : isPaused ? 'HALTED' : 'ACTIVE'}
            </p>
          </div>
          <div className="w-[1px] h-10 bg-white/10 hidden md:block"></div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold uppercase truncate max-w-[120px]">NEON_PILOT</p>
              <p className="text-[10px] text-green-400 font-mono">STABLE: 12ms</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white/10 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-cyan-600 to-blue-400"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-12 relative z-10 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="col-span-3 border-r border-white/10 p-8 flex flex-col gap-8 bg-black/20 pointer-events-auto">
          <section>
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <User size={10} /> Player Stats
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] text-white/40 uppercase mb-1">Current Score</p>
                <p className="text-2xl font-bold font-mono tracking-tight">{score.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm relative overflow-hidden">
                <p className="text-[10px] text-white/40 uppercase mb-1">Combo System</p>
                <p className="text-2xl font-bold font-mono text-magenta-500">x{combo > 0 ? combo : 1}.0</p>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(combo * 10, 100)}%` }}
                    className="h-full bg-magenta-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-auto">
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Zap size={10} /> System Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-[8px] text-white/40 uppercase">Level</p>
                <p className="text-lg font-bold font-mono text-yellow-400">{level}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-[8px] text-white/40 uppercase">Lines</p>
                <p className="text-lg font-bold font-mono text-purple-400">{lines}</p>
              </div>
            </div>
          </section>
        </aside>

        {/* Center - Game Scene Area */}
        <section className="col-span-6 relative flex flex-col items-center justify-center pointer-events-auto">
          {/* Game Window Backdrop */}
          <div className="absolute inset-0 z-0">
            <GameScene />
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {(isGameOver || isPaused) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-20 pointer-events-auto"
              >
                <div className="bg-black border-2 border-white/20 p-10 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center max-w-md w-full mx-4">
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4 text-white">
                    {isGameOver ? 'Terminated' : 'Halted'}
                  </h2>
                  <div className="w-20 h-1 bg-cyan-500 mx-auto mb-8 rounded-full shadow-[0_0_10px_#06b6d4]" />
                  
                  {isGameOver && (
                    <div className="mb-10 text-white/60 space-y-2">
                      <p className="font-mono text-sm tracking-widest uppercase">Encryption Broken</p>
                      <p className="text-4xl font-bold font-mono text-cyan-400">{score.toLocaleString()}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isGameOver ? startGame : pauseGame}
                  className="bg-white text-black font-black uppercase py-5 rounded-xl flex items-center justify-center gap-3 tracking-widest text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
                >
                  {isGameOver ? <RotateCcw size={22} /> : <Play size={22} />}
                  {isGameOver ? 'Restart System' : 'Resume Uplink'}
                </motion.button>
                
                <button
                  onClick={() => (window as any).playTrailer?.()}
                  className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300"
                >
                  <Play size={18} /> Play Trailer
                </button>

                {!isGameOver && (
                  <button
                    onClick={startGame}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 tracking-widest hover:bg-red-500 hover:text-black transition-all duration-300"
                  >
                    <RotateCcw size={18} /> Reset Matrix
                  </button>
                )}
              </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </section>

        {/* Right Sidebar */}
        <aside className="col-span-3 border-l border-white/10 p-8 flex flex-col gap-8 bg-black/20 pointer-events-auto">
          <section>
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Target size={10} /> Next Sequence
            </h2>
            <div className="aspect-video bg-white/5 border border-white/10 rounded-xl flex items-center justify-center p-6 backdrop-blur-sm shadow-inner group">
              <div className="grid grid-cols-4 gap-1 transform transition-transform group-hover:scale-110 duration-500">
                {(() => {
                  const shape = TETROMINOS[nextPiece].shape[0];
                  const color = TETROMINOS[nextPiece].color;
                  return Array.from({ length: 4 }).map((_, row) => 
                    Array.from({ length: 4 }).map((_, col) => {
                      const isActive = shape.some(([x, y]) => x === col && y === row);
                      return (
                        <div 
                          key={`${row}-${col}`} 
                          className={`w-4 h-4 rounded-sm transition-all duration-700`}
                          style={{ 
                            backgroundColor: isActive ? color : 'rgba(255,255,255,0.02)',
                            boxShadow: isActive ? `0 0 15px ${color}` : 'none',
                            opacity: isActive ? 1 : 0.5
                          }}
                        />
                      );
                    })
                  );
                })()}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Settings size={10} /> Active Buffs
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex flex-col items-center justify-center gap-2 group transition-all cursor-default">
                <div className="w-6 h-6 border-2 border-cyan-400 rounded rotate-45 group-hover:rotate-135 transition-all duration-1000" />
                <span className="text-[9px] uppercase font-bold text-cyan-400">Grav-Sync</span>
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 opacity-30 grayscale cursor-not-allowed">
                <div className="w-6 h-6 border-2 border-white rounded-full" />
                <span className="text-[9px] uppercase font-bold">Stasis</span>
              </div>
            </div>
          </section>

          <section className="mt-auto">
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Monitor size={10} /> Global Feed
            </h2>
            <div className="bg-magenta-500/5 border border-magenta-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-magenta-400">CYBER_CHAMP</span>
                <span className="text-[8px] bg-magenta-500/20 px-2 py-0.5 rounded text-magenta-400">READY</span>
              </div>
              <div className="w-full h-24 bg-black/40 rounded border border-white/5 flex flex-col justify-end p-2 gap-1 overflow-hidden">
                <div className="w-full h-6 bg-magenta-500/10 border-t border-magenta-500/20" />
                <div className="w-full h-4 bg-magenta-500/5 border-t border-magenta-500/10" />
                <div className="w-3/4 h-3 bg-magenta-500/5 border-t border-magenta-500/10" />
              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-white/10 px-10 flex items-center justify-between bg-black/60 backdrop-blur-md relative z-10 pointer-events-auto">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <span className="w-8 h-6 bg-white/10 border border-white/10 flex items-center justify-center rounded text-[10px] font-bold text-white/80">SPACE</span>
            <span className="text-[10px] uppercase text-white/40 font-medium tracking-widest">Hard Drop</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-6 bg-white/10 border border-white/10 flex items-center justify-center rounded text-[10px] font-bold text-white/80">UP</span>
            <span className="text-[10px] uppercase text-white/40 font-medium tracking-widest">Rotate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-6 bg-white/10 border border-white/10 flex items-center justify-center rounded text-[10px] font-bold text-white/80">SHIFT</span>
            <span className="text-[10px] uppercase text-white/40 font-medium tracking-widest">Hold</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => (window as any).playTrailer?.()}
            className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-[9px] font-black tracking-widest text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300"
          >
            <Play size={10} fill="currentColor" /> REPLAY_CINEMATIC
          </button>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">Tokyo-Primary_Node-1</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <p className="text-[10px] font-mono text-cyan-400">Ver. 3.0.4-β</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  useGameLoop();
  const [showTrailer, setShowTrailer] = useState(true);

  // Expose trailer playback to global window for HUD access
  if (typeof window !== 'undefined') {
    (window as any).playTrailer = () => setShowTrailer(true);
  }

  return (
    <div className="relative w-full h-screen bg-[#050508] overflow-hidden">
      <AnimatePresence>
        {showTrailer ? (
          <Trailer key="trailer" onComplete={() => setShowTrailer(false)} />
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            {/* Background Cyber-Grid Effect */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)`,
                backgroundSize: '80px 80px'
              }}
            />
            
            {/* UI & Game Layer Integration */}
            <HUD />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
