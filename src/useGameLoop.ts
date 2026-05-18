/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from './store';

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const movePiece = useGameStore((state) => state.movePiece);
  const rotatePiece = useGameStore((state) => state.rotatePiece);
  const hardDrop = useGameStore((state) => state.hardDrop);
  const isPaused = useGameStore((state) => state.isPaused);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const dropTime = useGameStore((state) => state.dropTime);
  
  const lastTickTime = useRef<number>(0);

  useEffect(() => {
    let requestRef: number;
    
    const animate = (time: number) => {
      if (!isPaused && !isGameOver) {
        if (time - lastTickTime.current > dropTime) {
          tick();
          lastTickTime.current = time;
        }
      }
      requestRef = requestAnimationFrame(animate);
    };

    requestRef = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef);
  }, [tick, isPaused, isGameOver, dropTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isGameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece, hardDrop, isPaused, isGameOver]);
}
