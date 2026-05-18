/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrbitControls, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINOS, TetrominoType } from './constants';
import { useGameStore } from './store';

const BLOCK_SIZE = 1;
const GAP = 0.05;

function Block({ position, color, opacity = 1, emissiveIntensity = 1 }: { position: [number, number, number], color: string, opacity?: number, emissiveIntensity?: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[BLOCK_SIZE - GAP, BLOCK_SIZE - GAP, BLOCK_SIZE - GAP]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={emissiveIntensity} 
        transparent={opacity < 1} 
        opacity={opacity}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function GhostPiece() {
  const activePiece = useGameStore((state) => state.activePiece);
  const board = useGameStore((state) => state.board);
  
  if (!activePiece) return null;

  const { type, position, rotation } = activePiece;
  const shape = TETROMINOS[type].shape[rotation];
  
  let dy = 0;
  const checkCollision = (yOffset: number) => {
    return shape.some(([x, y]) => {
      const boardX = position[0] + x;
      const boardY = position[1] + y + yOffset;
      return (
        boardX < 0 ||
        boardX >= BOARD_WIDTH ||
        boardY >= BOARD_HEIGHT ||
        (boardY >= 0 && board[boardY][boardX] !== null)
      );
    });
  };

  while (!checkCollision(dy + 1)) {
    dy++;
  }

  return (
    <group position={[position[0] - BOARD_WIDTH / 2 + 0.5, -(position[1] + dy) + BOARD_HEIGHT / 2 - 0.5, 0]}>
      {shape.map(([x, y], i) => (
        <Block key={i} position={[x, -y, 0]} color={TETROMINOS[type].color} opacity={0.2} emissiveIntensity={0.2} />
      ))}
    </group>
  );
}

function ActivePiece() {
  const activePiece = useGameStore((state) => state.activePiece);
  if (!activePiece) return null;

  const { type, position, rotation } = activePiece;
  const shape = TETROMINOS[type].shape[rotation];

  return (
    <group position={[position[0] - BOARD_WIDTH / 2 + 0.5, -position[1] + BOARD_HEIGHT / 2 - 0.5, 0]}>
      {shape.map(([x, y], i) => (
        <Block key={i} position={[x, -y, 0]} color={TETROMINOS[type].color} emissiveIntensity={2} />
      ))}
    </group>
  );
}

function StaticBoard() {
  const board = useGameStore((state) => state.board);
  
  return (
    <group>
      {board.map((row, y) =>
        row.map((color, x) =>
          color ? (
            <Block 
              key={`${x}-${y}`} 
              position={[x - BOARD_WIDTH / 2 + 0.5, -y + BOARD_HEIGHT / 2 - 0.5, 0]} 
              color={color} 
            />
          ) : null
        )
      )}
    </group>
  );
}

function GridFrame() {
  const gridGroup = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (gridGroup.current) {
      const time = clock.getElapsedTime();
      // Flowing neon effect: pulse the opacity and color slightly
      gridGroup.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          const pulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
          child.material.emissiveIntensity = 0.2 + pulse * 1.5;
          child.material.opacity = 0.1 + pulse * 0.4;
        }
      });
    }
  });

  return (
    <group>
      {/* Back Plate */}
      <mesh position={[0, 0, -0.55]}>
        <boxGeometry args={[BOARD_WIDTH + 0.2, BOARD_HEIGHT + 0.2, 0.1]} />
        <meshStandardMaterial color="#050508" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Side walls (Left/Right) */}
      <mesh position={[-(BOARD_WIDTH / 2 + 0.15), 0, 0.2]}>
        <boxGeometry args={[0.3, BOARD_HEIGHT, 1.5]} />
        <meshStandardMaterial color="#111" emissive="#06b6d4" emissiveIntensity={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[BOARD_WIDTH / 2 + 0.15, 0, 0.2]}>
        <boxGeometry args={[0.3, BOARD_HEIGHT, 1.5]} />
        <meshStandardMaterial color="#111" emissive="#06b6d4" emissiveIntensity={0.1} metalness={0.8} />
      </mesh>

      {/* Bottom wall */}
      <mesh position={[0, -(BOARD_HEIGHT / 2 + 0.15), 0.2]}>
        <boxGeometry args={[BOARD_WIDTH + 0.6, 0.3, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#06b6d4" emissiveIntensity={0.5} metalness={0.8} />
      </mesh>

      {/* Visual boundary line at bottom (Glowing accent) */}
      <mesh position={[0, -(BOARD_HEIGHT / 2), 0.76]}>
        <boxGeometry args={[BOARD_WIDTH, 0.05, 0.05]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
      </mesh>

      {/* Flowing neon grid lines */}
      <group ref={gridGroup} position={[0, 0, -0.49]}>
        {Array.from({ length: BOARD_HEIGHT + 1 }).map((_, i) => (
          <mesh key={`h-${i}`} position={[0, i - BOARD_HEIGHT / 2, 0]}>
            <boxGeometry args={[BOARD_WIDTH, 0.02, 0.02]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" transparent opacity={0.3} />
          </mesh>
        ))}
        {Array.from({ length: BOARD_WIDTH + 1 }).map((_, i) => (
          <mesh key={`v-${i}`} position={[i - BOARD_WIDTH / 2, 0, 0]}>
            <boxGeometry args={[0.02, BOARD_HEIGHT, 0.02]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const activePiece = useGameStore((state) => state.activePiece);
  
  const score = useGameStore((state) => state.score);
  const prevScore = useRef(score);
  const shakeTime = useRef(0);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (score > prevScore.current) {
      shakeTime.current = 15; // Feedback on clear
      prevScore.current = score;
    }

    // High perspective: slightly above center, looking down
    // We adjust target based on piece but keep it much more stable
    let targetX = 0;
    let targetY = 0;
    
    if (activePiece) {
      targetX = (activePiece.position[0] - BOARD_WIDTH / 2) * 0.1;
      targetY = (-activePiece.position[1] + BOARD_HEIGHT / 2) * 0.05;
    }

    // Stabilized position: Higher Z and Y for "whole perspective"
    const idealPos = new THREE.Vector3(
      targetX, 
      2, // Elevated Y
      25 // Further Z for wider field of view
    );
    
    if (shakeTime.current > 0) {
      idealPos.x += (Math.random() - 0.5) * 0.4;
      idealPos.y += (Math.random() - 0.5) * 0.4;
      shakeTime.current--;
    }

    camera.position.lerp(idealPos, 0.03); // Slower, smoother tracking
    camera.lookAt(0, 0, 0); // Always center on the board
  });

  return null;
}

export function GameScene() {
  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 22]} fov={45} />
        <CameraController />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, 10]} intensity={0.5} color="#00f" />
        <spotLight position={[0, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#f0f" castShadow />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          <GridFrame />
          <StaticBoard />
          <ActivePiece />
          <GhostPiece />
        </group>

        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={false} /* Disabled to use our custom controller */
        />
      </Canvas>
    </div>
  );
}
