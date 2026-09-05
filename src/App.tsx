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

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('Python');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('dsPrepProgress');
    if (savedProgress !== null) {
      setProgress(parseInt(savedProgress, 10));
    }
  }, []);

  // Save progress to localStorage on change
  useEffect(() => {
    localStorage.setItem('dsPrepProgress', progress.toString());
  }, [progress]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans antialiased">
      <HeroSection />
      <SearchFilter onSearch={handleSearch} />
      <ProgressTracker progress={progress} onProgressUpdate={handleProgressUpdate} />
      <SectionTabs 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {searchTerm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Showing results for: "<span className="font-medium">{searchTerm}</span>"</p>
          </div>
        )}
        <div className="space-y-8">
          {activeSection === 'Python' && <PythonChallenges 
            searchTerm={searchTerm} 
            onProgressUpdate={handleProgressUpdate} 
          />}
          {activeSection === 'Statistics' && <StatisticsSection 
            searchTerm={searchTerm} 
            onProgressUpdate={handleProgressUpdate} 
          />}
          {activeSection === 'ML' && <MLQuestions 
            searchTerm={searchTerm} 
            onProgressUpdate={handleProgressUpdate} 
          />}
          {activeSection === 'SQL' && <SQLQueries 
            searchTerm={searchTerm} 
            onProgressUpdate={handleProgressUpdate} 
          />}
          {activeSection === 'SystemDesign' && <SystemDesign 
            searchTerm={searchTerm} 
            onProgressUpdate={handleProgressUpdate} 
          />}
          {activeSection === 'Behavioral' && <Behavioral 
            searchTerm={searchTerm} 
            onProgressUpdate={handleProgressUpdate} 
          />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;