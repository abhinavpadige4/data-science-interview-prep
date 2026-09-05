import React, { useState } from 'react';

const ProgressTracker: React.FC<{ 
  progress: number; 
  onProgressUpdate: (progress: number) => void 
}> = ({ progress, onProgressUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>(progress.toString());

  const handleSave = () => {
    const numValue = Math.max(0, Math.min(100, parseInt(editValue) || 0));
    setIsEditing(false);
    onProgressUpdate(numValue);
  };

  return (
    <div className="relative mt-16 mb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h12"/>
            </svg>
            Overall Progress
          </h2>
          {isEditing ? (
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditValue(progress.toString());
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        
        <div className="w-full bg-gray-800/50 rounded-lg h-4 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out w-${progress}%`}
          ></div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">{progress}%</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*$/.test(value)) {
                    setEditValue(value);
                  }
                }}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                className="w-20 px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-white text-center"
                minWidth="0"
              />
              <button 
                onClick={handleSave}
                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l rounded text-white transition-all duration-200"
              >
                Save
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                const newProgress = Math.min(100, progress + 10);
                onProgressUpdate(newProgress);
              }}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Complete Section
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;