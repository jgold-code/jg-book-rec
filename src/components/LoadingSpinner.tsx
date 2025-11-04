import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      <p className="mt-4 text-gray-600 text-lg">Finding perfect books for you...</p>
    </div>
  );
};

export default LoadingSpinner;

