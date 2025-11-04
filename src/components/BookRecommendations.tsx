import React from 'react';
import BookCard from './BookCard';
import { BookRecommendation } from '../services/openai';

interface BookRecommendationsProps {
  books: BookRecommendation[];
  onAddToList: (book: BookRecommendation) => void;
  isInList: (bookId: string) => boolean;
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({ books, onAddToList, isInList }) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Your Personalized Recommendations
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAddToList={() => onAddToList(book)}
            isInList={isInList(book.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookRecommendations;

