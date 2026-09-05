import React, { useState } from 'react';

const SQLQueries: React.FC = () => {
  const [currentQuery, setCurrentQuery] = useState<number>(0);
  const [userQuery, setUserQuery] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const queries = [
    {
      id: 1,
      question: "Find the second highest salary from Employee table.",
      tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, department_id INT)",
      solution: "SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
      alternatives: [
        "SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;",
        "SELECT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;"
      ]
    },
    {
      id: 2,
      question: "Find employees who earn more than their managers.",
      tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, manager_id INT)",
      solution: "SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.manager_id = m.id WHERE e.salary > m.salary;",
      alternatives: []
    },
    {
      id: 3,
      question: "Calculate running total of sales by date using window functions.",
      tableSchema: "Sales(date DATE, amount DECIMAL(10,2))",
      solution: "SELECT date, amount, SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM Sales ORDER BY date;",
      alternatives: []
    },
    {
      id: 4,
      question: "Find the nth highest salary using CTE and window functions.",
      tableSchema: "Employee(id INT, name VARCHAR(50), salary INT)",
      solution: "WITH RankedSalaries AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rank FROM Employee) SELECT salary FROM RankedSalaries WHERE rank = @n;",
      alternatives: []
    },
    {
      id: 5,
      question: "Find duplicate emails in Person table.",
      tableSchema: "Person(id INT, email VARCHAR(255))",
      solution: "SELECT email FROM Person GROUP BY email HAVING COUNT(*) > 1;",
      alternatives: []
    }
    // In a real app, you'd have 15 queries - here we show 5 for brevity but structure supports expansion
  ];

  const handleCheckSolution = () => {
    const normalizedUser = userQuery.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedSolution = queries[currentQuery].solution.trim().toLowerCase().replace(/\s+/g, ' ');
    
    // Simple check - in production you'd use SQL parser
    setIsCorrect(normalizedUser === normalizedSolution);
    setShowSolution(true);
  };

  const handleReset = () => {
    setUserQuery('');
    setShowSolution(false);
    setIsCorrect(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">SQL Query Practice</h2>
        <p className="text-gray-400 mb-4">Query {currentQuery + 1} of {queries.length}</p>
        
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <p className="font-semibold text-gray-300 mb-2">{queries[currentQuery].question}</p>
          <p className="text-sm text-gray-500 mb-3">Schema: {queries[currentQuery].tableSchema}</p>
          
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Write your SQL query here..."
            className="w-full min-h-[100px] p-3 bg-gray-900/70 border border-gray-700/50 rounded-lg text-gray-200 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-a855f7/50"
          />
          
          <div className="mt-3 flex justify-end space-x-3">
            <button
              onClick={handleReset}
              className="bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleCheckSolution}
              disabled={!userQuery.trim()}
              className={`bg-a855f7/20 hover:bg-a855f7/30 text-a855f7 px-4 py-2 rounded-lg transition-colors ${
                !userQuery.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Check Solution
            </button>
          </div>
        </div>

        {showSolution && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-a855f7 mb-4">Solution</h3>
            <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
              <p className="font-mono text-sm text-gray-200">{queries[currentQuery].solution}</p>
            </div>
            
            {queries[currentQuery].alternatives.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-gray-300 mb-2">Alternative Solutions:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {queries[currentQuery].alternatives.map((alt, index) => (
                    <li key={index} className="font-mono text-sm">{alt}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
              {isCorrect === true && (
                <p className="text-green-400 font-semibold">✅ Correct! Your query matches the solution.</p>
              )}
              {isCorrect === false && (
                <p className="text-red-400 font-semibold">❌ Incorrect. Compare your query with the solution above.</p>
              )}
              {isCorrect === null && (
                <p className="text-gray-400">Run the query to check correctness.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SQLQueries;