'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

export default function DustParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate randomized positions and properties on client-mount to avoid hydration mismatch
    const generated: Particle[] = Array.from({ length: 24 }).map((_, i) => {
      const size = Math.random() * 3 + 2; // 2px to 5px
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        delay: `${Math.random() * -25}s`, // negative delay starts animation midway
        duration: `${Math.random() * 20 + 20}s`, // 20s to 40s
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-muted-gold/20 mix-blend-multiply filter blur-[0.5px] animate-dust-drift"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
