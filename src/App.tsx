import { useState } from 'react';
import PreferenceForm from './components/PreferenceForm';
import BookRecommendations from './components/BookRecommendations';
import LoadingSpinner from './components/LoadingSpinner';
import { getBookRecommendations, BookRecommendation } from './services/openai';

function App() {
  const [books, setBooks] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async (preferences: string) => {
    setIsLoading(true);
    setError(null);
    setBooks([]);

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
        {!isLoading && books.length > 0 && <BookRecommendations books={books} />}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>Powered by OpenAI GPT-4o</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

