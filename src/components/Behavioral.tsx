import React, { useState } from 'react';

const Behavioral: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<string>('Tell me about a time you failed.');
  const [showSTAR, setShowSTAR] = useState<boolean>(false);

  const questions = [
    {
      id: 'Tell me about a time you failed.',
      question: 'Tell me about a time you failed.',
      star: {
        situation: 'In my previous role as a data scientist at XYZ Corp, I was tasked with building a churn prediction model for our subscription service within a tight 4-week deadline.',
        task: 'I needed to deliver a production-ready model with >85% accuracy to help the marketing team target at-risk customers.',
        action: 'I rushed the feature engineering process, used only basic demographic features, and skipped proper validation. I deployed the model after just 2 weeks, but it performed poorly in production with only 60% accuracy.',
        result: 'The model failed to identify true churn risks, leading to wasted marketing spend. I learned to always allocate time for proper EDA, feature importance analysis, and cross-validation. I now advocate for realistic timelines and use MLOps practices for reliable deployment.'
      }
    },
    {
      id: 'Tell me about a time you had to learn a new technology quickly.',
      question: 'Tell me about a time you had to learn a new technology quickly.',
      star: {
        situation: 'Our team decided to migrate from Python-based batch processing to Apache Spark for real-time analytics, but I had no prior experience with Spark.',
        task: 'I needed to become proficient in Spark within two weeks to contribute to the migration project and rewrite our ETL pipelines.',
        action: 'I completed the Databricks Spark certification course, built small proof-of-concept projects with sample data, pair-programmed with a senior engineer, and contributed to non-critical pipelines first.',
        result: 'Within three weeks, I was able to rewrite our main ETL pipeline in Spark, improving processing time by 70%. The migration was completed on schedule, and I became the go-to person for Spark questions on the team.'
      }
    },
    {
      id: 'Describe a situation where you had to work with a difficult team member.',
      question: 'Describe a situation where you had to work with a difficult team member.',
      star: {
        situation: 'I was working on a cross-functional project with a senior data engineer who was resistant to adopting new ML practices and preferred traditional SQL-based approaches.',
        task: 'I needed to collaborate effectively to integrate ML features into our data pipeline without causing conflict or delaying the project.',
        action: 'I scheduled a one-on-one meeting to understand their concerns, demonstrated how ML features could improve their existing workflows, started with small incremental changes, and gave them ownership over the validation process.',
        result: 'The engineer became an advocate for the ML integration, we successfully deployed the enhanced pipeline, and our collaboration improved significantly. This taught me the importance of empathy and finding common ground in technical disagreements.'
      }
    },
    {
      id: 'Tell me about a time you had to meet a tight deadline.',
      question: 'Tell me about a time you had to meet a tight deadline.',
      star: {
        situation: 'Our marketing team needed customer segmentation insights for a campaign launching in just 5 days, but the data was scattered across multiple systems.',
        task: 'I had to extract, clean, and analyze customer data from 3 different sources, build segmentation models, and deliver actionable insights within the 5-day window.',
        action: 'I prioritized the most critical data sources, used automated data profiling tools to quickly assess quality, built a simple but effective RFM segmentation model, and delivered daily progress updates to stakeholders.',
        result: 'I delivered the segmentation insights on time, the marketing campaign used the segments to increase conversion by 22%, and I established a streamlined process for future rapid-turnaround requests.'
      }
    },
    {
      id: 'Give an example of how you handled ambiguity in a project.',
      question: 'Give an example of how you handled ambiguity in a project.',
      star: {
        situation: 'I was assigned to improve user engagement on our platform, but the leadership team had conflicting ideas about what \"engagement\" meant and which metrics to prioritize.',
        task: 'I needed to clarify the project goals, define measurable objectives, and propose a solution that would satisfy stakeholders despite the initial ambiguity.',
        action: 'I organized a workshop with stakeholders to define engagement metrics, analyzed historical data to correlate different behaviors with long-term retention, proposed a hybrid metric combining depth and frequency of use, and got buy-in through data-driven justification.',
        result: 'We established clear engagement metrics that aligned with business goals, the resulting feature increase user retention by 18%, and the process became a template for handling ambiguous projects in the future.'
      }
    }
    // In a real app, you'd have more questions - here we show 5 for brevity but structure supports expansion
  ];

  const handleQuestionSelect = (questionId: string) => {
    setActiveQuestion(questionId);
    setShowSTAR(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Behavioral Questions (STAR Method)</h2>
        <p className="text-gray-400 mb-4">Prepare your stories using Situation, Task, Action, Result framework</p>
        
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                activeQuestion === q.id
                  ? 'bg-a855f7/20 border-a855f7/50'
                  : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
              }`}
              onClick={() => handleQuestionSelect(q.id)}
            >
              <h3 className="font-semibold text-lg">{q.question}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        {!showSTAR && (
          <button
            onClick={() => setShowSTAR(true)}
            className="bg-a855f7/20 hover:bg-a855f7/30 text-a855f7 px-6 py-3 rounded-lg transition-colors w-full"
          >
            Show STAR Framework
          </button>
        )}
        
        {showSTAR && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-a855f7 mb-3">Situation</h3>
              <p className="text-gray-300">{questions.find(q => q.id === activeQuestion)?.star.situation || ''}</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-a855f7 mb-3">Task</h3>
              <p className="text-gray-300">{questions.find(q => q.id === activeQuestion)?.star.task || ''}</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-a855f7 mb-3">Action</h3>
              <p className="text-gray-300">{questions.find(q => q.id === activeQuestion)?.star.action || ''}</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-a855f7 mb-3">Result</h3>
              <p className="text-gray-300">{questions.find(q => q.id === activeQuestion)?.star.result || ''}</p>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowSTAR(false)}
                className="bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 px-6 py-3 rounded-lg transition-colors"
              >
                Hide STAR Framework
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Behavioral;