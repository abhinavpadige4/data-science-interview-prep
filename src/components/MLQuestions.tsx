import React, { useState } from 'react';

const mlQuestions = [
  {
    id: 1,
    question: "What is overfitting?",
    options: [
      "A) Model performs well on training data but poorly on unseen data",
      "B) Model performs poorly on both training and test data",
      "C) Model has high bias and low variance",
      "D) Model is too simple to capture underlying patterns"
    ],
    correctAnswer: 0,
    explanation: "Overfitting occurs when a model learns the training data too well, including noise and outliers, resulting in poor generalization to new data."
  },
  {
    id: 2,
    question: "Which metric is best for evaluating a classification model with imbalanced classes?",
    options: [
      "A) Accuracy",
      "B) Precision",
      "C) F1-Score",
      "D) Mean Squared Error"
    ],
    correctAnswer: 2,
    explanation: "F1-Score balances precision and recall, making it ideal for imbalanced datasets where accuracy can be misleading."
  },
  {
    id: 3,
    question: "What does the elbow method help determine in K-means clustering?",
    options: [
      "A) Optimal number of clusters",
      "B) Best initialization method",
      "C) Optimal learning rate",
      "D) Number of iterations needed"
    ],
    correctAnswer: 0,
    explanation: "The elbow method plots the within-cluster sum of squares (WCSS) against the number of clusters. The 'elbow' point indicates diminishing returns, suggesting the optimal k."
  },
  {
    id: 4,
    question: "In a neural network, what is the purpose of an activation function?",
    options: [
      "A) To normalize input data",
      "B) To introduce non-linearity",
      "C) To reduce overfitting",
      "D) To initialize weights"
    ],
    correctAnswer: 1,
    explanation: "Activation functions introduce non-linearity, allowing neural networks to learn complex patterns. Without them, multiple layers would be equivalent to a single linear layer."
  },
  {
    id: 5,
    question: "Which of the following is NOT an assumption of linear regression?",
    options: [
      "A) Linearity",
      "B) Homoscedasticity",
      "C) Multicollinearity",
      "D) Independence of errors"
    ],
    correctAnswer: 2,
    explanation: "Linear regression assumes no multicollinearity (high correlation between predictors). High multicollinearity violates this assumption and inflates variance of coefficient estimates."
  }
];

const MLQuestions: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === mlQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < mlQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
    }
  };

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Machine Learning Questions</h2>
        <p className="text-gray-300 mb-6">Test your ML knowledge with interactive quiz</p>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Score: {score}/{mlQuestions.length}</span>
          <div className="w-full bg-gray-700/50 rounded-full h-2.5">
            <div
              className="bg-a855f7 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(score / mlQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {!showResult ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-bold text-a855f7 mb-4">Question {currentQuestion + 1} of {mlQuestions.length}</h3>
          <p className="text-gray-300 mb-6">{mlQuestions[currentQuestion].question}</p>
          <div className="space-y-3">
            {mlQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800/40 ${
                  selectedAnswer === index
                    ? 'bg-a855f7/20 border-a855f7'
                    : 'bg-gray-800/30 border-gray-700/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="mt-6 w-full bg-a855f7 hover:bg-a855f7/80 text-white font-medium py-3 rounded-lg transition-all duration-200"
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-bold mb-4">
            {selectedAnswer === mlQuestions[currentQuestion].correctAnswer
              ? 'Correct!'
              : 'Incorrect'}
          </h3>
          <p className="text-gray-300 mb-4">
            {mlQuestions[currentQuestion].explanation}
          </p>
          <div className="mt-6">
            <button
              onClick={handleNext}
              className="w-full bg-a855f7 hover:bg-a855f7/80 text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              {currentQuestion < mlQuestions.length - 1 ? 'Next Question' : 'Retake Quiz'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MLQuestions;