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
  const [activeTab, setActiveTab] = useState('Python');
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Simulate progress update (in real app, this would be based on completed items)
  const updateProgress = () => {
    setProgress(Math.min(progress + 5, 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans antialiased">
      <HeroSection />
      <SearchFilter onSearch={handleSearch} query={searchQuery} />
      <ProgressTracker progress={progress} onUpdateProgress={updateProgress} />
      <SectionTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'Python' && <PythonChallenges searchQuery={searchQuery} />}
        {activeTab === 'Statistics' && <StatisticsSection searchQuery={searchQuery} />}
        {activeTab === 'ML' && <MLQuestions searchQuery={searchQuery} />}
        {activeTab === 'SQL' && <SQLQueries searchQuery={searchQuery} />}
        {activeTab === 'SystemDesign' && <SystemDesign searchQuery={searchQuery} />}
        {activeTab === 'Behavioral' && <Behavioral searchQuery={searchQuery} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;