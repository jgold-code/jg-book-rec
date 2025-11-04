import React, { useState } from 'react';
import BookCard from './BookCard';
import { BookRecommendation } from '../services/openai';

interface ReadingListProps {
  books: BookRecommendation[];
  onRemove: (bookId: string) => void;
  onClear: () => void;
}

const ReadingList: React.FC<ReadingListProps> = ({ books, onRemove, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-3 px-6 py-4 font-semibold"
      >
        <span className="text-2xl">📚</span>
        <span>Want to Read ({books.length})</span>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Want to Read List</h3>
            <div className="flex gap-2">
              {books.length > 0 && (
                <button
                  onClick={onClear}
                  className="text-xs bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-gray-200 text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Book List */}
          <div className="overflow-y-auto p-4 space-y-4">
            {books.map((book) => (
              <div key={book.id} className="relative group">
                <div className="scale-95 hover:scale-100 transition-transform">
                  <BookCard book={book} compact />
                </div>
                <button
                  onClick={() => onRemove(book.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove from list"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingList;

