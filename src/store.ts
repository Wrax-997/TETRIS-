/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  INITIAL_DROP_TIME,
  MIN_DROP_TIME,
  Point,
  SPEED_UP_FACTOR,
  TETROMINOS,
  TetrominoType,
} from './constants';

interface GameState {
  board: (string | null)[][];
  activePiece: {
    type: TetrominoType;
    position: Point;
    rotation: number;
  } | null;
  nextPiece: TetrominoType;
  score: number;
  lines: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
  dropTime: number;
  lastDropTime: number;
  combo: number;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  movePiece: (dx: number, dy: number) => boolean;
  rotatePiece: () => void;
  hardDrop: () => void;
  tick: () => void;
}

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

const getRandomTetrominoType = (): TetrominoType => {
  const types = Object.keys(TETROMINOS) as TetrominoType[];
  return types[Math.floor(Math.random() * types.length)];
};

const checkCollision = (
  board: (string | null)[][],
  type: TetrominoType,
  position: Point,
  rotation: number
): boolean => {
  const shape = TETROMINOS[type].shape[rotation];
  return shape.some(([x, y]) => {
    const nextX = position[0] + x;
    const nextY = position[1] + y;
    return (
      nextX < 0 ||
      nextX >= BOARD_WIDTH ||
      nextY >= BOARD_HEIGHT ||
      (nextY >= 0 && board[nextY][nextX] !== null)
    );
  });
};

export const useGameStore = create<GameState>((set, get) => ({
  board: createEmptyBoard(),
  activePiece: null,
  nextPiece: getRandomTetrominoType(),
  score: 0,
  lines: 0,
  level: 1,
  isGameOver: false,
  isPaused: true,
  dropTime: INITIAL_DROP_TIME,
  lastDropTime: 0,
  combo: 0,

  startGame: () => {
    set({
      board: createEmptyBoard(),
      activePiece: {
        type: getRandomTetrominoType(),
        position: [Math.floor(BOARD_WIDTH / 2) - 2, -1],
        rotation: 0,
      },
      nextPiece: getRandomTetrominoType(),
      score: 0,
      lines: 0,
      level: 1,
      isGameOver: false,
      isPaused: false,
      dropTime: INITIAL_DROP_TIME,
      combo: 0,
    });
  },

  pauseGame: () => set((state) => ({ isPaused: !state.isPaused })),

  movePiece: (dx: number, dy: number) => {
    const { activePiece, board, isGameOver, isPaused } = get();
    if (!activePiece || isGameOver || isPaused) return false;

    const nextPos: Point = [activePiece.position[0] + dx, activePiece.position[1] + dy];
    if (!checkCollision(board, activePiece.type, nextPos, activePiece.rotation)) {
      set({
        activePiece: {
          ...activePiece,
          position: nextPos,
        },
      });
      return true;
    }
    return false;
  },

  rotatePiece: () => {
    const { activePiece, board, isGameOver, isPaused } = get();
    if (!activePiece || isGameOver || isPaused) return;

    const nextRotation = (activePiece.rotation + 1) % 4;
    // Basic wall kick
    let nextPos = activePiece.position;
    if (checkCollision(board, activePiece.type, nextPos, nextRotation)) {
      // Try pushing left
      if (!checkCollision(board, activePiece.type, [nextPos[0] - 1, nextPos[1]], nextRotation)) {
        nextPos = [nextPos[0] - 1, nextPos[1]];
      } 
      // Try pushing right
      else if (!checkCollision(board, activePiece.type, [nextPos[0] + 1, nextPos[1]], nextRotation)) {
        nextPos = [nextPos[0] + 1, nextPos[1]];
      } else {
        return; // Can't rotate
      }
    }

    set({
      activePiece: {
        ...activePiece,
        position: nextPos,
        rotation: nextRotation,
      },
    });
  },

  hardDrop: () => {
    const { activePiece, board, isGameOver, isPaused } = get();
    if (!activePiece || isGameOver || isPaused) return;

    let dy = 0;
    while (!checkCollision(board, activePiece.type, [activePiece.position[0], activePiece.position[1] + dy + 1], activePiece.rotation)) {
      dy++;
    }
    
    set({
      activePiece: {
        ...activePiece,
        position: [activePiece.position[0], activePiece.position[1] + dy],
      }
    });
    get().tick();
  },

  tick: () => {
    const { activePiece, board, isGameOver, isPaused, nextPiece, score, lines, level, dropTime, combo } = get();
    if (isGameOver || isPaused) return;

    if (!activePiece) {
      const newActive = {
        type: nextPiece,
        position: [Math.floor(BOARD_WIDTH / 2) - 2, -1] as Point,
        rotation: 0,
      };
      
      if (checkCollision(board, newActive.type, newActive.position, newActive.rotation)) {
        set({ isGameOver: true });
        return;
      }
      
      set({
        activePiece: newActive,
        nextPiece: getRandomTetrominoType(),
      });
      return;
    }

    const nextPos: Point = [activePiece.position[0], activePiece.position[1] + 1];
    if (!checkCollision(board, activePiece.type, nextPos, activePiece.rotation)) {
      set({
        activePiece: {
          ...activePiece,
          position: nextPos,
        },
      });
    } else {
      // Freeze piece
      const newBoard = [...board.map((row) => [...row])];
      const shape = TETROMINOS[activePiece.type].shape[activePiece.rotation];
      shape.forEach(([x, y]) => {
        const boardX = activePiece.position[0] + x;
        const boardY = activePiece.position[1] + y;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = TETROMINOS[activePiece.type].color;
        }
      });

      // Clear lines
      let cleared = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every((cell) => cell !== null)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(null));
          cleared++;
          y++; // Check the same row again
        }
      }

      const scoreMultiplier = [0, 100, 300, 500, 800];
      const newScore = score + scoreMultiplier[cleared] * level + (cleared > 0 ? combo * 50 : 0);
      const newLines = lines + cleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      const newDropTime = Math.max(MIN_DROP_TIME, INITIAL_DROP_TIME * Math.pow(SPEED_UP_FACTOR, newLevel - 1));

      set({
        board: newBoard,
        activePiece: null,
        score: newScore,
        lines: newLines,
        level: newLevel,
        dropTime: newDropTime,
        combo: cleared > 0 ? combo + 1 : 0,
      });
      
      // Auto spawn next piece on next tick or immediately?
      // Immediately is smoother
      const nextActive = {
        type: nextPiece,
        position: [Math.floor(BOARD_WIDTH / 2) - 2, -1] as Point,
        rotation: 0,
      };
      if (checkCollision(newBoard, nextActive.type, nextActive.position, nextActive.rotation)) {
        set({ isGameOver: true });
      } else {
        set({
          activePiece: nextActive,
          nextPiece: getRandomTetrominoType(),
        });
      }
    }
  },
}));
