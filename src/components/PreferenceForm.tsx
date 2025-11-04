import React, { useState } from 'react';

interface PreferenceFormProps {
  onSubmit: (preferences: string) => void;
  isLoading: boolean;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, isLoading }) => {
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.trim()) {
      onSubmit(preferences);
    }
  };

  const examplePreferences = [
    "I love fantasy with strong female leads and complex magic systems",
    "Looking for thought-provoking science fiction about AI and consciousness",
    "Historical fiction set in World War II with compelling characters",
    "Mystery thrillers with unexpected plot twists",
    "Non-fiction books about psychology and human behavior"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="preferences"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            What kind of books are you looking for?
          </label>
          <textarea
            id="preferences"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Describe your reading preferences, favorite genres, authors, themes, or moods..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !preferences.trim()}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Finding Books...' : 'Get Recommendations'}
        </button>
      </form>

      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
        <div className="space-y-2">
          {examplePreferences.map((example, index) => (
            <button
              key={index}
              onClick={() => setPreferences(example)}
              disabled={isLoading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferenceForm;

