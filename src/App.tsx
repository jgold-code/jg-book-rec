import { useState } from 'react';
import PreferenceForm from './components/PreferenceForm';
import BookRecommendations from './components/BookRecommendations';
import LoadingSpinner from './components/LoadingSpinner';
import ReadingList from './components/ReadingList';
import { getBookRecommendations, BookRecommendation } from './services/openai';
import { useReadingList } from './hooks/useReadingList';

function App() {
  const [books, setBooks] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPreferences, setLastPreferences] = useState<string>('');
  
  const {
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
    clearWantToRead,
    clearAlreadyRead,
  } = useReadingList();

  const handleGetRecommendations = async (preferences: string) => {
    setIsLoading(true);
    setError(null);
    setBooks([]);
    setLastPreferences(preferences);

    try {
      // Get recommendations from OpenAI with full book details
      const recommendations = await getBookRecommendations(preferences);
      
      if (recommendations.length === 0) {
        setError('No recommendations found. Please try different preferences.');
        return;
      }

      setBooks(recommendations);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      
      if (err instanceof Error) {
        if (err.message.includes('OpenAI API key')) {
          setError('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
        } else {
          setError(err.message || 'An error occurred while getting recommendations. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMoreBooks = async () => {
    if (!lastPreferences) return;
    
    setIsLoadingMore(true);
    setError(null);

    try {
      const recommendations = await getBookRecommendations(lastPreferences);
      
      if (recommendations.length === 0) {
        setError('No more recommendations found.');
        return;
      }

      // Append new books to existing ones
      setBooks(prev => [...prev, ...recommendations]);
    } catch (err) {
      console.error('Error getting more recommendations:', err);
      
      if (err instanceof Error) {
        setError(err.message || 'An error occurred while getting more recommendations.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleMarkAsRead = async (book: BookRecommendation) => {
    // Add to already read list
    addToAlreadyRead(book);
    
    // Remove from display
    setBooks(prev => prev.filter(b => b.id !== book.id));
    
    // Fetch a replacement book
    if (lastPreferences) {
      try {
        const recommendations = await getBookRecommendations(lastPreferences);
        if (recommendations.length > 0) {
          // Add just the first new book as a replacement
          setBooks(prev => [...prev, recommendations[0]]);
        }
      } catch (err) {
        console.error('Error fetching replacement book:', err);
        // Silent fail - don't show error for replacement
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📚 ShelfAware
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next favorite book with AI-powered recommendations
            tailored to your unique reading preferences.
          </p>
        </div>

        {/* Preference Form */}
        <PreferenceForm onSubmit={handleGetRecommendations} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Book Recommendations */}
        {!isLoading && books.length > 0 && (
          <>
            <div className="max-w-7xl mx-auto mt-8 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-gray-900">
                  Your Recommendations
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {books.length} books
                </span>
              </div>
              <button
                onClick={handleGetMoreBooks}
                disabled={isLoadingMore}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Get 10 More Books</span>
                  </>
                )}
              </button>
            </div>
            <BookRecommendations 
              books={books}
              onAddToWantToRead={addToWantToRead}
              onAddToAlreadyRead={handleMarkAsRead}
              isInWantToRead={isInWantToRead}
              isInAlreadyRead={isInAlreadyRead}
            />
          </>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>Powered by OpenAI GPT-4o</p>
        </footer>
      </div>

      {/* Floating Reading List */}
      <ReadingList
        wantToRead={wantToRead}
        alreadyRead={alreadyRead}
        onRemoveWant={removeFromWantToRead}
        onRemoveRead={removeFromAlreadyRead}
        onMoveToRead={moveToAlreadyRead}
        onMoveToWant={moveToWantToRead}
        onClearWant={clearWantToRead}
        onClearRead={clearAlreadyRead}
      />
    </div>
  );
}

export default App;

