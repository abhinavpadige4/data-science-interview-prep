import React, { useState } from 'react';

const behavioralQuestions = [
  {
    id: 1,
    question: "Tell me about a time you failed.",
    star: {
      situation: "In my previous role as a data analyst, I was tasked with building a predictive model to forecast quarterly sales for a retail client.",
      task: "The goal was to achieve at least 90% accuracy to help optimize inventory management and reduce overstock costs.",
      action: "I rushed the feature engineering process, used only basic statistical models without proper validation, and didn't involve stakeholders early enough to understand business nuances.",
      result: "The model achieved only 65% accuracy, leading to poor inventory decisions. I learned to allocate more time for exploratory data analysis, use cross-validation, and maintain regular stakeholder communication."
    }
  },
  {
    id: 2,
    question: "Describe a situation where you had to work with a difficult team member.",
    star: {
      situation: "During a machine learning project, I was paired with a senior engineer who preferred to work independently and often dismissed suggestions from junior team members.",
      task: "We needed to collaborate effectively to deliver a production-ready model within a tight deadline while maintaining team cohesion.",
      action: "I scheduled regular one-on-one meetings to understand their perspective, communicated my ideas clearly with supporting evidence, and found common ground by focusing on shared goals.",
      result: "We improved our communication, combined our strengths (their deep learning expertise and my feature engineering skills), and delivered the model two days ahead of schedule with 94% accuracy."
    }
  },
  {
    id: 3,
    question: "Tell me about a time you had to learn a new technology quickly.",
    star: {
      situation: "Our team decided to migrate from traditional SQL databases to a cloud-based data warehouse (Snowflake) for better scalability and performance.",
      task: "I needed to become proficient in Snowflake within two weeks to lead the migration effort and train other team members.",
      action: "I completed official Snowflake training courses, practiced with sample datasets, built a prototype migration pipeline, and created internal documentation.",
      result: "I successfully led the migration, reduced query processing time by 60%, and conducted training sessions that enabled the team to become productive within a week."
    }
  },
  {
    id: 4,
    question: "Describe a time you had to explain a complex technical concept to a non-technical audience.",
    star: {
      situation: "I needed to present the results of a customer segmentation model to the marketing team, who had limited background in machine learning.",
      task: "Explain how the model works, what the segments mean, and how they can use this information to improve campaign targeting.",
      action: "I used analogies (comparing segments to customer 'personas'), visualizations (cluster plots and characteristic bar charts), and focused on business implications rather than mathematical details.",
      result: "The marketing team understood the segments, created targeted campaigns for each group, and increased conversion rates by 25% in the following quarter."
    }
  },
  {
    id: 5,
    question: "Tell me about a time you had to meet a tight deadline.",
    star: {
      situation: "A client requested an urgent analysis to understand why their latest marketing campaign underperformed, with results needed in 48 hours for an executive meeting.",
      task: "Deliver actionable insights on campaign performance, audience engagement, and ROI within the tight timeframe.",
      action: "I prioritized key metrics, automated repetitive data cleaning tasks with Python scripts, used exploratory data analysis to quickly identify patterns, and prepared a concise presentation with clear recommendations.",
      result: "I delivered the analysis within 36 hours, identified that the campaign missed its target audience due to incorrect targeting parameters, and provided specific recommendations that improved the next campaign's ROI by 35%."
    }
  }
];

const Behavioral: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(behavioralQuestions[0]);
  const [showStar, setShowStar] = useState(false);

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Behavioral Questions (STAR Method)</h2>
        <p className="text-gray-300 mb-6">Prepare for behavioral interviews using the Situation-Task-Action-Result framework.</p>
        
        <div className="space-y-4">
          {behavioralQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => {
                setActiveQuestion(question);
                setShowStar(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                activeQuestion.id === question.id
                  ? 'bg-a855f7/20 border border-a855f7/50 text-a855f7'
                  : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/40'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">Question {question.id}</h3>
                <span className="text-sm text-gray-400">{showStar && activeQuestion.id === question.id ? '▼' : '▶'}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1 truncate">{question.question}</p>
            </button>
          ))}
        </div>
      </div>

      {behavioralQuestions.map((question) => (
        <div
          key={question.id}
          className={`hidden ${activeQuestion.id === question.id && showStar ? 'block fade-in' : ''}`}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-a855f7 mb-4">{activeQuestion.question}</h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Situation:</h4>
                <p className="text-gray-300">{activeQuestion.star.situation}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Task:</h4>
                <p className="text-gray-300">{activeQuestion.star.task}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Action:</h4>
                <p className="text-gray-300">{activeQuestion.star.action}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Result:</h4>
                <p className="text-gray-300">{activeQuestion.star.result}</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
              <h4 className="font-semibold text-gray-200 mb-2">STAR Method Tips:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Be specific and concise - focus on your individual contributions</li>
                <li>Use metrics and quantifiable results when possible</li>
                <li>Choose examples that demonstrate relevant skills for the role</li>
                <li>Practice your stories to deliver them naturally</li>
                <li>Reflect on what you learned from each experience</li>
              </ul>
            </div>
          </div>
        </div>
      ))}
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowStar(!showStar)}
            className="px-4 py-2 bg-a855f7/20 border border-a855f7/50 text-a855f7 rounded-lg hover:bg-a855f7/30 transition-colors"
          >
            {showStar ? 'Hide STAR Breakdown' : 'Show STAR Breakdown'}
          </button>
          
          <span className="text-sm text-gray-400">
            {behavioralQuestions.length} behavioral questions prepared
          </span>
        </div>
      </div>
    </section>
  );
};

export default Behavioral;