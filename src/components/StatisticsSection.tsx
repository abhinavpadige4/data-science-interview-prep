import React, { useState } from 'react';

const StatisticsSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('Central Limit Theorem');

  const topics = [
    {
      id: 'Central Limit Theorem',
      title: 'Central Limit Theorem',
      formula: 'σ_x̄ = σ/√n',
      description: 'States that the sampling distribution of the sample mean approaches a normal distribution as the sample size increases, regardless of the population distribution.',
      example: 'If we take samples of size n=30 from a population with mean μ=50 and σ=10, the standard error is σ_x̄ = 10/√30 ≈ 1.83. For 95% confidence, margin of error ≈ 1.96 * 1.83 ≈ 3.58.',
      whenToUse: 'Use when making inferences about population means from sample data, especially with n ≥ 30.',
      keyPoints: [
        'Sample size n ≥ 30 is typically sufficient',
        'Mean of sampling distribution = population mean μ',
        'Standard error decreases as sample size increases'
      ]
    },
    {
      id: 'Hypothesis Testing',
      title: 'Hypothesis Testing',
      formula: 'z = (x̄ - μ) / (σ/√n)',
      description: 'A method to test claims about population parameters using sample data.',
      example: 'Testing if a new drug lowers blood pressure: H₀: μ = 120 (no effect), H₁: μ < 120 (lowers BP). With x̄=115, σ=15, n=100 → z = (115-120)/(15/√100) = -3.33. p-value ≈ 0.0004 < 0.05 → reject H₀.',
      whenToUse: 'Use when you have a claim about a population parameter and want to assess evidence against it.',
      keyPoints: [
        'Always state H₀ and H₁ clearly',
        'Choose α (significance level) before testing',
        'p-value < α → reject H₀; else fail to reject H₀'
      ]
    },
    {
      id: 'Confidence Intervals',
      title: 'Confidence Intervals',
      formula: 'x̄ ± z*(σ/√n)',
      description: 'A range of values that likely contains the population parameter with a certain level of confidence.',
      example: 'For sample mean x̄=75, σ=10, n=25, 95% CI: 75 ± 1.96*(10/√25) = 75 ± 3.92 → (71.08, 78.92).',
      whenToUse: 'Use when estimating population parameters from sample data and want to express uncertainty.',
      keyPoints: [
        'Higher confidence → wider interval',
        'Larger sample size → narrower interval',
        'Interpretation: 95% of CIs from repeated samples would contain true parameter'
      ]
    },
    {
      id: 'P-Value',
      title: 'P-Value',
      formula: 'P = P(observed or more extreme | H₀ true)',
      description: 'The probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.',
      example: 'In a coin flip test (H₀: p=0.5), getting 18 heads in 20 flips: p-value = P(X≥18) + P(X≤2) ≈ 0.0004 (two-tailed).',
      whenToUse: 'Use to quantify the strength of evidence against the null hypothesis.',
      keyPoints: [
        'Small p-value (≤ 0.05) indicates strong evidence against H₀',
        'Not the probability that H₀ is true',
        'Depends on sample size and effect size'
      ]
    },
    {
      id: 'Type I & II Errors',
      title: 'Type I & Type II Errors',
      formula: 'α = P(Type I), β = P(Type II), Power = 1-β',
      description: 'Type I: rejecting true H₀ (false positive). Type II: failing to reject false H₀ (false negative).',
      example: 'Medical test: Type I = healthy person diagnosed sick (α). Type II = sick person declared healthy (β). Power = probability of correctly detecting disease.',
      whenToUse: 'Use when designing tests to balance risks of false positives and false negatives.',
      keyPoints: [
        'α is controlled by researcher (typically 0.05)',
        'β decreases as sample size or effect size increases',
        'Power > 0.8 is generally desired'
      ]
    }
  ];

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Statistics and Probability</h2>
        <p className="text-gray-300 mb-6">Master core statistical concepts essential for data science interviews.</p>
        
        <div className="space-y-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTopic === topic.id
                  ? 'bg-a855f7/20 border border-a855f7/50 text-a855f7'
                  : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/40'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{topic.title}</h3>
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
            
            <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
              <p className="font-mono text-sm text-gray-200"><strong>Formula:</strong> {topic.formula}</p>
            </div>
            
            <p className="text-gray-300 mb-4"><strong>Description:</strong> {topic.description}</p>
            
            <p className="text-gray-300 mb-4"><strong>Example:</strong> {topic.example}</p>
            
            <p className="text-gray-300 mb-4"><strong>When to Use:</strong> {topic.whenToUse}</p>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-200 mb-2">Key Points:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {topic.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatisticsSection;