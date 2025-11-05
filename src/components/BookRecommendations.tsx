import React from 'react';
import BookCard from './BookCard';
import { BookRecommendation } from '../services/openai';

interface BookRecommendationsProps {
  books: BookRecommendation[];
  onAddToList: (book: BookRecommendation) => void;
  isInList: (bookId: string) => boolean;
  onMoreLikeThis: (book: BookRecommendation) => void;
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({ books, onAddToList, isInList, onMoreLikeThis }) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAddToList={() => onAddToList(book)}
            isInList={isInList(book.id)}
            onMoreLikeThis={() => onMoreLikeThis(book)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookRecommendations;

