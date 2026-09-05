import React, { useState } from 'react';

const MLQuestions: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const questions = [
    {
      id: 1,
      question: "What is overfitting?",
      options: [
        "A) Model performs well on training data but poorly on unseen data",
        "B) Model performs poorly on both training and test data",
        "C) Model has high bias and low variance",
        "D) Model is too simple to capture patterns"
      ],
      correctAnswer: 0,
      explanation: "Overfitting occurs when a model learns the training data too well, including noise and outliers, resulting in poor generalization to new data."
    },
    {
      id: 2,
      question: "Which metric is best for imbalanced classification?",
      options: [
        "A) Accuracy",
        "B) Precision",
        "C) F1-Score",
        "D) R-squared"
      ],
      correctAnswer: 2,
      explanation: "F1-Score balances precision and recall, making it ideal for imbalanced datasets where accuracy can be misleading."
    },
    {
      id: 3,
      question: "What does the kernel trick in SVM do?",
      options: [
        "A) Increases model complexity",
        "B) Computes dot product in higher-dimensional space without explicit transformation",
        "C) Reduces overfitting",
        "D) Speeds up training"
      ],
      correctAnswer: 1,
      explanation: "The kernel trick allows SVM to operate in a high-dimensional feature space without explicitly computing the coordinates, making it computationally efficient."
    },
    {
      id: 4,
      question: "In K-means clustering, how is the optimal K typically determined?",
      options: [
        "A) Elbow method",
        "B) Silhouette score",
        "C) Both A and B",
        "D) Neither"
      ],
      correctAnswer: 2,
      explanation: "The elbow method looks for the point where adding more clusters doesn't significantly improve inertia, while silhouette score measures cluster separation and cohesion."
    },
    {
      id: 5,
      question: "What is the vanishing gradient problem in deep learning?",
      options: [
        "A) Gradients become too large causing instability",
        "B) Gradients become exponentially small as they propagate back through layers",
        "C) Weights stop updating",
        "D) Activation functions saturate"
      ],
      correctAnswer: 1,
      explanation: "In deep networks, gradients can become vanishingly small when using sigmoid/tanh activations, making early layers learn very slowly."
    }
    // In a real app, you'd have 20 questions - here we show 5 for brevity but structure supports expansion
  ];

  const handleAnswerSelect = (selectedIndex: number) => {
    if (showAnswer) return;
    const isCorrect = selectedIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Machine Learning Questions</h2>
        <p className="text-gray-400 mb-4">Question {currentQuestion + 1} of {questions.length}</p>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-gray-300">{questions[currentQuestion].question}</p>
        </div>
        <div className="mt-6 space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showAnswer}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                showAnswer
                  ? index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-600/20 border-green-600/50 text-green-400'
                    : index === selectedIndex && index !== questions[currentQuestion].correctAnswer
                      ? 'bg-red-600/20 border-red-600/50 text-red-400'
                      : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
                  : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <p className="font-semibold text-gray-300 mb-2">Explanation:</p>
            <p className="text-gray-200">{questions[currentQuestion].explanation}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm text-gray-400">
                Score: {score}/{questions.length}
              </span>
              {currentQuestion < questions.length - 1 && (
                <button
                  onClick={handleNext}
                  className="bg-a855f7/20 hover:bg-a855f7/30 text-a855f7 px-4 py-2 rounded-lg transition-colors"
                >
                  Next Question
                </button>
              )}
              {currentQuestion === questions.length - 1 && (
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setShowAnswer(false);
                    setScore(0);
                  }}
                  className="bg-a855f7/20 hover:bg-a855f7/30 text-a855f7 px-4 py-2 rounded-lg transition-colors"
                >
                  Restart Quiz
                </button>
              )}
            </div>
          </div>
        )}
        {!showAnswer && currentQuestion < questions.length - 1 && (
          <button
            onClick={handleNext}
            className="bg-a855f7/20 hover:bg-a855f7/30 text-a855f7 px-4 py-2 rounded-lg transition-colors"
          >
            Skip Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default MLQuestions;