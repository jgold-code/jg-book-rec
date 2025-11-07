import React, { useState } from 'react';
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

type Tab = 'want' | 'read';

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('want');

  const totalBooks = wantToRead.length + alreadyRead.length;

  if (totalBooks === 0) {
    return null;
  }

  const currentList = activeTab === 'want' ? wantToRead : alreadyRead;
  const currentCount = activeTab === 'want' ? wantToRead.length : alreadyRead.length;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 font-semibold z-40"
      >
        📚 My Books ({totalBooks})
      </button>

      {/* Sliding Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">My Reading Lists</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('want')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'want'
                      ? 'bg-white text-indigo-600'
                      : 'bg-indigo-500 text-white hover:bg-indigo-400'
                  }`}
                >
                  Want to Read ({wantToRead.length})
                </button>
                <button
                  onClick={() => setActiveTab('read')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'read'
                      ? 'bg-white text-indigo-600'
                      : 'bg-indigo-500 text-white hover:bg-indigo-400'
                  }`}
                >
                  Already Read ({alreadyRead.length})
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentCount === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">
                    {activeTab === 'want'
                      ? 'No books in your "Want to Read" list yet.'
                      : 'No books in your "Already Read" list yet.'}
                  </p>
                  <p className="text-sm mt-2">
                    Add books from your recommendations!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600">
                      {currentCount} {currentCount === 1 ? 'book' : 'books'}
                    </p>
                    <button
                      onClick={activeTab === 'want' ? onClearWant : onClearRead}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentList.map((book) => (
                      <div
                        key={book.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex gap-4">
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="h-32 w-auto object-contain flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/128x192?text=No+Cover';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-700 mb-2">
                              by {book.authors.join(', ')}
                            </p>
                            {book.categories && book.categories.length > 0 && (
                              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-2">
                                {book.categories[0]}
                              </span>
                            )}
                            <div className="flex gap-2 mt-3">
                              {activeTab === 'want' ? (
                                <>
                                  <button
                                    onClick={() => onMoveToRead(book.id)}
                                    className="flex-1 text-sm bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors"
                                  >
                                    ✓ Mark as Read
                                  </button>
                                  <button
                                    onClick={() => onRemoveWant(book.id)}
                                    className="text-sm bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => onMoveToWant(book.id)}
                                    className="flex-1 text-sm bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 transition-colors"
                                  >
                                    ↩ Move to Want to Read
                                  </button>
                                  <button
                                    onClick={() => onRemoveRead(book.id)}
                                    className="text-sm bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReadingList;

