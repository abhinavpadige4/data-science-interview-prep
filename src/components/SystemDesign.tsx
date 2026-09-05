import React, { useState } from 'react';

const systemDesignTopics = [
  {
    id: 'recommendation-system',
    title: 'Recommendation System (Netflix-style)',
    description: 'Design a scalable recommendation system for personalized content suggestions.',
    components: [
      { name: 'Data Ingestion', description: 'Collect user interactions (views, likes, watch time), content metadata, and contextual data.' },
      { name: 'Feature Store', description: 'Store and manage user features (demographics, behavior), content features (genre, cast, embeddings), and interaction features.' },
      { name: 'Model Training', description: 'Train collaborative filtering, content-based, and hybrid models using matrix factorization, deep learning, or graph-based approaches.' },
      { name: 'Serving', description: 'Deploy models to generate real-time recommendations with low latency using caching and approximate nearest neighbor search.' }
    ],
    considerations: [
      'Handle cold start problem for new users and content',
      'Balance exploration vs exploitation (bandit algorithms)',
      'Ensure diversity and novelty in recommendations',
      'Monitor for feedback loops and bias amplification',
      'Scale to millions of users and items with sub-second latency'
    ]
  },
  {
    id: 'ml-pipeline',
    title: 'End-to-End ML Pipeline',
    description: 'Design a robust, automated machine learning pipeline for model development and deployment.',
    components: [
      { name: 'Data Collection & Validation', description: 'Ingest raw data from various sources, validate quality, and store in data lake/warehouse.' },
      { name: 'Feature Engineering', description: 'Transform raw data into meaningful features using batch and streaming processing.' },
      { name: 'Model Training & Experimentation', description: 'Train models, track experiments (metrics, parameters), and select best performers.' },
      { name: 'Model Validation & Testing', description: 'Rigorously test models on holdout data, check for bias, and validate business impact.' },
      { name: 'Model Deployment & Monitoring', description: 'Deploy to production, monitor performance, data drift, and trigger retraining when needed.' }
    ],
    considerations: [
      'Implement version control for data, features, and models',
      'Use CI/CD for automated testing and deployment',
      'Ensure reproducibility and auditability',
      'Handle concept drift and data quality issues',
      'Provide rollback mechanisms and A/B testing framework'
    ]
  },
  {
    id: 'real-time-prediction',
    title: 'Real-Time Prediction Service',
    description: 'Design a low-latency service for real-time ML predictions (e.g., fraud detection, click-through rate).',
    components: [
      { name: 'Input Processing', description: 'Receive and validate incoming requests, extract features, and handle missing data.' },
      { name: 'Feature Retrieval', description: 'Fetch precomputed features from cache or feature store with low latency.' },
      { name: 'Model Inference', description: 'Run the ML model to generate predictions with optimized latency.' },
      { name: 'Post-processing & Response', description: 'Apply business rules, format response, and return to caller.' }
    ],
    considerations: [
      'Achieve sub-100ms latency for high-throughput scenarios',
      'Implement caching layers for frequently accessed features',
      'Use model optimization techniques (quantization, pruning, distillation)',
      'Implement circuit breakers and fallback mechanisms',
      'Monitor latency, error rates, and prediction distributions'
    ]
  }
];

const SystemDesign: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('recommendation-system');

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">System Design for ML</h2>
        <p className="text-gray-300 mb-6">Learn to design scalable ML systems for real-world applications.</p>
        
        <div className="space-y-4">
          {systemDesignTopics.map((topic) => (
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

      {systemDesignTopics.map((topic) => (
        <div
          key={topic.id}
          className={`hidden ${activeTopic === topic.id ? 'block fade-in' : ''}`}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-a855f7 mb-4">{topic.title}</h3>
            <p className="text-gray-300 mb-6">{topic.description}</p>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-200 mb-2">Key Components:</h4>
              <div className="space-y-3">
                {topic.components.map((component, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 h-3 w-3 bg-a855f7 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-200">{component.name}</h4>
                      <p className="text-gray-400 text-sm">{component.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-200 mb-2">Key Considerations:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {topic.considerations.map((consideration, index) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SystemDesign;