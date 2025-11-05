import { useState, useEffect } from 'react';
import { BookRecommendation } from '../services/openai';

const WANT_TO_READ_KEY = 'shelfaware-want-to-read';
const ALREADY_READ_KEY = 'shelfaware-already-read';

export function useReadingList() {
  const [wantToRead, setWantToRead] = useState<BookRecommendation[]>([]);
  const [alreadyRead, setAlreadyRead] = useState<BookRecommendation[]>([]);

  // Load lists from localStorage on mount
  useEffect(() => {
    try {
      const wantStored = localStorage.getItem(WANT_TO_READ_KEY);
      const readStored = localStorage.getItem(ALREADY_READ_KEY);
      
      if (wantStored) {
        setWantToRead(JSON.parse(wantStored));
      }
      if (readStored) {
        setAlreadyRead(JSON.parse(readStored));
      }
    } catch (error) {
      console.error('Error loading reading lists:', error);
    }
  }, []);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(WANT_TO_READ_KEY, JSON.stringify(wantToRead));
    } catch (error) {
      console.error('Error saving want to read list:', error);
    }
  }, [wantToRead]);

  useEffect(() => {
    try {
      localStorage.setItem(ALREADY_READ_KEY, JSON.stringify(alreadyRead));
    } catch (error) {
      console.error('Error saving already read list:', error);
    }
  }, [alreadyRead]);

  const addToWantToRead = (book: BookRecommendation) => {
    setWantToRead((prev) => {
      if (prev.some((b) => b.id === book.id)) {
        return prev;
      }
      return [...prev, book];
    });
    // Remove from already read if it's there
    setAlreadyRead((prev) => prev.filter((b) => b.id !== book.id));
  };

  const addToAlreadyRead = (book: BookRecommendation) => {
    setAlreadyRead((prev) => {
      if (prev.some((b) => b.id === book.id)) {
        return prev;
      }
      return [...prev, book];
    });
    // Remove from want to read if it's there
    setWantToRead((prev) => prev.filter((b) => b.id !== book.id));
  };

  const removeFromWantToRead = (bookId: string) => {
    setWantToRead((prev) => prev.filter((b) => b.id !== bookId));
  };

  const removeFromAlreadyRead = (bookId: string) => {
    setAlreadyRead((prev) => prev.filter((b) => b.id !== bookId));
  };

  const moveToAlreadyRead = (bookId: string) => {
    const book = wantToRead.find((b) => b.id === bookId);
    if (book) {
      addToAlreadyRead(book);
    }
  };

  const moveToWantToRead = (bookId: string) => {
    const book = alreadyRead.find((b) => b.id === bookId);
    if (book) {
      addToWantToRead(book);
    }
  };

  const isInWantToRead = (bookId: string) => {
    return wantToRead.some((b) => b.id === bookId);
  };

  const isInAlreadyRead = (bookId: string) => {
    return alreadyRead.some((b) => b.id === bookId);
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

