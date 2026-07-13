import dataset from '../data/encouragements.json';

export interface Encouragement {
  id: number;
  text: string;
  postscript?: string;
  decoration?: string;
  decorationLabel?: string;
  fontStyle: number;
}

export interface CategoryData {
  hope: Encouragement[];
  comfort: Encouragement[];
  strength: Encouragement[];
  peace: Encouragement[];
  motivation: Encouragement[];
}

const typedDataset = dataset as CategoryData;

/**
 * Implements a shuffle-bag algorithm with history tracking.
 * - Never repeats recently shown pages.
 * - Maintains a history buffer of up to 400 displayed IDs.
 * - Excludes IDs in history from selection.
 * - Trims the history queue if it exceeds 400 items.
 */
export function getRandomPage(
  category: keyof CategoryData,
  history: number[]
): { page: Encouragement; updatedHistory: number[] } {
  const pages = typedDataset[category];
  const historySet = new Set(history);

  // Filter out recently shown pages
  let available = pages.filter(p => !historySet.has(p.id));

  // Fallback safety: if all pages are in history, clear the history buffer
  if (available.length === 0) {
    available = pages;
    history = [];
  }

  // Select a random page from the available list
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedPage = available[randomIndex];

  // Append new ID to history queue
  const updatedHistory = [...history, selectedPage.id];
  
  // Keep history size bounded at 400 elements
  if (updatedHistory.length > 400) {
    updatedHistory.shift();
  }

  return {
    page: selectedPage,
    updatedHistory
  };
}

/**
 * Resolves a page by its ID directly.
 * Useful for handling shared page links.
 */
export function getPageById(id: number): Encouragement | null {
  for (const cat of Object.keys(typedDataset) as Array<keyof CategoryData>) {
    const found = typedDataset[cat].find(p => p.id === id);
    if (found) return found;
  }
  return null;
}
