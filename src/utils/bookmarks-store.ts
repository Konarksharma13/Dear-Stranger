import { Encouragement } from './shuffle-bag';

export interface BookmarkedPage {
  id: string | number;
  text: string;
  category: string;
  postscript?: string;
  fontStyle: number;
  dateBookmarked: string;
  decoration?: string;
}

const LOCAL_STORAGE_KEY = 'dear_stranger_bookmarks';

export function getBookmarks(): BookmarkedPage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load bookmarks', e);
    return [];
  }
}

export function saveBookmark(page: Encouragement, category: string): BookmarkedPage[] {
  if (typeof window === 'undefined') return [];
  try {
    const bookmarks = getBookmarks();
    // Prevent duplicate bookmarks
    if (bookmarks.some(b => b.id === page.id)) return bookmarks;

    const newBookmark: BookmarkedPage = {
      id: page.id,
      text: page.text,
      category: category,
      postscript: page.postscript,
      fontStyle: page.fontStyle,
      decoration: page.decoration,
      dateBookmarked: new Date().toISOString()
    };

    const updated = [newBookmark, ...bookmarks];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save bookmark', e);
    return [];
  }
}

export function removeBookmark(id: string | number): BookmarkedPage[] {
  if (typeof window === 'undefined') return [];
  try {
    const bookmarks = getBookmarks();
    const updated = bookmarks.filter(b => b.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove bookmark', e);
    return [];
  }
}

export function isBookmarked(id: string | number): boolean {
  if (typeof window === 'undefined') return false;
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.id === id);
}
