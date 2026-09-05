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
    question: "Which technique is NOT used to prevent overfitting?",
    options: [
      "A) Regularization (L1/L2)",
      "B) Increasing model complexity",
      "C) Cross-validation",
      "D) Early stopping"
    ],
    correctAnswer: 1,
    explanation: "Increasing model complexity typically worsens overfitting. Techniques like regularization, cross-validation, and early stopping help reduce overfitting."
  },
  {
    id: 3,
    question: "In linear regression, what does the R-squared value represent?",
    options: [
      "A) The correlation coefficient between features and target",
      "B) The proportion of variance in the dependent variable explained by independent variables",
      "C) The slope of the regression line",
      "D) The p-value of the F-statistic"
    ],
    correctAnswer: 1,
    explanation: "R-squared (coefficient of determination) measures the proportion of variance in the dependent variable that is predictable from the independent variables."
  },
  {
    id: 4,
    question: "What is the primary difference between bagging and boosting?",
    options: [
      "A) Bagging reduces variance, boosting reduces bias",
      "B) Bagging uses sequential models, boosting uses parallel models",
      "C) Bagging is for classification only, boosting for regression only",
      "D) There is no difference; they are synonymous"
    ],
    correctAnswer: 0,
    explanation: "Bagging (Bootstrap Aggregating) trains models in parallel on random subsets and averages results to reduce variance. Boosting trains models sequentially, where each model corrects errors of the previous one, primarily reducing bias."
  },
  {
    id: 5,
    question: "Which evaluation metric is most appropriate for imbalanced classification problems?",
    options: [
      "A) Accuracy",
      "B) Precision",
      "C) F1-Score",
      "D) Mean Squared Error"
    ],
    correctAnswer: 2,
    explanation: "Accuracy can be misleading in imbalanced datasets. F1-score (harmonic mean of precision and recall) provides a better balance, especially when false positives and false negatives have different costs."
  },
  {
    id: 6,
    question: "What does the silhouette score measure in clustering?",
    options: [
      "A) The distance between cluster centroids",
      "B) How similar an object is to its own cluster compared to others",
      "C) The inertia (sum of squared distances) of clusters",
      "D) The number of clusters in the data"
    ],
    correctAnswer: 1,
    explanation: "Silhouette score ranges from -1 to 1, where high values indicate that the object is well matched to its own cluster and poorly matched to neighboring clusters."
  },
  {
    id: 7,
    question: "Which activation function is commonly used in the output layer for binary classification?",
    options: [
      "A) ReLU",
      "B) Sigmoid",
      "C) Tanh",
      "D) Softmax"
    ],
    correctAnswer: 1,
    explanation: "Sigmoid outputs values between 0 and 1, making it suitable for binary classification where we interpret the output as probability of class 1."
  },
  {
    id: 8,
    question: "What is the purpose of a validation set in machine learning?",
    options: [
      "A) To train the model",
      "B) To test the final model performance",
      "C) To tune hyperparameters and prevent overfitting",
      "D) To increase the size of the training data"
    ],
    correctAnswer: 2,
    explanation: "The validation set is used to tune hyperparameters and make decisions about model architecture without touching the test set, which should remain unseen until final evaluation."
  },
  {
    id: 9,
    question: "In a decision tree, what does Gini impurity measure?",
    options: [
      "A) The entropy of a node",
      "B) The probability of misclassifying a randomly chosen element",
      "C) The depth of the tree",
      "D) The information gain"
    ],
    correctAnswer: 1,
    explanation: "Gini impurity measures the likelihood of an incorrect classification of a randomly chosen element if it was randomly labeled according to the distribution of labels in the subset."
  },
  {
    id: 10,
    question: "What is the curse of dimensionality?",
    options: [
      "A) The phenomenon where model performance improves with more features",
      "B) The exponential increase in volume associated with adding extra dimensions",
      "C) The tendency of models to overfit in low-dimensional spaces",
      "D) The inability to visualize data beyond 3 dimensions"
    ],
    correctAnswer: 1,
    explanation: "As dimensionality increases, the volume of the space increases exponentially, making data sparse. This sparsity makes it harder to find patterns and increases computational cost."
  },
  {
    id: 11,
    question: "Which of the following is TRUE about K-means clustering?",
    options: [
      "A) It guarantees convergence to the global optimum",
      "B) It requires specifying the number of clusters beforehand",
      "C) It works well with non-globular cluster shapes",
      "D) It uses density-based clustering principles"
    ],
    correctAnswer: 1,
    explanation: "K-means requires the user to specify k (number of clusters) and converges to a local optimum. It assumes clusters are spherical and equally sized."
  },
  {
    id: 12,
    question: "What does PCA (Principal Component Analysis) do?",
    options: [
      "A) Increases dimensionality by creating polynomial features",
      "B) Reduces dimensionality while preserving maximum variance",
      "C) Classifies data into predefined categories",
      "D) Finds clusters based on density"
    ],
    correctAnswer: 1,
    explanation: "PCA is an unsupervised linear transformation technique that reduces dimensionality by projecting data onto orthogonal components that capture the most variance."
  },
  {
    id: 13,
    question: "In neural networks, what is the vanishing gradient problem?",
    options: [
      "A) Gradients become too large, causing unstable updates",
      "B) Gradients become exponentially small as they propagate backward through layers",
      "C) Weights stop updating after a few epochs",
      "D) The loss function becomes non-differentiable"
    ],
    correctAnswer: 1,
    explanation: "In deep networks with sigmoid/tanh activations, gradients can become extremely small during backpropagation, making it hard to update early layers. ReLU and proper initialization help mitigate this."
  },
  {
    id: 14,
    question: "What is the main advantage of using ensemble methods like Random Forest?",
    options: [
      "A) They always produce interpretable models",
      "B) They reduce variance by averaging multiple decision trees",
      "C) They eliminate the need for feature scaling",
      "D) They work only with linear relationships"
    ],
    correctAnswer: 1,
    explanation: "Random Forest builds multiple decision trees on random subsets of data and features, then averages their predictions. This reduces overfitting (variance) while maintaining low bias."
  },
  {
    id: 15,
    question: "Which of the following best describes precision in classification?",
    options: [
      "A) Of all positive predictions, how many were actually positive?",
      "B) Of all actual positives, how many did we correctly identify?",
      "C) The ratio of true negatives to all negative predictions",
      "D) The harmonic mean of sensitivity and specificity"
    ],
    correctAnswer: 0,
    explanation: "Precision = TP / (TP + FP). It answers: 'Of all instances we predicted as positive, what fraction were actually positive?' High precision means low false positive rate."
  },
  {
    id: 16,
    question: "What is the difference between L1 and L2 regularization?",
    options: [
      "A) L1 adds absolute values of weights, L2 adds squared weights",
      "B) L1 is for classification, L2 for regression",
      "C) L1 increases model complexity, L2 decreases it",
      "D) There is no difference in practice"
    ],
    correctAnswer: 0,
    explanation: "L1 regularization (Lasso) adds penalty equal to absolute value of weights, which can drive some weights to zero (feature selection). L2 (Ridge) adds penalty proportional to square of weights, shrinking them but rarely to zero."
  },
  {
    id: 17,
    question: "When should you use a convolutional neural network (CNN)?",
    options: [
      "A) For sequential data like text or time series",
      "B) For grid-like data such as images",
      "C) When you have very little training data",
      "D) For unsupervised clustering tasks"
    ],
    correctAnswer: 1,
    explanation: "CNNs are designed to process data with grid-like topology (e.g., images) using convolutional layers that exploit spatial locality and reduce parameters through weight sharing."
  },
  {
    id: 18,
    question: "What is the purpose of dropout in neural networks?",
    options: [
      "A) To increase the learning rate",
      "B) To randomly deactivate neurons during training to prevent overfitting",
      "C) To normalize layer inputs",
      "D) To initialize weights with random values"
    ],
    correctAnswer: 1,
    explanation: "Dropout randomly sets a fraction of input units to 0 during training, which prevents complex co-adaptations on training data and acts as a form of model averaging."
  },
  {
    id: 19,
    question: "Which clustering algorithm does NOT require specifying the number of clusters beforehand?",
    options: [
      "A) K-means",
      "B) Hierarchical clustering",
      "C) DBSCAN",
      "D) Both B and C"
    ],
    correctAnswer: 3,
    explanation: "Hierarchical clustering builds a tree of clusters (dendrogram) and DBSCAN groups based on density. Neither requires pre-specifying k, unlike K-means."
  },
  {
    id: 20,
    question: "What is the bias-variance tradeoff?",
    options: [
      "A) The balance between model complexity and training time",
      "B) The tradeoff between error due to bias and error due to variance",
      "C) The compromise between overfitting and underfitting",
      "D) Both B and C"
    ],
    correctAnswer: 3,
    explanation: "High bias causes underfitting (model too simple), high variance causes overfitting (model too complex). The tradeoff seeks optimal model complexity where total error is minimized."
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

  const handleNextQuestion = () => {
    if (currentQuestion < mlQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const currentQ = mlQuestions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === currentQ.correctAnswer;

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">Machine Learning Questions</h2>
        <p className="text-gray-300 mb-6">Test your ML knowledge with 20 interview-style questions.</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {mlQuestions.length}</span>
          <span className="text-sm text-a855f7 font-medium">Score: {score}/{mlQuestions.length}</span>
        </div>
        
        <div className="bg-gray-900/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  isAnswered
                    ? index === currentQ.correctAnswer
                      ? 'bg-green-900/20 border border-green-500/50'
                      : index === selectedAnswer
                        ? 'bg-red-900/20 border border-red-500/50'
                        : 'bg-gray-800/30 border border-gray-700/50'
                    : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/40'
                }`}
                onClick={() => !isAnswered && handleAnswerSelect(index)}
              >
                <input
                  type="radio"
                  checked={selectedAnswer === index}
                  disabled={isAnswered}
                  className="mr-3 h-4 w-4 text-a855f7"
                />
                <span className="text-gray-200">{option}</span>
              </label>
            ))}
          </div>
          
          {showResult && (
            <div className="mt-5 p-4 rounded-lg">
              {isCorrect ? (
                <div className="bg-green-900/20 border border-green-500/50">
                  <p className="text-green-400 font-medium">✅ Correct!</p>
                  <p className="text-gray-300 mt-2">{currentQ.explanation}</p>
                </div>
              ) : (
                <div className="bg-red-900/20 border border-red-500/50">
                  <p className="text-red-400 font-medium">❌ Incorrect</p>
                  <p className="text-gray-300 mt-2">{currentQ.explanation}</p>
                  <p className="text-gray-300 mt-2">
                    <strong>Correct answer:</strong> {currentQ.options[currentQ.correctAnswer]}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 flex justify-between">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-4 py-2 bg-gray-800/30 border border-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-800/40 transition-colors"
              >
                Previous
              </button>
            )}
            
            {!showResult && (
              <button
                onClick={() => setShowResult(true)}
                disabled={!selectedAnswer && selectedAnswer !== 0}
                className="px-4 py-2 bg-a855f7/20 border border-a855f7/50 text-a855f7 rounded-lg hover:bg-a855f7/30 transition-colors"
              >
                Submit Answer
              </button>
            )}
            
            {showResult && currentQuestion < mlQuestions.length - 1 && (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-a855f7/20 border border-a855f7/50 text-a855f7 rounded-lg hover:bg-a855f7/30 transition-colors"
              >
                Next Question
              </button>
            )}
            
            {showResult && currentQuestion === mlQuestions.length - 1 && (
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 bg-a855f7/20 border border-a855f7/50 text-a855f7 rounded-lg hover:bg-a855f7/30 transition-colors"
              >
                Restart Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MLQuestions;