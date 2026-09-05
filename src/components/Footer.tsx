import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50 mt-12 p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-gray-400">&copy; 2026 Data Science Interview Prep | v1.0.0</p>
          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-a855f7 transition-colors duration-200">
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-a855f7 transition-colors duration-200">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-a855f7 transition-colors duration-200">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;