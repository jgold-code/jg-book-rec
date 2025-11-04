import React from 'react';
import { BookDetails } from '../services/googleBooks';

interface BookCardProps {
  book: BookDetails;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
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
                {book.ratingsCount && ` (${book.ratingsCount})`}
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
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-4">
            {book.description.replace(/<[^>]*>/g, '')}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            {book.publishedDate && (
              <span>Published: {book.publishedDate.substring(0, 4)}</span>
            )}
            {book.pageCount && (
              <span>{book.pageCount} pages</span>
            )}
          </div>
          
          {book.previewLink && (
            <a
              href={book.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-indigo-50 text-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-100 transition-colors font-medium"
            >
              Preview on Google Books
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;

