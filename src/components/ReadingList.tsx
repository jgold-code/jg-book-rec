import React, { useState } from 'react';
import BookCard from './BookCard';
import { BookRecommendation } from '../services/openai';

interface ReadingListProps {
  wantToRead: BookRecommendation[];
  alreadyRead: BookRecommendation[];
  onRemoveWant: (bookId: string) => void;
  onRemoveRead: (bookId: string) => void;
  onMoveToRead: (bookId: string) => void;
  onMoveToWant: (bookId: string) => void;
  onClearWant: () => void;
  onClearRead: () => void;
}

const ReadingList: React.FC<ReadingListProps> = ({
  wantToRead,
  alreadyRead,
  onRemoveWant,
  onRemoveRead,
  onMoveToRead,
  onMoveToWant,
  onClearWant,
  onClearRead,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'want' | 'read'>('want');

  const totalBooks = wantToRead.length + alreadyRead.length;

  if (totalBooks === 0) {
    return null;
  }

  const currentBooks = activeTab === 'want' ? wantToRead : alreadyRead;
  const currentRemove = activeTab === 'want' ? onRemoveWant : onRemoveRead;
  const currentClear = activeTab === 'want' ? onClearWant : onClearRead;
  const moveToOther = activeTab === 'want' ? onMoveToRead : onMoveToWant;
  const moveLabel = activeTab === 'want' ? 'Mark as Read' : 'Move to Want';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-3 px-6 py-4 font-semibold"
      >
        <span className="text-2xl">📚</span>
        <span>My Books ({totalBooks})</span>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">My Reading List</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-gray-200 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('want')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'want'
                    ? 'bg-white text-indigo-600'
                    : 'bg-indigo-700 text-white hover:bg-indigo-800'
                }`}
              >
                Want to Read ({wantToRead.length})
              </button>
              <button
                onClick={() => setActiveTab('read')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'read'
                    ? 'bg-white text-indigo-600'
                    : 'bg-indigo-700 text-white hover:bg-indigo-800'
                }`}
              >
                Already Read ({alreadyRead.length})
              </button>
            </div>
          </div>

          {/* Book List */}
          <div className="overflow-y-auto p-4 space-y-4">
            {currentBooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">📖</p>
                <p>No books in this list yet</p>
              </div>
            ) : (
              <>
                {currentBooks.length > 0 && (
                  <button
                    onClick={currentClear}
                    className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition-colors"
                  >
                    Clear All
                  </button>
                )}
                {currentBooks.map((book) => (
                  <div key={book.id} className="relative group">
                    <div className="scale-95 hover:scale-100 transition-transform">
                      <BookCard book={book} compact />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveToOther(book.id)}
                        className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600 text-xs"
                        title={moveLabel}
                      >
                        {activeTab === 'want' ? '✓' : '↩'}
                      </button>
                      <button
                        onClick={() => currentRemove(book.id)}
                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                        title="Remove from list"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingList;

