import React, { useState } from 'react';

const StatisticsSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('Central Limit Theorem');

  const topics = [
    {
      id: 'Central Limit Theorem',
      title: 'Central Limit Theorem',
      formula: 'σ_x̄ = σ/√n',
      description: 'States that the sampling distribution of the sample mean approaches a normal distribution as the sample size increases, regardless of the population distribution.',
      example: 'If we take samples of size n=30 from a population with mean μ=50 and σ=10, the standard error is σ_x̄ = 10/√30 ≈ 1.83. For 95% CI: 50 ± 1.96*1.83 → (46.42, 53.58)'
    },
    {
      id: 'Hypothesis Testing',
      title: 'Hypothesis Testing',
      formula: 'z = (x̄ - μ) / (σ/√n)',
      description: 'Process of making decisions about population parameters based on sample data. Involves null (H₀) and alternative (H₁) hypotheses.',
      example: 'Testing if coin is fair (p=0.5). Flip 100 times, get 60 heads. z = (0.6-0.5)/√(0.5*0.5/100) = 2.0. p-value ≈ 0.0455 < 0.05 → reject H₀.'
    },
    {
      id: 'Confidence Intervals',
      title: 'Confidence Intervals',
      formula: 'x̄ ± z*(σ/√n)',
      description: 'Range of values that likely contains the population parameter with a certain level of confidence.',
      example: 'Sample mean=75, σ=10, n=25, 95% CI: 75 ± 1.96*(10/√25) = 75 ± 3.92 → (71.08, 78.92)'
    },
    {
      id: 'Bayes Theorem',
      title: 'Bayes Theorem',
      formula: 'P(A|B) = [P(B|A) * P(A)] / P(B)',
      description: 'Updates the probability of a hypothesis as more evidence becomes available.',
      example: 'Disease test: 1% prevalence, 95% sensitivity, 5% false positive. P(Disease|Positive) = (0.95*0.01)/(0.95*0.01 + 0.05*0.99) ≈ 0.161'
    }
  ];

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Statistics & Probability</h2>
        <p className="text-gray-300 mb-6">Core concepts and formulas essential for data science interviews</p>
        
        <div className="space-y-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTopic === topic.id
                  ? 'bg-a855f7/20 border-a855f7 text-a855f7'
                  : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/40'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{topic.title}</span>
                <span className="text-sm text-gray-400">{activeTopic === topic.id ? '▼' : '▶'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {topics.map((topic) => (
        <div
          key={topic.id}
          className={`hidden ${activeTopic === topic.id ? 'block fade-in' : ''}`}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-a855f7 mb-4">{topic.title}</h3>
            <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
              <p className="font-mono text-a855f7 text-lg">{topic.formula}</p>
            </div>
            <p className="text-gray-300 mb-4">{topic.description}</p>
            <div className="bg-gray-900/30 p-4 rounded-lg border-l-4 border-a855f7/50">
              <p className="font-semibold text-gray-200 mb-2">Example:</p>
              <p className="text-gray-300">{topic.example}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatisticsSection;