'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoTrashOutline, IoOpenOutline } from 'react-icons/io5';
import { BookmarkedPage } from '../utils/bookmarks-store';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkedPage[];
  onRemoveBookmark: (id: string | number) => void;
  onSelectBookmark: (bookmark: BookmarkedPage) => void;
}

export default function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onSelectBookmark
}: BookmarksDrawerProps) {
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#29221d] z-40 backdrop-blur-sm"
          />

          {/* Sliding Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#faf8f5] shadow-2xl z-50 flex flex-col justify-between border-l border-[#dfd9cc]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#dfd9cc] flex items-center justify-between bg-[#faf6eb]">
              <div>
                <h3 className="font-serif text-xl font-light text-charcoal">Your Kept Pages</h3>
                <p className="text-xs text-soft-brown/70 mt-0.5">A personal collection of words that found you.</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-soft-brown hover:text-charcoal hover:bg-[#ebdcb9]/40 transition-colors"
                aria-label="Close bookmarks"
              >
                <IoCloseOutline size={26} />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {bookmarks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 select-none">
                  <div className="text-muted-gold text-2xl font-serif italic mb-2">DS</div>
                  <p className="font-serif italic text-sm text-soft-brown/80 max-w-[240px]">
                    &ldquo;This chest is empty. When a page speaks to you, keep it, and it will be waiting for you here.&rdquo;
                  </p>
                </div>
              ) : (
                bookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 bg-white border border-[#dfd5c2] rounded-xl hover:shadow-md hover:border-muted-gold/40 transition-all group flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Small category tag */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] tracking-wider uppercase bg-[#f5f1e6] px-2 py-0.5 rounded text-soft-brown font-medium">
                        {b.category}
                      </span>
                      <span className="text-[9px] text-soft-brown/50">
                        {new Date(b.dateBookmarked).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <p className="font-serif text-charcoal/90 text-sm leading-relaxed line-clamp-3 mb-4 italic">
                      &ldquo;{b.text}&rdquo;
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#f5f1e6] z-10">
                      <button
                        onClick={() => {
                          onSelectBookmark(b);
                          onClose();
                        }}
                        className="text-xs flex items-center space-x-1.5 text-muted-gold hover:text-soft-brown font-medium transition-colors"
                      >
                        <IoOpenOutline size={14} />
                        <span>Read Page</span>
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(b.id)}
                        className="text-xs flex items-center space-x-1.5 text-red-700/60 hover:text-red-800 font-medium transition-colors ml-auto"
                        aria-label="Remove bookmark"
                      >
                        <IoTrashOutline size={13} />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Subtle decorative background detail */}
                    <div className="absolute right-0 bottom-0 text-[60px] opacity-[0.02] text-soft-brown select-none pointer-events-none translate-x-4 translate-y-4 font-serif italic">
                      {b.category[0].toUpperCase()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#faf6eb] border-t border-[#dfd9cc] text-center select-none text-[10px] font-sans text-soft-brown/50 tracking-wider">
              YOUR PERSONAL JOURNAL &bull; SAVED LOCALLY
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
