import { useState, useEffect } from 'react';
import { BookRecommendation } from '../services/openai';

export function useReadingList() {
  const [wantToRead, setWantToRead] = useState<BookRecommendation[]>([]);
  const [alreadyRead, setAlreadyRead] = useState<BookRecommendation[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWantToRead = localStorage.getItem('wantToRead');
    const savedAlreadyRead = localStorage.getItem('alreadyRead');
    
    if (savedWantToRead) {
      try {
        setWantToRead(JSON.parse(savedWantToRead));
      } catch (e) {
        console.error('Failed to parse wantToRead from localStorage', e);
      }
    }
    
    if (savedAlreadyRead) {
      try {
        setAlreadyRead(JSON.parse(savedAlreadyRead));
      } catch (e) {
        console.error('Failed to parse alreadyRead from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage whenever lists change
  useEffect(() => {
    localStorage.setItem('wantToRead', JSON.stringify(wantToRead));
  }, [wantToRead]);

  useEffect(() => {
    localStorage.setItem('alreadyRead', JSON.stringify(alreadyRead));
  }, [alreadyRead]);

  const addToWantToRead = (book: BookRecommendation) => {
    // Remove from alreadyRead if it exists there
    setAlreadyRead(prev => prev.filter(b => b.id !== book.id));
    // Add to wantToRead if not already there
    setWantToRead(prev => {
      if (prev.find(b => b.id === book.id)) {
        return prev;
      }
      return [...prev, book];
    });
  };

  const addToAlreadyRead = (book: BookRecommendation) => {
    // Remove from wantToRead if it exists there
    setWantToRead(prev => prev.filter(b => b.id !== book.id));
    // Add to alreadyRead if not already there
    setAlreadyRead(prev => {
      if (prev.find(b => b.id === book.id)) {
        return prev;
      }
      return [...prev, book];
    });
  };

  const removeFromWantToRead = (bookId: string) => {
    setWantToRead(prev => prev.filter(b => b.id !== bookId));
  };

  const removeFromAlreadyRead = (bookId: string) => {
    setAlreadyRead(prev => prev.filter(b => b.id !== bookId));
  };

  const moveToAlreadyRead = (bookId: string) => {
    const book = wantToRead.find(b => b.id === bookId);
    if (book) {
      removeFromWantToRead(bookId);
      addToAlreadyRead(book);
    }
  };

  const moveToWantToRead = (bookId: string) => {
    const book = alreadyRead.find(b => b.id === bookId);
    if (book) {
      removeFromAlreadyRead(bookId);
      addToWantToRead(book);
    }
  };

  const isInWantToRead = (bookId: string) => {
    return wantToRead.some(b => b.id === bookId);
  };

  const isInAlreadyRead = (bookId: string) => {
    return alreadyRead.some(b => b.id === bookId);
  };

  const isInAnyList = (bookId: string) => {
    return isInWantToRead(bookId) || isInAlreadyRead(bookId);
  };

  const clearWantToRead = () => {
    setWantToRead([]);
  };

  const clearAlreadyRead = () => {
    setAlreadyRead([]);
  };

  return {
    wantToRead,
    alreadyRead,
    addToWantToRead,
    addToAlreadyRead,
    removeFromWantToRead,
    removeFromAlreadyRead,
    moveToAlreadyRead,
    moveToWantToRead,
    isInWantToRead,
    isInAlreadyRead,
    isInAnyList,
    clearWantToRead,
    clearAlreadyRead,
  };
}

