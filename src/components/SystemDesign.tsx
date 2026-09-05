import React, { useState } from 'react';

const SystemDesign: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('Data Ingestion');

  const components = [
    {
      id: 'Data Ingestion',
      title: 'Data Ingestion',
      description: 'Collect raw user interaction data from various sources.',
      details: [
        'Event tracking via SDKs (web, mobile, TV)',
        'Real-time streaming with Kafka/Kinesis',
        'Batch processing for historical data',
        'Schema validation and data quality checks'
      ],
      tech: ['Kafka', 'Kinesis', 'S3', 'Flume'],
      challenges: ['Handling late-arriving events', 'Ensuring exactly-once delivery', 'Scaling to millions of events/sec']
    },
    {
      id: 'Feature Store',
      title: 'Feature Store',
      description: 'Centralized repository for ML features.',
      details: [
        'Pre-computed features for training and serving',
        'Point-in-time correctness for training',
        'Low-latency retrieval for online serving',
        'Feature versioning and lineage tracking'
      ],
      tech: ['Feast', 'Tecton', 'Redis', 'BigQuery'],
      challenges: ['Feature drift detection', 'Balancing freshness vs latency', 'Managing feature dependencies']
    },
    {
      id: 'Model Training',
      title: 'Model Training',
      description: 'Train recommendation models using historical data.',
      details: [
        'Matrix factorization for collaborative filtering',
        'Deep learning models (DNN, CNN, RNN) for sequential behavior',
        'Hybrid approaches combining content and collaborative signals',
        'Distributed training on GPU clusters'
      ],
      tech: ['TensorFlow', 'PyTorch', 'Spark MLlib', 'Kubeflow'],
      challenges: ['Cold start problem', 'Scalability with large catalogs', 'Balancing exploration vs exploitation']
    },
    {
      id: 'Serving',
      title: 'Serving',
      description: 'Generate real-time recommendations for users.',
      details: [
        'Online feature retrieval from feature store',
        'Model inference with low latency (<100ms)',
        'Ranking and diversification of results',
        'A/B testing framework for model evaluation'
      ],
      tech: ['TensorFlow Serving', 'TorchServe', 'Kubernetes', 'Envoy'],
      challenges: ['Meeting latency SLAs', 'Handling traffic spikes', 'Ensuring freshness of recommendations']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">System Design for ML</h2>
        <p className="text-gray-400 mb-4">Design a recommendation system for Netflix-scale platform</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {components.map((component) => (
            <div
              key={component.id}
              className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                activeComponent === component.id
                  ? 'bg-a855f7/20 border-a855f7/50'
                  : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
              }`}
              onClick={() => setActiveComponent(component.id)}
            >
              <h3 className="font-semibold text-lg mb-2">{component.title}</h3>
              <p className="text-sm text-gray-400">{component.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-bold text-a855f7 mb-4">{activeComponent}</h3>
        <p className="text-gray-300 mb-4">{components.find(c => c.id === activeComponent)?.description || ''}</p>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-300 mb-1">Key Details:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {(components.find(c => c.id === activeComponent)?.details || []).map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-gray-300 mb-1">Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {(components.find(c => c.id === activeComponent)?.tech || []).map((tech, index) => (
                <span key={index} className="bg-gray-900/50 px-3 py-1 rounded text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <p className="font-semibold text-gray-300 mb-1">Challenges:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {(components.find(c => c.id === activeComponent)?.challenges || []).map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDesign;