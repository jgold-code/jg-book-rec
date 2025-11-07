import React from 'react';
import BookCard from './BookCard';
import { BookRecommendation } from '../services/openai';

interface BookRecommendationsProps {
  books: BookRecommendation[];
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({ books }) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Recommended Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookRecommendations;

