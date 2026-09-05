import React, { useState } from 'react';

const SearchFilter: React.FC<{ onSearch: (term: string) => void }> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <div className="relative mt-16 mb-12">
      <div className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="relative">
          <label htmlFor="search-input" className="sr-only">Search all questions</label>
          <div className="relative">
            <input
              type="text"
              id="search-input"
              placeholder="Search all questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-lg"
            />
            <button 
              type="button"
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17.5 17.5a4 4 0 11-5.656-5.656"/>
              </svg>
            </button>
          </div>
          <button 
            type="submit"
            className="absolute right-0 top-0 mt-2 mr-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Search
          </button>
        </form>
        {searchTerm && (
          <p className="mt-3 text-center text-sm text-gray-400">
            Showing results for: "<span className="font-medium text-white">{searchTerm}</span>"
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;