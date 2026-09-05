import React, { useState } from 'react';

const behavioralQuestions = [
  {
    id: 1,
    question: "Tell me about a time you failed.",
    star: {
      situation: "In my previous role as a data analyst, I was tasked with building a predictive model to forecast quarterly sales for a retail client with a two-week deadline.",
      task: "I needed to deliver an accurate forecast model that would inform inventory decisions for the upcoming holiday season.",
      action: "I rushed to build a complex neural network model without properly validating the data quality or checking for seasonality patterns. I spent most of the time on model architecture rather than exploratory data analysis.",
      result: "The model performed poorly on validation data, missing key holiday spikes. I had to revert to a simpler ARIMA model with proper feature engineering, which delivered accurate forecasts. I learned the importance of starting with simple models, thorough EDA, and time-boxing experimentation."
    }
  },
  {
    id: 2,
    question: "Describe a situation where you had to work with a difficult team member.",
    star: {
      situation: "During a cross-functional project to deploy a recommendation engine, I worked with a senior engineer who was resistant to adopting new ML frameworks and preferred legacy solutions.",
      task: "I needed to collaborate effectively to integrate the ML model into the existing production system while addressing their concerns about system stability.",
      action: "I scheduled one-on-one meetings to understand their concerns, presented data showing the benefits of the new approach, and proposed a phased rollout with rollback procedures. I also offered to pair-program on the integration tasks.",
      result: "The engineer became more open to the solution, we successfully deployed the model with zero downtime, and they later advocated for similar approaches in other projects. This improved our team's collaboration and delivery speed."
    }
  },
  {
    id: 3,
    question: "Give an example of when you had to learn a new technology quickly.",
    star: {
      situation: "Our team decided to migrate from on-premise Hadoop to AWS cloud infrastructure for our data pipeline, and I had limited experience with AWS services.",
      task: "I needed to become proficient in AWS Glue, Redshift, and Lambda within three weeks to lead the migration effort.",
      action: "I completed AWS training courses, built a small proof-of-concept pipeline using the new services, documented my learning process, and conducted knowledge-sharing sessions for the team. I also sought mentorship from a colleague with AWS experience.",
      result: "I successfully led the migration, reducing pipeline costs by 40% and improving processing speed by 60%. The team adopted the new infrastructure smoothly, and I became the go-to person for AWS-related questions."
    }
  }
];

const Behavioral: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showStar, setShowStar] = useState(false);

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Behavioral Questions (STAR Method)</h2>
        <p className="text-gray-300 mb-6">Prepare compelling stories using Situation, Task, Action, Result framework</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-bold text-a855f7 mb-4">Question {activeQuestion + 1} of {behavioralQuestions.length}</h3>
        <p className="text-gray-300 mb-6">{behavioralQuestions[activeQuestion].question}</p>
        
        {!showStar ? (
          <button
            onClick={() => setShowStar(true)}
            className="w-full bg-a855f7 hover:bg-a855f7/80 text-white font-medium py-3 rounded-lg transition-all duration-200"
          >
            Show STAR Framework Answer
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              <h4 className="font-bold text-a855f7 mb-2">Situation</h4>
              <p className="text-gray-300">{behavioralQuestions[activeQuestion].star.situation}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              <h4 className="font-bold text-a855f7 mb-2">Task</h4>
              <p className="text-gray-300">{behavioralQuestions[activeQuestion].star.task}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              <h4 className="font-bold text-a855f7 mb-2">Action</h4>
              <p className="text-gray-300">{behavioralQuestions[activeQuestion].star.action}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              <h4 className="font-bold text-a855f7 mb-2">Result</h4>
              <p className="text-gray-300">{behavioralQuestions[activeQuestion].star.result}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setActiveQuestion((prev) => (prev === behavioralQuestions.length - 1 ? 0 : prev + 1));
            setShowStar(false);
          }}
          className="flex-1 bg-a855f7 hover:bg-a855f7/80 text-white font-medium py-3 rounded-lg transition-all duration-200"
        >
          Next Question
        </button>
        <button
          onClick={() => setShowStar(false)}
          className="flex-1 bg-gray-800/30 hover:bg-gray-800/40 text-gray-300 border border-gray-700/50 py-3 rounded-lg transition-all duration-200"
        >
          Hide Answer
        </button>
      </div>
    </section>
  );
};

export default Behavioral;