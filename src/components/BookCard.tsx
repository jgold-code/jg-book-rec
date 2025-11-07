import React from 'react';
import { BookRecommendation } from '../services/openai';

interface BookCardProps {
  book: BookRecommendation;
  onAddToWantToRead?: () => void;
  onAddToAlreadyRead?: () => void;
  isInWantToRead?: boolean;
  isInAlreadyRead?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onAddToWantToRead, 
  onAddToAlreadyRead,
  isInWantToRead = false,
  isInAlreadyRead = false 
}) => {
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">⯨</span>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 bg-gray-100 flex items-center justify-center p-4">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="h-64 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/128x192?text=No+Cover';
            }}
          />
        </div>
        
        <div className="flex-grow p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>
          
          <p className="text-gray-700 font-medium mb-3">
            by {book.authors.join(', ')}
          </p>
          
          {book.averageRating && (
            <div className="flex items-center mb-3">
              <div className="flex text-lg">
                {renderStars(book.averageRating)}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {book.averageRating.toFixed(1)}
              </span>
            </div>
          )}
          
          {book.categories && book.categories.length > 0 && (
            <div className="mb-3">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                {book.categories[0]}
              </span>
            </div>
          )}
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {book.description.replace(/<[^>]*>/g, '')}
          </p>
          
          {book.reason && (
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-3 mb-3">
              <p className="text-sm text-indigo-900">
                <span className="font-semibold">Why this book: </span>
                {book.reason}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            {book.publishedDate && (
              <span>Published: {book.publishedDate.substring(0, 4)}</span>
            )}
            {book.pageCount && (
              <span>{book.pageCount} pages</span>
            )}
          </div>

          {/* Buy/Find Links */}
          <div className="mb-3">
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.authors[0])}&i=stripbooks`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-orange-500 text-white py-2 px-2 rounded-md hover:bg-orange-600 transition-colors text-xs font-medium"
              >
                <span>📦</span>
                <span>Amazon</span>
              </a>
              <a
                href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.authors[0])}&i=digital-text`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
              >
                <span>📱</span>
                <span>Kindle</span>
              </a>
              <a
                href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.title + ' ' + book.authors[0])}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-amber-600 text-white py-2 px-2 rounded-md hover:bg-amber-700 transition-colors text-xs font-medium"
              >
                <span>⭐</span>
                <span>Goodreads</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          {(onAddToWantToRead || onAddToAlreadyRead) && (
            <div className="space-y-2">
              {onAddToWantToRead && (
                <button
                  onClick={onAddToWantToRead}
                  disabled={isInWantToRead || isInAlreadyRead}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors text-sm ${
                    isInWantToRead || isInAlreadyRead
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isInWantToRead ? '✓ In Want to Read' : isInAlreadyRead ? '✓ Already Read' : '+ Want to Read'}
                </button>
              )}
              
              {onAddToAlreadyRead && (
                <button
                  onClick={onAddToAlreadyRead}
                  disabled={isInWantToRead || isInAlreadyRead}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors text-sm ${
                    isInWantToRead || isInAlreadyRead
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isInAlreadyRead ? '✓ In Already Read' : isInWantToRead ? '✓ In Want to Read' : '✓ Mark as Read'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;

