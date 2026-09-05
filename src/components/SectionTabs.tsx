import React from 'react';

const SectionTabs: React.FC<{ 
  activeSection: string; 
  onSectionChange: (section: string) => void 
}> = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'Python', label: 'Python Coding' },
    { id: 'Statistics', label: 'Statistics' },
    { id: 'ML', label: 'ML Questions' },
    { id: 'SQL', label: 'SQL Queries' },
    { id: 'SystemDesign', label: 'System Design' },
    { id: 'Behavioral', label: 'Behavioral' }
  ];

  return (
    <nav className="relative mt-16 mb-12" id="section-tabs">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex-1 min-w-[100px] px-4 py-3 text-center text-sm font-medium 
                ${activeSection === section.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'}
                transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                rounded-lg border border-transparent
                ${activeSection === section.id ? 'border-purple-500/20' : 'border-gray-700'}
              `}
            >
              {section.label}
            </button>
          ))}
        </div>
        
        <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-4"></div>
      </div>
    </nav>
  );
};

export default SectionTabs;