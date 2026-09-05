import React, { useState } from 'react';

const systemDesignTopics = [
  {
    id: 'recommendation-system',
    title: 'Netflix-Style Recommendation System',
    description: 'Design a scalable recommendation system for personalized content suggestions',
    components: [
      {
        name: 'Data Ingestion',
        description: 'Collect user interactions (views, likes, watch time), content metadata, and contextual data',
        icon: '📥',
        details: [
          'Real-time streaming via Kafka/Kinesis',
          'Batch processing of historical data',
          'Schema validation and data quality checks'
        ]
      },
      {
        name: 'Feature Store',
        description: 'Centralized repository for engineered features used by models',
        icon: '🏪',
        details: [
          'User features: watch history, genre preferences, time-of-day patterns',
          'Content features: embeddings, popularity, freshness, genre tags',
          'Contextual features: device type, location, session context'
        ]
      },
      {
        name: 'Model Training',
        description: 'Hybrid approach combining collaborative filtering and content-based methods',
        icon: '🎯',
        details: [
          'Matrix factorization (SVD, ALS) for collaborative signals',
          'Deep learning models (DNN, CNN) for content understanding',
          'Hybrid models combining multiple approaches',
          'Regular retraining pipeline with A/B testing'
        ]
      },
      {
        name: 'Serving Layer',
        description: 'Low-latency API for generating real-time recommendations',
        icon: '🚀',
        details: [
          'Online feature retrieval from feature store',
          'Model inference with caching (Redis)',
          'Diversity and business rule filtering',
          'Fallback to popular/new content when needed'
        ]
      }
    ]
  },
  {
    id: 'ml-pipeline',
    title: 'End-to-End ML Pipeline',
    description: 'Design a robust ML pipeline for model development, deployment, and monitoring',
    components: [
      {
        name: 'Data Pipeline',
        description: 'Ingest, clean, and transform raw data into training-ready format',
        icon: '📊',
        details: [
          'ETL/ELT processes with Airflow/Prefect',
          'Data validation and quality monitoring',
          'Feature engineering and selection'
        ]
      },
      {
        name: 'Model Development',
        description: 'Experiment tracking and model iteration',
        icon: '🔬',
        details: [
          'Experiment tracking with MLflow/Weights & Biases',
          'Hyperparameter tuning (Optuna, Ray Tune)',
          'Model versioning and registry'
        ]
      },
      {
        name: 'Deployment',
        description: 'Deploy models to production with rollback capability',
        icon: '🚀',
        details: [
          'Containerization with Docker',
          'Orchestration with Kubernetes',
          'Blue-green or canary deployments',
          'A/B testing framework'
        ]
      },
      {
        name: 'Monitoring & Maintenance',
        description: 'Track model performance and data drift',
        icon: '📈',
        details: [
          'Prediction and feature distribution monitoring',
          'Data drift and concept drift detection',
          'Automated retraining triggers',
          'Performance dashboards and alerts'
        ]
      }
    ]
  }
];

const SystemDesign: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('recommendation-system');

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">System Design for ML</h2>
        <p className="text-gray-300 mb-6">Architect scalable ML systems for production environments</p>
        
        <div className="flex gap-4 mb-6">
          {systemDesignTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTopic === topic.id
                  ? 'bg-a855f7/20 border-a855f7 text-a855f7'
                  : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/40 text-gray-300'
              }`}
            >
              {topic.title}
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
            
            <div className="space-y-6">
              {topic.components.map((component) => (
                <div key={component.name} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">{component.icon}</span>
                    <div>
                      <h4 className="font-bold text-a855f7">{component.name}</h4>
                      <p className="text-gray-300">{component.description}</p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    {component.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SystemDesign;