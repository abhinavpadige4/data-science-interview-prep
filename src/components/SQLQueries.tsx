import React, { useState } from 'react';

const sqlQueries = [
  {
    id: 1,
    question: "Find the second highest salary from Employee table.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, department_id INT)",
    solution: "SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
    alternative: "SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;"
  },
  {
    id: 2,
    question: "Find employees who earn more than their managers.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, manager_id INT)",
    solution: "SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.manager_id = m.id WHERE e.salary > m.salary;",
    alternative: ""
  },
  {
    id: 3,
    question: "Calculate running total of sales by date.",
    tableSchema: "Sales(date DATE, amount DECIMAL(10,2))",
    solution: "SELECT date, amount, SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM Sales;",
    alternative: ""
  },
  {
    id: 4,
    question: "Find the top 3 highest-paid employees in each department.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, department_id INT)",
    solution: "SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn FROM Employee) ranked WHERE rn <= 3;",
    alternative: ""
  },
  {
    id: 5,
    question: "Find duplicate emails in Person table.",
    tableSchema: "Person(id INT, email VARCHAR(255))",
    solution: "SELECT email FROM Person GROUP BY email HAVING COUNT(*) > 1;",
    alternative: ""
  }
];

const SQLQueries: React.FC = () => {
  const [currentQuery, setCurrentQuery] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleCheckSolution = () => {
    setShowSolution(true);
    const normalizedUser = userQuery
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    const normalizedSolution = sqlQueries[currentQuery].solution
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    setIsCorrect(normalizedUser === normalizedSolution);
  };

  const handleReset = () => {
    setUserQuery('');
    setShowSolution(false);
    setIsCorrect(null);
  };

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">SQL Query Practice</h2>
        <p className="text-gray-300 mb-6">Practice real SQL queries with joins, window functions, and CTEs</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-bold text-a855f7 mb-4">Query {currentQuery + 1} of {sqlQueries.length}</h3>
        <p className="text-gray-300 mb-4">{sqlQueries[currentQuery].question}</p>
        <p className="text-gray-400 text-sm mb-4">Schema: {sqlQueries[currentQuery].tableSchema}</p>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Your SQL Query:</label>
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-gray-200 font-mono resize-y min-h-[120px] placeholder-gray-500 focus:outline-none focus:border-a855f7"
            placeholder="Write your SQL query here..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCheckSolution}
            disabled={!userQuery.trim()}
            className="flex-1 bg-a855f7 hover:bg-a855f7/80 text-white font-medium py-3 rounded-lg transition-all duration-200"
          >
            Check Solution
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-800/30 hover:bg-gray-800/40 text-gray-300 border border-gray-700/50 py-3 rounded-lg transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      {showSolution && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-bold mb-4">
            {isCorrect === true
              ? 'Correct! 🎉'
              : isCorrect === false
                ? 'Incorrect'
                : 'Solution'}
          </h3>
          {!isCorrect && (
            <>
              <p className="text-gray-300 mb-4">Your query did not match the expected solution.</p>
              <p className="text-gray-400 mb-6">Try again or view the solution below.</p>
            </>
          )}
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-200 mb-2">Expected Solution:</p>
              <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-gray-200 font-mono">
{sqlQueries[currentQuery].solution}
              </pre>
            </div>
            {sqlQueries[currentQuery].alternative && (
              <div>
                <p className="font-semibold text-gray-200 mb-2">Alternative Solution:</p>
                <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-gray-200 font-mono">
{sqlQueries[currentQuery].alternative}
                </pre>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (currentQuery < sqlQueries.length - 1) {
                setCurrentQuery(currentQuery + 1);
                setUserQuery('');
                setShowSolution(false);
                setIsCorrect(null);
              } else {
                setCurrentQuery(0);
                setUserQuery('');
                setShowSolution(false);
                setIsCorrect(null);
              }
            }}
            className="w-full bg-a855f7 hover:bg-a855f7/80 text-white font-medium py-3 rounded-lg transition-all duration-200 mt-4"
          >
            {currentQuery < sqlQueries.length - 1 ? 'Next Query' : 'Start Over'}
          </button>
        </div>
      )}
    </section>
  );
};

export default SQLQueries;