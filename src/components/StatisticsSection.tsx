import React, { useState } from 'react';

const StatisticsSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('Central Limit Theorem');

  const topics = [
    {
      id: 'Central Limit Theorem',
      title: 'Central Limit Theorem',
      formula: 'σ_x̄ = σ/√n',
      description: 'States that the sampling distribution of the sample mean approaches a normal distribution as the sample size increases, regardless of the population distribution.',
      example: 'If we take samples of size n=30 from a population with μ=50 and σ=10, the standard error is 10/√30 ≈ 1.83. The sample means will be normally distributed around 50 with SE=1.83.',
      keyPoints: [
        'Sample size n ≥ 30 is typically sufficient',
        'Mean of sampling distribution = population mean',
        'Standard error decreases with √n'
      ]
    },
    {
      id: 'Hypothesis Testing',
      title: 'Hypothesis Testing',
      formula: 'z = (x̄ - μ) / (σ/√n)',
      description: 'Statistical method to make decisions about population parameters based on sample data.',
      example: 'Testing if a new drug reduces blood pressure: H₀: μ = 120 (no effect), H₁: μ < 120 (reduces BP). With x̄=115, σ=15, n=100 → z = (115-120)/(15/√100) = -3.33 → p < 0.001 → reject H₀.',
      keyPoints: [
        'Null hypothesis (H₀): status quo',
        'Alternative hypothesis (H₁): claim to test',
        'p-value < α (usually 0.05) → reject H₀',
        'Type I error: false positive, Type II: false negative'
      ]
    },
    {
      id: 'Confidence Intervals',
      title: 'Confidence Intervals',
      formula: 'x̄ ± z*(σ/√n)',
      description: 'Range of values that likely contains the population parameter with a certain confidence level.',
      example: '95% CI for mean height: x̄=170cm, σ=10cm, n=100 → 170 ± 1.96*(10/√100) = 170 ± 1.96 → [168.04, 171.96]',
      keyPoints: [
        'Higher confidence → wider interval',
        'Larger n → narrower interval',
        '95% CI uses z*=1.96 for large n'
      ]
    },
    {
      id: 'Bayes Theorem',
      title: 'Bayes Theorem',
      formula: 'P(A|B) = [P(B|A) * P(A)] / P(B)',
      description: 'Updates the probability of a hypothesis as more evidence becomes available.',
      example: 'Medical test: Disease prevalence P(D)=0.01, Test sensitivity P(T+|D)=0.95, Specificity P(T-|¬D)=0.90 → P(D|T+) = (0.95*0.01)/[(0.95*0.01)+(0.10*0.99)] ≈ 0.0876 → 8.76%',
      keyPoints: [
        'Prior probability P(A)',
        'Likelihood P(B|A)',
        'Marginal likelihood P(B)',
        'Posterior P(A|B)'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Statistics & Probability</h2>
        <div className="space-y-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                activeTopic === topic.id
                  ? 'bg-a855f7/20 border-a855f7/50 text-a855f7'
                  : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
              }`}
              onClick={() => setActiveTopic(topic.id)}
            >
              <h3 className="font-semibold text-lg">{topic.title}</h3>
              <p className="text-sm text-gray-400">{topic.formula}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-bold text-a855f7 mb-4">{activeTopic}</h3>
        <p className="text-gray-300 mb-4">{topics.find(t => t.id === activeTopic)?.description || ''}</p>
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <p className="font-mono text-sm text-gray-200"><strong>Formula:</strong> {topics.find(t => t.id === activeTopic)?.formula || ''}</p>
        </div>
        <div className="space-y-3">
          <p className="text-gray-300"><strong>Example:</strong> {topics.find(t => t.id === activeTopic)?.example || ''}</p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {topics.find(t => t.id === activeTopic)?.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            )) || []}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;