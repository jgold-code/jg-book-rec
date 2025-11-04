import { useState, useEffect } from 'react';
import { BookRecommendation } from '../services/openai';

const STORAGE_KEY = 'shelfaware-reading-list';

export function useReadingList() {
  const [readingList, setReadingList] = useState<BookRecommendation[]>([]);

  // Load reading list from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setReadingList(parsed);
      }
    } catch (error) {
      console.error('Error loading reading list:', error);
    }
  }, []);

  // Save to localStorage whenever reading list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
    } catch (error) {
      console.error('Error saving reading list:', error);
    }
  }, [readingList]);

  const addToReadingList = (book: BookRecommendation) => {
    setReadingList((prev) => {
      // Check if book is already in the list
      if (prev.some((b) => b.id === book.id)) {
        return prev;
      }
      return [...prev, book];
    });
  };

  const removeFromReadingList = (bookId: string) => {
    setReadingList((prev) => prev.filter((b) => b.id !== bookId));
  };

  const isInReadingList = (bookId: string) => {
    return readingList.some((b) => b.id === bookId);
  };

  const clearReadingList = () => {
    setReadingList([]);
  };

  return {
    readingList,
    addToReadingList,
    removeFromReadingList,
    isInReadingList,
    clearReadingList,
  };
}

