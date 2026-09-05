import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import SearchFilter from './components/SearchFilter';
import ProgressTracker from './components/ProgressTracker';
import SectionTabs from './components/SectionTabs';
import PythonChallenges from './components/PythonChallenges';
import StatisticsSection from './components/StatisticsSection';
import MLQuestions from './components/MLQuestions';
import SQLQueries from './components/SQLQueries';
import SystemDesign from './components/SystemDesign';
import Behavioral from './components/Behavioral';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('Python');
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('dsPrepProgress');
    if (savedProgress !== null) {
      setProgress(parseInt(savedProgress, 10));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dsPrepProgress', progress.toString());
  }, [progress]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans antialiased">
      <HeroSection />
      <SearchFilter onSearchChange={handleSearchChange} />
      <ProgressTracker progress={progress} onProgressUpdate={handleProgressUpdate} />
      <SectionTabs 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {searchTerm && (
          <div className="mb-4 bg-gray-800/50 rounded-lg p-3 text-sm">
            Showing results for: "<span className="text-a855f7">{searchTerm}</span>"
          </div>
        )}
        <div className="space-y-8">
          {activeSection === 'Python' && <PythonChallenges onProgressUpdate={handleProgressUpdate} />}
          {activeSection === 'Statistics' && <StatisticsSection onProgressUpdate={handleProgressUpdate} />}
          {activeSection === 'ML' && <MLQuestions onProgressUpdate={handleProgressUpdate} />}
          {activeSection === 'SQL' && <SQLQueries onProgressUpdate={handleProgressUpdate} />}
          {activeSection === 'SystemDesign' && <SystemDesign onProgressUpdate={handleProgressUpdate} />}
          {activeSection === 'Behavioral' && <Behavioral onProgressUpdate={handleProgressUpdate} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;