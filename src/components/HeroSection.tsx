import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-purple-900/80 via-black/90 to-purple-900/80 py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-[400px] h-[400px] bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse" 
          style={{ left: '50%', top: '30%' }}></div>
        <div className="w-[300px] h-[300px] bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-pink-500/10 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse delay-150" 
          style={{ left: '70%', top: '20%' }}></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          Data Science Interview Prep
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          Master Python, Stats, ML, SQL, System Design & Behavioral Questions
        </p>
        <button 
          onClick={() => window.scrollTo({ top: document.getElementById('section-tabs')?.offsetTop || 0, behavior: 'smooth' })}
          className="mt-10 inline-flex items-center px-8 py-4 text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30"
        >
          Start Practicing
          <svg className="ml-3 w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;