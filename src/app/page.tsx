'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoBookmark, 
  IoCopyOutline, 
  IoDownloadOutline, 
  IoArrowBackOutline,
  IoHeart,
  IoHeartOutline,
  IoBrushOutline,
  IoRepeatOutline,
  IoShareOutline,
  IoBookOutline
} from 'react-icons/io5';

import DustParticles from '../components/DustParticles';
import Book, { HANDWRITING_FONTS } from '../components/Book';
import BookmarksDrawer from '../components/BookmarksDrawer';
import { getRandomPage, getPageById, Encouragement, CategoryData } from '../utils/shuffle-bag';
import { getBookmarks, saveBookmark, removeBookmark, isBookmarked, BookmarkedPage } from '../utils/bookmarks-store';
import { encryptPage, decryptPage } from '../utils/obfuscate';
import { playPageTurnSound } from '../utils/audio';

type Step = 'landing' | 'category' | 'reading' | 'keepsake' | 'writing' | 'ink-drying' | 'success';

export default function Home() {
  // Navigation & Step state
  const [step, setStep] = useState<Step>('landing');
  const [category, setCategory] = useState<keyof CategoryData | 'shared' | null>(null);
  
  // Current loaded page
  const [currentPage, setCurrentPage] = useState<Encouragement | null>(null);
  
  // Reader delay state (wait before showing decision buttons)
  const [showDecision, setShowDecision] = useState(false);
  const [decisionDelayTimer, setDecisionDelayTimer] = useState<NodeJS.Timeout | null>(null);

  // History buffer for shuffle-bag
  const [history, setHistory] = useState<number[]>([]);

  // Bookmark states
  const [bookmarks, setBookmarks] = useState<BookmarkedPage[]>([]);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  // Writing state
  const [writtenText, setWrittenText] = useState('');
  const [writingFontIndex, setWritingFontIndex] = useState(0); // cycles 0 to 5
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);

  // Rotating footer line
  const [rotatingFooter, setRotatingFooter] = useState('');

  // Time-based theme lighting class
  const [timeTheme, setTimeTheme] = useState('lamp-glow');

  // Sharing link state
  const [shareLink, setShareLink] = useState('');

  // Track if page is flipping visually
  const [isPageFlipping, setIsPageFlipping] = useState(false);

  // Load initial parameters and data
  useEffect(() => {
    // 1. Detect if shared link in URL
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get('p') || params.get('page');
    
    if (sharedParam) {
      const decrypted = decryptPage(sharedParam);
      if (decrypted) {
        // Construct a pseudo encouragement object
        const sharedPage: Encouragement = {
          id: -1, // Special ID for custom pages
          text: decrypted.text,
          fontStyle: decrypted.fontStyle,
          postscript: decrypted.postscript || "(Shared directly by a stranger)",
          decoration: 'gold_leaf' // Custom decoration for shared pages
        };
        setCurrentPage(sharedPage);
        setCategory('shared');
        setStep('reading');
        setShowDecision(true); // Shared pages can show decision buttons immediately
      }
    }

    // 2. Load Bookmarks
    setBookmarks(getBookmarks());

    // 3. Load rotating footer phrase
   const phrases = [
      "Somewhere out there, a stranger is healing through another page.",
      "Another piece of someone’s heart was left behind today.",
      "A single soft word is enough to pull someone out of the dark.",
      "This sanctuary grows every time a soul finds the courage to speak.",
      "We are all bleeding and hoping in different rooms, reading the same pages.",
      "A quiet echo sent across the distance, looking for you."
    ];
    setRotatingFooter(phrases[Math.floor(Math.random() * phrases.length)]);

    // 4. Set Time-Based desk lighting theme
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setTimeTheme('lamp-glow-morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeTheme('lamp-glow-afternoon');
    } else if (hour >= 17 && hour < 20) {
      setTimeTheme('lamp-glow-evening');
    } else {
      setTimeTheme('lamp-glow-night');
    }
  }, []);

  // Update check if current page is already bookmarked
  useEffect(() => {
    if (currentPage) {
      setSavedStatus(isBookmarked(currentPage.id));
    }
  }, [currentPage, bookmarks]);

  // Tab close warning event listener when writing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step === 'writing' && writtenText.trim().length > 0) {
        e.preventDefault();
        e.returnValue = "This page doesn't have to be perfect. Just honest.";
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, writtenText]);

  // Show an elegant toast message
  const showToast = (msg: string) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    setToastMessage(msg);
    const timeout = setTimeout(() => setToastMessage(null), 3000);
    setToastTimeout(timeout);
  };

  // Helper to load another page (Shuffle-bag execution)
  const loadNextPage = (selectedCat: keyof CategoryData) => {
    setIsPageFlipping(true);
    playPageTurnSound();
    
    // Clear delay timer if already running
    if (decisionDelayTimer) clearTimeout(decisionDelayTimer);
    setShowDecision(false);

    // Wait a brief visual flip animation delay
    setTimeout(() => {
      const { page, updatedHistory } = getRandomPage(selectedCat, history);
      setCurrentPage(page);
      setHistory(updatedHistory);
      setIsPageFlipping(false);

      // Start the reader quiet-time delay (wait 5 seconds before asking if found at right time)
      const timer = setTimeout(() => {
        setShowDecision(true);
      }, 5000);
      setDecisionDelayTimer(timer);
    }, 450);
  };

  // Keep Page - Download File Action
  const handleKeepPage = () => {
    if (!currentPage) return;
    try {
      const title = currentPage.id === -1 ? 'Shared Page' : `Stranger Page #${currentPage.id}`;
      const header = `========================================\n         DEAR STRANGER: A PAGE FOR YOU  \n========================================\n\n`;
      const dateStr = `Received: ${new Date().toLocaleDateString()}\n\n`;
      const text = `"${currentPage.text}"\n\n`;
      const footer = currentPage.postscript ? `${currentPage.postscript}\n\n` : '';
      const appFooter = `----------------------------------------\nKeep these words close. Let them remind you of your strength when the days get heavy.\ndear-strangers.vercel.app`;      
      const blob = new Blob([header, dateStr, text, footer, appFooter], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dear_stranger_page_${currentPage.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Page downloaded to your device.');
    } catch (e) {
      showToast('Could not keep this page.');
    }
  };

  // Copy Page Content
  const handleCopyPage = () => {
    if (!currentPage) return;
    try {
      navigator.clipboard.writeText(currentPage.text);
      showToast('Copied to your clipboard.');
    } catch (e) {
      showToast('Failed to copy.');
    }
  };

  // Save Bookmark Action
  const handleToggleBookmark = () => {
    if (!currentPage) return;
    
    if (savedStatus) {
      const updated = removeBookmark(currentPage.id);
      setBookmarks(updated);
      showToast('Removed from your kept pages.');
    } else {
      const catLabel = category === 'shared' ? 'Shared' : (category || 'Stranger');
      const updated = saveBookmark(currentPage, catLabel);
      setBookmarks(updated);
      showToast('Saved to your kept pages.');
    }
  };

  // Handle Bookmarks Drawer Selections
  const handleSelectBookmark = (bookmark: BookmarkedPage) => {
    const resolvedPage: Encouragement = {
      id: typeof bookmark.id === 'string' ? -2 : Number(bookmark.id),
      text: bookmark.text,
      fontStyle: bookmark.fontStyle,
      postscript: bookmark.postscript,
      decoration: bookmark.decoration
    };
    setCurrentPage(resolvedPage);
    setCategory('shared');
    setStep('reading');
    setShowDecision(true);
    playPageTurnSound();
  };

  // Handle Leave Page Behind (Written page submit)
  const handleLeavePage = () => {
    if (writtenText.trim().length < 10) {
      showToast('Please write a little more of your heart.');
      return;
    }
    
    playPageTurnSound();
    setStep('ink-drying');

    // Simulate ink drying for 4 seconds
    setTimeout(() => {
      const encryptedLink = encryptPage(writtenText, writingFontIndex, "(Written by a stranger)");
      const shareUrl = `${window.location.origin}${window.location.pathname}?p=${encryptedLink}`;
      setShareLink(shareUrl);
      setStep('success');
    }, 4000);
  };

  // Handle copy sharing link
  const handleCopyShareLink = () => {
    try {
      navigator.clipboard.writeText(shareLink);
      showToast('Share link copied.');
    } catch (e) {
      showToast('Failed to copy link.');
    }
  };

  // Left Page Content (Bookmarks/Stats/Library info)
  const renderLeftPage = () => {
    switch (step) {
      case 'writing':
        return (
          <div className="h-full flex flex-col justify-between z-10 text-left">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-soft-brown/60 block mb-1">A New Leaf</span>
              <h2 className="font-serif text-2xl font-light text-charcoal/80 mb-2">Write to a Stranger</h2>
              <div className="h-[1px] w-16 bg-muted-gold/30 mb-4"></div>
            </div>
            
            <div className="space-y-4 my-auto pr-4 text-xs font-sans text-soft-brown/80 leading-relaxed max-w-[240px]">
              <p>
                Imagine someone stumbling upon this exact spot tomorrow, carrying a hurt just like yours, and finding comfort in what you left behind.
              </p>
              <p className="italic font-serif text-muted-gold">
                &ldquo;You don&apos;t have to be strong here. Just be real.&rdquo;
              </p>
              <p>
                No audiences to please. No metrics to meet. Just your raw, beautiful humanity, reaching out into the dark.
              </p>
            </div>

            <button
              onClick={() => {
                setStep('reading');
                playPageTurnSound();
              }}
              className="flex items-center space-x-2 text-xs font-sans font-medium text-soft-brown hover:text-charcoal transition-colors pt-4 border-t border-[#dfd9cc]/40 w-fit"
            >
              <IoArrowBackOutline size={14} />
              <span>Go Back</span>
            </button>
          </div>
        );
      
      case 'success':
        return (
          <div className="h-full flex flex-col justify-between z-10 text-left">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-soft-brown/60 block mb-1">the cycle</span>
              <h2 className="font-serif text-2xl font-light text-charcoal/80 mb-2">A Page Sent Out</h2>
              <div className="h-[1px] w-16 bg-muted-gold/30"></div>
            </div>

            <div className="my-auto pr-4 space-y-4 text-xs font-sans text-soft-brown/80 leading-relaxed max-w-[240px]">
              <p>
                I have safely held your words here. They are a part of this space now.
              </p>
              <p>
                If there is someone you love who needs to read this, you can share the link below. Or keep it close, until the moment feels right.
              </p>
              <p className="italic font-serif text-muted-gold">
                Somewhere, out there, a heart is waiting to find what you just wrote.
              </p>
            </div>

            <div className="text-[11px] font-sans text-soft-brown/40">
              Dear Soul &bull; A safe place to rest
            </div>
          </div>
        );

      default:
        // Default Reading Left Page
        return (
          <div className="h-full flex flex-col justify-between z-10 text-left">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-soft-brown/60 block mb-1">volume i</span>
              <h2 className="font-serif text-2xl font-light text-charcoal/80 mb-2">The Gathering of Soft Whispers</h2>
              <div className="h-[1px] w-16 bg-muted-gold/30"></div>
            </div>

            <div className="my-auto py-6 pr-4 flex flex-col items-start">
              <div className="flex items-center space-x-2 text-muted-gold mb-3">
                <IoBookOutline size={18} />
                <span className="font-serif italic text-xs">whispers from a friend</span>
              </div>
            <p className="font-serif italic text-xs md:text-sm text-soft-brown/80 leading-relaxed max-w-[240px] mb-4">
              &ldquo;You are reading the heartbeat of someone who sat exactly where you are sitting now, reaching out through the quiet to remind you that you are not alone.&rdquo;
            </p>
              {bookmarks.length > 0 && (
                <button
                  onClick={() => setIsBookmarksOpen(true)}
                  className="flex items-center space-x-2 text-xs font-sans font-medium text-muted-gold hover:text-soft-brown border border-[#e5dfce] bg-[#fbfaf6] px-3 py-1.5 rounded-lg transition-all shadow-sm"
                >
                  <IoBookmark size={13} />
                  <span>Kept Pages ({bookmarks.length})</span>
                </button>
              )}
            </div>

           <div className="text-[10px] font-sans text-soft-brown/50 flex flex-col space-y-0.5">
            <span>Dear Friend &bull; A quiet space to just exist</span>
            <span>Beyond the screen, I see you. Stay a while.</span>
          </div>
          </div>
        );
    }
  };

  // Right Page Content
  const renderRightPage = () => {
    switch (step) {
      case 'writing':
        return (
          <div className="h-full flex flex-col justify-between z-10">
            {/* Handwriting controls header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#dfd5c2]/40">
              <span className="text-[10px] font-sans tracking-widest text-soft-brown/60 uppercase">
                Writing your page
              </span>
              <button
                onClick={() => setWritingFontIndex((prev) => (prev + 1) % HANDWRITING_FONTS.length)}
                className="flex items-center space-x-1.5 text-[10px] font-sans font-medium text-muted-gold hover:text-soft-brown transition-colors"
                title="Change handwriting style"
              >
                <IoBrushOutline size={12} />
                <span>Change Pen</span>
              </button>
            </div>

            {/* Handwriting area */}
            <div className="flex-1 my-4 relative">
              <textarea
                value={writtenText}
                onChange={(e) => setWrittenText(e.target.value)}
                placeholder="Someone out there may need these words more than you know..."
                className={`w-full h-full bg-transparent resize-none focus:outline-none text-[#1e293b] leading-[2rem] text-lg md:text-xl fountain-caret ${HANDWRITING_FONTS[writingFontIndex]} pen-cursor`}
                style={{
                  lineHeight: '2.5rem',
                  backgroundImage: 'linear-gradient(rgba(141, 119, 101, 0.08) 1px, transparent 1px)',
                  backgroundSize: '100% 2.5rem',
                  backgroundAttachment: 'local'
                }}
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#dfd5c2]/40">
              <button
                onClick={() => {
                  setStep('reading');
                  playPageTurnSound();
                }}
                className="text-xs font-sans font-medium text-soft-brown hover:text-charcoal transition-colors px-3 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleLeavePage}
                disabled={writtenText.trim().length < 10}
                className="flex items-center space-x-2 text-xs font-sans font-medium bg-muted-gold hover:bg-soft-brown disabled:bg-muted-gold/40 text-white px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow"
              >
                <span>Leave this page behind</span>
                <IoArrowBackOutline className="rotate-180" size={13} />
              </button>
            </div>
          </div>
        );

      case 'ink-drying':
        return (
          <div className="h-full flex flex-col justify-center items-center text-center py-12 select-none">
            <div className="w-16 h-16 relative mb-6">
              {/* Pulsing circular drying container */}
              <div className="absolute inset-0 rounded-full border-2 border-muted-gold/20 animate-ping opacity-75" />
              <div className="absolute inset-2 rounded-full border border-muted-gold/40 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-[#ebdcb9] opacity-40 flex items-center justify-center text-soft-brown">
                🖋
              </div>
            </div>
            
            <p className="font-serif italic text-charcoal/70 text-lg mb-2">
              Ink drying...
            </p>
            <p className="text-[11px] font-sans tracking-widest text-soft-brown/50 uppercase">
              Sealing your thoughts
            </p>

            {/* Faint preview of written page drying */}
            <div className="w-full mt-6 opacity-35 max-h-[120px] overflow-hidden text-center scale-95 pointer-events-none">
              <p className={`text-[#334155] leading-relaxed text-sm animate-ink-dry ${HANDWRITING_FONTS[writingFontIndex]}`}>
                {writtenText}
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="h-full flex flex-col justify-between z-10 text-center select-none py-4">
            <div>
              <span className="text-[10px] tracking-widest font-sans text-soft-brown/60 uppercase block mb-1">
                Thank you
              </span>
              <div className="h-[1px] w-8 bg-muted-gold/20 mx-auto mb-6"></div>
            </div>

              <div className="my-auto py-8">
              <p className="font-serif italic text-lg text-charcoal/90 leading-loose">
                In the quiet...
              </p>
              <p className="font-serif italic text-lg text-charcoal/90 leading-loose">
                When you least expect it...
              </p>
              <p className="font-serif italic text-lg text-charcoal/90 leading-loose">
                A heart will find exactly what you left behind.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#dfd5c2]/40">
              <div className="flex items-center bg-[#fdfdfd] border border-[#dfd5c2] rounded-lg p-2 max-w-sm mx-auto shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="bg-transparent text-[11px] font-sans text-soft-brown flex-1 outline-none px-2 select-all"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="p-2 rounded bg-muted-gold/10 hover:bg-muted-gold/20 text-muted-gold transition-colors"
                  title="Copy share link"
                >
                  <IoCopyOutline size={14} />
                </button>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center space-x-2 text-xs font-sans font-medium bg-muted-gold hover:bg-soft-brown text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  <IoShareOutline size={14} />
                  <span>Pass this page on</span>
                </button>
                <button
                  onClick={() => {
                    setWrittenText('');
                    setStep('category');
                    playPageTurnSound();
                  }}
                  className="flex items-center space-x-2 text-xs font-sans font-medium text-soft-brown hover:text-charcoal transition-colors px-3 py-2"
                >
                  <IoRepeatOutline size={14} />
                  <span>Turn another page</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        // Default READING or KEEPSAKE view
        if (!currentPage) return null;
        return (
          <div className="h-full flex flex-col justify-between z-10">
            {/* Lined paper header stamp */}
            <div className="flex justify-between items-center pb-2 border-b border-[#dfd5c2]/40">
              <span className="text-[9px] tracking-wider font-sans text-soft-brown/50 uppercase select-none">
                {currentPage.id === -1 ? 'Shared Page' : `Stranger Page #${currentPage.id}`}
              </span>
              {currentPage.decorationLabel && (
                <span className="text-[9px] font-serif text-muted-gold/70 italic select-none">
                  {currentPage.decorationLabel}
                </span>
              )}
            </div>

            {/* Handwritten Text */}
            <div className="flex-1 my-6 flex items-center justify-center py-4">
              <p 
                className={`text-[#1e293b] text-xl md:text-2xl leading-loose font-normal text-center max-w-md ${
                  HANDWRITING_FONTS[currentPage.fontStyle] || HANDWRITING_FONTS[0]
                }`}
                style={{
                  lineHeight: '2.8rem'
                }}
              >
                {currentPage.text}
              </p>
            </div>

            {/* Signature sign-off postscript */}
            {currentPage.postscript && (
              <div className="text-right pb-4 text-[10px] md:text-xs font-serif italic text-soft-brown/60 select-none">
                {currentPage.postscript}
              </div>
            )}

            {/* Navigation and Bottom actions */}
            <div className="pt-4 border-t border-[#dfd5c2]/40 min-h-[56px] flex items-center justify-between">
              
              {/* STEP: READING (Wait for delay to show decision, or show immediately) */}
              {step === 'reading' && (
                <div className="w-full flex flex-col items-center">
                  <AnimatePresence>
                    {showDecision ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 select-none"
                      >
                        <span className="text-xs font-serif text-charcoal/70 italic mr-2">
                          Did this page find you at the right time?
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setStep('keepsake');
                              playPageTurnSound();
                              // Save automatically to bookmarks when they say "Yes, I needed this"
                              const catLabel = category === 'shared' ? 'Shared' : (category || 'Stranger');
                              const updated = saveBookmark(currentPage, catLabel);
                              setBookmarks(updated);
                              showToast('Kept in your collection.');
                            }}
                            className="flex items-center space-x-1.5 text-xs font-sans font-medium text-[#c2410c] hover:text-[#9a3412] bg-[#fdf2e9] border border-[#fbd5c0] px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            <IoHeart size={13} />
                            <span>Yes, I needed this</span>
                          </button>
                          <button
                            onClick={() => {
                              setStep('writing');
                              playPageTurnSound();
                            }}
                            className="flex items-center space-x-1.5 text-xs font-sans font-medium text-muted-gold hover:text-soft-brown bg-[#fdfcfa] border border-[#dfd5c2] px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            <IoBrushOutline size={13} />
                            <span>I&apos;ll write the next page</span>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-xs font-serif text-soft-brown/50 italic animate-pulse">
                        Turning the page...
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* STEP: KEEPSAKE (Show keepsakes details) */}
              {step === 'keepsake' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-sans text-soft-brown/60 select-none pb-2 border-b border-[#f5f1e6]">
                    <span>Come back whenever you need another page.</span>
                    <span className="font-serif italic text-muted-gold font-semibold">Kept in Bookmarks</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleKeepPage}
                      className="flex items-center space-x-1.5 text-xs font-sans font-medium text-soft-brown hover:text-charcoal bg-[#f5f1e6] px-3 py-1.5 rounded-lg transition-colors"
                      title="Keep this page (Download)"
                    >
                      <IoDownloadOutline size={14} />
                      <span>Keep this page</span>
                    </button>
                    <button
                      onClick={handleCopyPage}
                      className="flex items-center space-x-1.5 text-xs font-sans font-medium text-soft-brown hover:text-charcoal bg-[#f5f1e6] px-3 py-1.5 rounded-lg transition-colors"
                      title="Copy page text"
                    >
                      <IoCopyOutline size={14} />
                      <span>Copy page</span>
                    </button>
                    <button
                      onClick={handleToggleBookmark}
                      className="flex items-center space-x-1.5 text-xs font-sans font-medium text-soft-brown hover:text-charcoal bg-[#f5f1e6] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {savedStatus ? <IoHeart className="text-[#c2410c]" size={14} /> : <IoHeartOutline size={14} />}
                      <span>{savedStatus ? 'Saved' : 'Save'}</span>
                    </button>

                    {/* Cycle Action */}
                    {category && category !== 'shared' && (
                      <button
                        onClick={() => loadNextPage(category as keyof CategoryData)}
                        className="flex items-center space-x-1.5 text-xs font-sans font-medium bg-muted-gold hover:bg-soft-brown text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm ml-auto"
                      >
                        <IoRepeatOutline size={14} />
                        <span>Turn the page</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setStep('writing');
                        playPageTurnSound();
                      }}
                      className="flex items-center space-x-1.5 text-xs font-sans font-medium text-muted-gold hover:text-soft-brown border border-[#e5dfce] bg-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm ml-auto"
                    >
                      <IoBrushOutline size={14} />
                      <span>Write next page</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex-1 relative flex flex-col justify-between overflow-x-hidden ${step === 'writing' ? 'pen-cursor' : ''}`}>
      {/* 1. Subtle Dynamic Lamp Glow Background */}
      <div className={`absolute inset-0 transition-all duration-[3000ms] ${timeTheme}`} />
      
      {/* 2. Tiny paper fibers pattern overlay */}
      <div className="absolute inset-0 bg-[url('/paper_pattern.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      {/* 3. Floating Dust Particles */}
      <DustParticles />

      {/* 4. Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between z-30 select-none">
        <div 
          onClick={() => {
            setStep('landing');
            setCurrentPage(null);
            setCategory(null);
            playPageTurnSound();
          }}
          className="flex items-center space-x-2 text-soft-brown hover:text-charcoal cursor-pointer transition-colors"
        >
          <span className="font-serif italic text-lg tracking-widest text-[#a88d67]">dear stranger</span>
        </div>

        <div className="flex items-center space-x-4">
          {bookmarks.length > 0 && (
            <button
              onClick={() => setIsBookmarksOpen(true)}
              className="p-2 rounded-full text-soft-brown hover:text-charcoal hover:bg-[#ebdcb9]/40 transition-colors flex items-center space-x-1.5"
              title="View your kept pages"
            >
              <IoBookmark size={20} />
              <span className="text-xs font-sans font-medium hidden sm:inline">Kept Pages ({bookmarks.length})</span>
            </button>
          )}
        </div>
      </header>

      {/* 5. Main Interactivity Arena */}
      <main className="flex-1 flex items-center justify-center z-25 py-6">
        <AnimatePresence mode="wait">
          
          {/* STEP: LANDING SCREEN */}
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-xl text-center px-6 flex flex-col items-center select-none"
            >
              <div className="mb-4">
                <span className="text-[10px] tracking-[0.3em] font-sans text-muted-gold uppercase block mb-1">Where my heart met yours</span>
                <div className="h-[1px] w-8 bg-muted-gold/30 mx-auto"></div>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl font-light text-charcoal tracking-wide mb-3">
                Dear Stranger
              </h1>
              
              <p className="font-serif italic text-sm text-soft-brown mb-8 tracking-wider">
                A page for you.
              </p>

              {/* Closed Vintage Book Visual */}
              <Book isOpen={false} onOpen={() => setStep('category')} />

              <p className="font-serif italic text-xs text-soft-brown/70 leading-relaxed max-w-sm mt-8 mb-6">
                &ldquo;I hope this page finds you when you need it most.&rdquo;
              </p>

              <button
                onClick={() => {
                  setStep('category');
                  playPageTurnSound();
                }}
                className="font-sans text-xs tracking-[0.2em] font-semibold text-white bg-muted-gold hover:bg-soft-brown hover:scale-105 active:scale-95 transition-all duration-300 uppercase px-8 py-3 rounded-lg shadow-md"
              >
                Begin
              </button>
            </motion.div>
          )}

          {/* STEP: CATEGORY SELECTION */}
          {step === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="w-full max-w-md text-center px-6 select-none flex flex-col items-center"
            >
              <button
                onClick={() => {
                  setStep('landing');
                  playPageTurnSound();
                }}
                className="flex items-center space-x-2 text-xs font-sans font-medium text-soft-brown hover:text-charcoal transition-colors mb-8"
              >
                <IoArrowBackOutline size={14} />
                <span>Go Back</span>
              </button>

              <span className="text-[10px] tracking-[0.2em] font-sans text-soft-brown/60 uppercase block mb-2">Before you turn the page...</span>
              <h2 className="font-serif text-3xl font-light text-charcoal tracking-wide mb-8">What do you need today?</h2>

              <div className="w-full flex flex-col space-y-3">
                {[
                  { key: 'hope', label: 'Hope', icon: '🌤' },
                  { key: 'comfort', label: 'Comfort', icon: '💙' },
                  { key: 'strength', label: 'Strength', icon: '🌱' },
                  { key: 'peace', label: 'Peace', icon: '🌸' },
                  { key: 'motivation', label: 'Motivation', icon: '✨' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setCategory(item.key as keyof CategoryData);
                      setStep('reading');
                      loadNextPage(item.key as keyof CategoryData);
                    }}
                    className="w-full font-sans text-sm text-left bg-white border border-[#dfd5c2] hover:border-muted-gold hover:shadow-md px-6 py-4 rounded-xl flex items-center transition-all group"
                  >
                    <span className="text-lg mr-4">{item.icon}</span>
                    <span className="font-medium text-charcoal/80 group-hover:text-charcoal">{item.label}</span>
                    <span className="ml-auto text-[10px] text-soft-brown/40 group-hover:text-muted-gold transition-colors font-semibold uppercase tracking-wider">
                      Turn page
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: READING / KEEPSAKE / WRITING / DRYING / SUCCESS */}
          {['reading', 'keepsake', 'writing', 'ink-drying', 'success'].includes(step) && (
            <motion.div
              key="book-spread"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-5xl px-4 flex flex-col items-center"
            >
              {/* Back to Categories link when reading (shared pages hide this) */}
              {step === 'reading' && category !== 'shared' && (
                <button
                  onClick={() => {
                    setStep('category');
                    playPageTurnSound();
                  }}
                  className="flex items-center space-x-2 text-xs font-sans font-medium text-soft-brown hover:text-charcoal transition-colors mb-6 select-none"
                >
                  <IoArrowBackOutline size={14} />
                  <span>Choose Another Path</span>
                </button>
              )}

              {/* Back to Reading Link from Keepsake */}
              {step === 'keepsake' && category !== 'shared' && (
                <button
                  onClick={() => {
                    setStep('reading');
                    playPageTurnSound();
                  }}
                  className="flex items-center space-x-2 text-xs font-sans font-medium text-soft-brown hover:text-charcoal transition-colors mb-6 select-none"
                >
                  <IoArrowBackOutline size={14} />
                  <span>Back to Reading</span>
                </button>
              )}

              {/* The Actual Journal Spread Layout */}
              <Book
                isOpen={true}
                isFlipping={isPageFlipping}
                leftPageContent={renderLeftPage()}
                rightPageContent={renderRightPage()}
                fontStyle={currentPage?.fontStyle || 0}
                decoration={currentPage?.decoration}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 6. Dynamic Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#2c2a29] text-[#fbf9f4] text-xs font-sans font-medium px-4 py-2.5 rounded-lg shadow-xl z-50 flex items-center space-x-2 tracking-wide"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Bookmarks Sidebar Drawer Panel */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={(id) => setBookmarks(removeBookmark(id))}
        onSelectBookmark={handleSelectBookmark}
      />

      {/* 8. Elegant Footer */}
      <footer className="w-full py-6 text-center select-none text-[10px] tracking-[0.25em] font-sans text-soft-brown/50 z-30 uppercase">
        {rotatingFooter}
      </footer>
    </div>
  );
}
