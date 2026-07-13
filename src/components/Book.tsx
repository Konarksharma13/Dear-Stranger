'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookProps {
  isOpen: boolean;
  leftPageContent?: React.ReactNode;
  rightPageContent?: React.ReactNode;
  fontStyle?: number; // 0 to 5
  decoration?: string; // pressed_flower, coffee_ring, dried_leaf, tear_stain, gold_leaf
  onOpen?: () => void;
  isFlipping?: boolean;
}

// Map the font index to CSS class names
export const HANDWRITING_FONTS = [
  'font-hand-0', // Caveat
  'font-hand-1', // Sacramento
  'font-hand-2', // Architects Daughter
  'font-hand-3', // Reenie Beanie
  'font-hand-4', // Shadows Into Light
  'font-hand-5', // Nothing You Could Do
];

export default function Book({
  isOpen,
  leftPageContent,
  rightPageContent,
  fontStyle = 0,
  decoration,
  onOpen,
  isFlipping = false
}: BookProps) {
  
  const fontClass = HANDWRITING_FONTS[fontStyle] || HANDWRITING_FONTS[0];

  // Helper to render decoration elements
  const renderDecoration = () => {
    if (!decoration) return null;

    switch (decoration) {
      case 'pressed_flower':
        return (
          <div className="absolute top-6 right-6 pointer-events-none opacity-40 select-none scale-110 flex flex-col items-center">
            <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 50C20 50 15 40 15 32C15 28 17 25 20 25C23 25 25 28 25 32C25 40 20 50 20 50Z" fill="#a78bfa" opacity="0.6"/>
              <path d="M20 50C20 50 25 42 27 35C29 28 25 26 22 27C19 28 20 32 20 35" stroke="#7c2d12" strokeWidth="0.8"/>
              <circle cx="20" cy="28" r="3" fill="#f59e0b" opacity="0.8"/>
              {/* Petals */}
              <circle cx="16" cy="26" r="4" fill="#c084fc" opacity="0.5"/>
              <circle cx="24" cy="26" r="4" fill="#c084fc" opacity="0.5"/>
              <circle cx="20" cy="23" r="4" fill="#c084fc" opacity="0.5"/>
              <circle cx="20" cy="32" r="4" fill="#c084fc" opacity="0.5"/>
              {/* Stem */}
              <path d="M20 35V58" stroke="#5c6f52" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M20 48C17 48 16 45 15 44" stroke="#5c6f52" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] font-sans text-soft-brown/40 mt-1 italic tracking-widest">pressed violet</span>
          </div>
        );
      case 'dried_leaf':
        return (
          <div className="absolute top-6 right-8 pointer-events-none opacity-40 select-none scale-100 flex flex-col items-center">
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 45C20 45 12 35 12 25C12 15 20 5 20 5C20 5 28 15 28 25C28 35 20 45 20 45Z" fill="#c2410c" opacity="0.4"/>
              <path d="M20 5V48" stroke="#78350f" strokeWidth="1"/>
              <path d="M20 15C16 17 14 20 13 22" stroke="#78350f" strokeWidth="0.6"/>
              <path d="M20 20C24 22 26 25 27 27" stroke="#78350f" strokeWidth="0.6"/>
              <path d="M20 27C16 29 14 32 13 34" stroke="#78350f" strokeWidth="0.6"/>
              <path d="M20 32C24 34 26 37 27 39" stroke="#78350f" strokeWidth="0.6"/>
            </svg>
            <span className="text-[9px] font-sans text-soft-brown/40 mt-1 italic tracking-widest">pressed maple</span>
          </div>
        );
      case 'coffee_ring':
        return (
          <div className="absolute -bottom-8 -left-8 pointer-events-none opacity-[0.12] select-none">
            <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="42" stroke="#78350f" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 10 40 5 10 20"/>
              <circle cx="53" cy="51" r="39" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="10 50 30 10"/>
              <path d="M30 20C25 25 24 35 30 40" stroke="#78350f" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
        );
      case 'tear_stain':
        return (
          <div className="absolute bottom-16 right-16 pointer-events-none opacity-20 select-none">
            <div className="w-12 h-12 rounded-full bg-[#dfd6c2] filter blur-[4px] border border-[#beb199]" />
            <div className="w-8 h-8 rounded-full bg-[#dfd6c2] filter blur-[3px] ml-6 -mt-4 border border-[#beb199]" />
          </div>
        );
      case 'gold_leaf':
        return (
          <div className="absolute top-0 bottom-0 right-0 w-[4px] bg-gradient-to-b from-[#e5c07b] via-[#c3a165] to-[#d4af37] shadow-sm pointer-events-none opacity-70" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center py-6 px-4 perspective-[1500px]">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* CLOSED BOOK COVER */
          <motion.div
            key="closed"
            initial={{ rotateY: 0, scale: 0.95, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            exit={{ rotateY: -15, scale: 0.98, opacity: 0, transition: { duration: 0.6 } }}
            onClick={onOpen}
            className="w-full max-w-[340px] md:max-w-[380px] aspect-[3/4.2] bg-[#3e2b20] rounded-r-2xl rounded-l-md shadow-2xl relative border-y-[6px] border-r-[8px] border-[#291c15] flex flex-col justify-between p-8 md:p-10 select-none cursor-pointer group transform-gpu overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 30%, #4e3629 0%, #2f1f17 100%)',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.45), inset 0 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Vintage Book Spine Lines */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#231711] rounded-l-md opacity-90 shadow-inner flex flex-col justify-around py-12">
              <div className="h-[2px] w-full bg-[#1c120d] opacity-50"></div>
              <div className="h-[2px] w-full bg-[#1c120d] opacity-50"></div>
              <div className="h-[2px] w-full bg-[#1c120d] opacity-50"></div>
              <div className="h-[2px] w-full bg-[#1c120d] opacity-50"></div>
            </div>

            {/* Gold Filigree Corner Ornaments */}
            <div className="absolute top-4 right-4 text-muted-gold/40 font-serif text-lg pointer-events-none group-hover:text-muted-gold/60 transition-colors">✦</div>
            <div className="absolute top-4 left-6 text-muted-gold/40 font-serif text-lg pointer-events-none group-hover:text-muted-gold/60 transition-colors">✦</div>
            <div className="absolute bottom-4 right-4 text-muted-gold/40 font-serif text-lg pointer-events-none group-hover:text-muted-gold/60 transition-colors">✦</div>
            <div className="absolute bottom-4 left-6 text-muted-gold/40 font-serif text-lg pointer-events-none group-hover:text-muted-gold/60 transition-colors">✦</div>

            {/* Gold Foil Border Inlay */}
            <div className="absolute inset-[16px] border border-muted-gold/25 rounded-md pointer-events-none group-hover:border-muted-gold/45 transition-colors">
              <div className="absolute inset-[2px] border border-muted-gold/10 pointer-events-none" />
            </div>

            {/* Book Spine Texture Edge */}
            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-white/5" />

            {/* Top Text */}
            <div className="mt-8 text-center">
              <span className="text-[11px] uppercase tracking-[0.25em] font-sans text-muted-gold/50 block mb-2">Proof that you were here.</span>
              <div className="h-[1px] w-12 bg-muted-gold/20 mx-auto"></div>
            </div>

            {/* Main Cover Title */}
            <div className="text-center my-auto px-4 z-20 flex flex-col items-center">
              <h1 className="font-serif text-4xl md:text-5xl font-light text-[#dfc599] tracking-wider mb-2 select-none group-hover:text-white transition-colors duration-500">
                Dear Stranger
              </h1>
              <p className="font-serif italic text-xs md:text-sm text-soft-brown/70 tracking-wide mt-2">
                A Page for You
              </p>
            </div>

            {/* Footer Cover Details */}
            <div className="text-center z-10">
              <span className="text-[10px] tracking-[0.3em] font-sans text-muted-gold/40 uppercase group-hover:text-muted-gold/60 transition-colors">
                Open Book
              </span>
              <div className="text-xs text-soft-brown/40 mt-1">✦</div>
            </div>
          </motion.div>
        ) : (
          /* OPEN BOOK SPREAD */
          <motion.div
            key="open"
            initial={{ rotateX: 5, rotateY: 30, scale: 0.9, opacity: 0 }}
            animate={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 80 } }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.3 } }}
            className="w-full flex justify-center transform-gpu max-w-4xl"
          >
            {/* Physical Journal Wrapping (Behind Pages) */}
            <div className="w-full bg-[#3e2b20] rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5)] border-y-[4px] border-x-[2px] border-[#291c15] flex p-1 relative md:aspect-[1.5/1]">
              
              {/* Leather cover overhang visible at margins */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f1f17] via-[#463125] to-[#2f1f17] rounded-xl -z-10" />

              {/* Book Spread Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#f4ebd0] rounded-xl overflow-hidden relative shadow-inner">
                
                {/* 1. LEFT PAGE (Decorative / Context / Bookmarks) */}
                <div className="hidden md:flex flex-col justify-between p-10 pr-12 bg-[#faf6eb] relative border-r border-[#e8dfc7] shadow-[inset_-10px_0_20px_-10px_rgba(0,0,0,0.06)] min-h-[460px]">
                  
                  {/* Left Spine Crease Shadow Overlay */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 book-spine-left pointer-events-none" />

                  {/* Left Page content slot */}
                  {leftPageContent ? (
                    <div className="h-full flex flex-col justify-between z-10">
                      {leftPageContent}
                    </div>
                  ) : (
                    /* Default Left Page Content */
                    <div className="h-full flex flex-col justify-between z-10 text-center">
                      <div className="text-left">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-soft-brown/60 block mb-1">volume i</span>
                        <h2 className="font-serif text-2xl font-light text-charcoal/80 mb-2">The Gathering of Soft Whispers</h2>
                        <div className="h-[1px] w-16 bg-muted-gold/30"></div>
                      </div>

                      <div className="my-auto py-8 px-4 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border border-muted-gold/20 flex items-center justify-center text-muted-gold mb-4 font-serif italic text-lg select-none">
                          DS
                        </div>
                        <p className="font-serif italic text-sm text-soft-brown/80 leading-relaxed max-w-[240px]">
                          &ldquo;Every kind word written here is a lantern left in the dark by someone who has walked this path before you.&rdquo;
                        </p>
                      </div>

                      <div className="text-left text-[11px] font-sans text-soft-brown/50">
                        <p>A quiet place on the internet.</p>
                        <p>No algorithms. Only grace.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. RIGHT PAGE (Handwritten Text / Active Content) */}
                <div 
                  className={`flex flex-col justify-between p-8 md:p-10 pl-8 md:pl-12 bg-[#fcfaf4] relative min-h-[460px] ${
                    isFlipping ? 'animate-[pulse_0.4s_ease-in-out]' : ''
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.01) 1px, transparent 0)',
                    backgroundSize: '12px 12px',
                  }}
                >
                  {/* Right Spine Crease Shadow Overlay */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 book-spine-right pointer-events-none" />
                  
                  {/* Decorative touches (flower, coffee ring etc.) */}
                  {renderDecoration()}

                  {/* Right Page Main Slot */}
                  <div className="h-full flex flex-col justify-between z-10">
                    {rightPageContent}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
