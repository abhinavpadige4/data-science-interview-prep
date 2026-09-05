import React, { useState } from 'react';

const sqlQueries = [
  {
    id: 1,
    question: "Find the second highest salary from Employee table.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, department_id INT)",
    hint: "Use LIMIT and OFFSET or subquery with MAX",
    solution: "SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;",
    explanation: "We order salaries in descending order, skip the highest (OFFSET 1), and take the next one (LIMIT 1). DISTINCT ensures we get the second distinct highest salary."
  },
  {
    id: 2,
    question: "Find employees who earn more than their managers.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, manager_id INT)",
    hint: "Use self-join",
    solution: "SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.manager_id = m.id WHERE e.salary > m.salary;",
    explanation: "We join the Employee table with itself, matching each employee to their manager via manager_id, then filter where employee's salary > manager's salary."
  },
  {
    id: 3,
    question: "Calculate the running total of sales by date.",
    tableSchema: "Sales(date DATE, amount DECIMAL(10,2))",
    hint: "Use window function SUM() OVER",
    solution: "SELECT date, amount, SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM Sales ORDER BY date;",
    explanation: "The window function SUM() OVER (ORDER BY date) calculates cumulative sum from the first row to current row for each date."
  },
  {
    id: 4,
    question: "Find the top 3 highest-paid employees in each department.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, department_id INT)",
    hint: "Use ROW_NUMBER() window function with PARTITION BY",
    solution: "SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn FROM Employee) ranked WHERE rn <= 3 ORDER BY department_id, rn;",
    explanation: "We partition by department_id and order by salary descending to rank employees within each department, then filter for top 3 ranks."
  },
  {
    id: 5,
    question: "Find customers who have placed orders in every month of the year.",
    tableSchema: "Orders(customer_id INT, order_date DATE)",
    hint: "Use GROUP BY, COUNT DISTINCT months, and HAVING",
    solution: "SELECT customer_id FROM Orders WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) GROUP BY customer_id HAVING COUNT(DISTINCT MONTH(order_date)) = 12;",
    explanation: "We filter orders from the last year, group by customer, and count distinct months. Customers with 12 distinct months ordered in every month."
  },
  {
    id: 6,
    question: "Calculate the median salary using SQL.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT)",
    hint: "Use PERCENTILE_CONT or handle even/odd cases",
    solution: "SELECT AVG(salary) AS median_salary FROM (SELECT salary FROM Employee ORDER BY salary LIMIT 2 - (SELECT COUNT(*) FROM Employee) % 2 OFFSET (SELECT (COUNT(*) - 1) / 2 FROM Employee)) AS sub;",
    explanation: "This handles both even and odd cases by selecting the middle value(s) and averaging them. For odd count: one middle value. For even: average of two middle values."
  },
  {
    id: 7,
    question: "Find duplicate emails in Person table.",
    tableSchema: "Person(id INT, email VARCHAR(100))",
    hint: "Use GROUP BY and HAVING COUNT > 1",
    solution: "SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;",
    explanation: "Group by email and count occurrences. Any email with count > 1 is a duplicate."
  },
  {
    id: 8,
    question: "Swap salary values between male and female employees.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT, sex ENUM('M','F'))",
    hint: "Use CASE statement in UPDATE",
    solution: "UPDATE Employee SET salary = CASE WHEN sex = 'M' THEN (SELECT AVG(salary) FROM Employee WHERE sex = 'F') WHEN sex = 'F' THEN (SELECT AVG(salary) FROM Employee WHERE sex = 'M') END;",
    explanation: "We update each employee's salary to the average salary of the opposite gender using a CASE expression."
  },
  {
    id: 9,
    question: "Find the nth highest salary where n is variable.",
    tableSchema: "Employee(id INT, name VARCHAR(50), salary INT)",
    hint: "Use LIMIT and OFFSET with variable",
    solution: "SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET (n-1);",
    explanation: "To get the nth highest distinct salary, we skip (n-1) rows after ordering by salary descending, then take 1 row."
  },
  {
    id: 10,
    question: "Find all departments with more than 5 employees.",
    tableSchema: "Employee(id INT, name VARCHAR(50), department_id INT, department_name VARCHAR(50))",
    hint: "Use GROUP BY and HAVING COUNT > 5",
    solution: "SELECT department_id, department_name, COUNT(*) AS employee_count FROM Employee GROUP BY department_id, department_name HAVING COUNT(*) > 5;",
    explanation: "Group by department and count employees. Filter groups where count > 5 using HAVING clause."
  },
  {
    id: 11,
    question: "Calculate the percentage of employees in each department.",
    tableSchema: "Employee(id INT, name VARCHAR(50), department_id INT)",
    hint: "Use subquery for total count and window function",
    solution: "SELECT department_id, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage FROM Employee GROUP BY department_id ORDER BY department_id;",
    explanation: "We count employees per department, then divide by total employees (using SUM OVER () for total) and multiply by 100 to get percentage."
  },
  {
    id: 12,
    question: "Find employees who have not placed any orders.",
    tableSchema: "Employee(id INT, name VARCHAR(50)), Orders(id INT, employee_id INT)",
    hint: "Use LEFT JOIN and check for NULL",
    solution: "SELECT e.name FROM Employee e LEFT JOIN Orders o ON e.id = o.employee_id WHERE o.id IS NULL;",
    explanation: "LEFT JOIN keeps all employees. If no matching order, Orders columns are NULL. We filter where o.id IS NULL to find employees with no orders."
  },
  {
    id: 13,
    question: "Find the longest streak of consecutive days a user visited the site.",
    tableSchema: "Visits(user_id INT, visit_date DATE)",
    hint: "Use DATEDIFF and row_number() trick",
    solution: "SELECT user_id, MAX(streak_length) AS max_streak FROM (SELECT user_id, visit_date, DATE_SUB(visit_date, INTERVAL ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY visit_date) DAY) AS grp FROM Visits) grouped GROUP BY user_id, grp;",
    explanation: "We subtract row number from date to create groups of consecutive dates. Same grp value means consecutive days. Then count per group and take max."
  },
  {
    id: 14,
    question: "Update NULL values in a column to the previous non-NULL value.",
    tableSchema: "SensorData(id INT, timestamp DATETIME, value FLOAT)",
    hint: "Use window function LAST_VALUE with IGNORE NULLS",
    solution: "SELECT id, timestamp, LAST_VALUE(value) OVER (PARTITION BY 1 ORDER BY timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS filled_value FROM SensorData;",
    explanation: "LAST_VALUE with IGNORE NULLS (default in some DBs) propagates the last non-NULL value forward. In MySQL, use COALESCE with subquery or user variables."
  },
  {
    id: 15,
    question: "Find the most recent order for each customer.",
    tableSchema: "Orders(id INT, customer_id INT, order_date DATE, amount DECIMAL)",
    hint: "Use ROW_NUMBER() window function",
    solution: "SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn FROM Orders) ranked WHERE rn = 1;",
    explanation: "We partition by customer_id and order by order_date descending to rank orders per customer. The most recent gets rank 1."
  }
];

const SQLQueries: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState(sqlQueries[0]);
  const [showSolution, setShowSolution] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const handleQuerySelect = (query) => {
    setActiveQuery(query);
    setShowSolution(false);
    setUserQuery('');
  };

  const handleRunQuery = () => {
    // In a real app, this would send to a backend
    alert('Query execution would happen here. In this demo, we show the solution.');
    setShowSolution(true);
  };

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-a855f7 mb-4">SQL Queries Practice</h2>
        <p className="text-gray-300 mb-6">Practice 15 SQL queries covering joins, window functions, CTEs, and more.</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select a Query:</label>
          <div className="space-y-2">
            {sqlQueries.map((query) => (
              <button
                key={query.id}
                onClick={() => handleQuerySelect(query)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeQuery.id === query.id
                    ? 'bg-a855f7/20 border border-a855f7/50 text-a855f7'
                    : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Query {query.id}</span>
                  <span className="text-sm text-gray-400">{activeQuery.id === query.id ? '●' : ''}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1 truncate">{query.question}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-bold text-a855f7 mb-4">Query {activeQuery.id}</h3>
        <p className="text-gray-300 mb-4">{activeQuery.question}</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
          <p className="font-mono text-sm text-gray-200"><strong>Table Schema:</strong> {activeQuery.tableSchema}</p>
          {activeQuery.hint && (
            <p className="text-yellow-400 text-sm mt-1"><strong>Hint:</strong> {activeQuery.hint}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Write your query:</label>
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="w-full min-h-[120px] p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-gray-200 font-mono resize-y focus:border-a855f7 focus:ring-a855f7/20"
            placeholder="Enter your SQL query here..."
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleRunQuery}
              className="px-4 py-2 bg-a855f7/20 border border-a855f7/50 text-a855f7 rounded-lg hover:bg-a855f7/30 transition-colors"
            >
              Run Query
            </button>
          </div>
        </div>
        
        {showSolution && (
          <div className="bg-gray-900/50 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-200 mb-3">Solution:</h4>
            <div className="bg-gray-800/50 p-4 rounded-lg font-mono text-sm text-gray-200">
              {activeQuery.solution}
            </div>
            
            <h4 className="font-semibold text-gray-200 mt-4 mb-2">Explanation:</h4>
            <p className="text-gray-300">{activeQuery.explanation}</p>
          </div>
        )}
        
        {!showSolution && (
          <div className="text-center text-gray-500 py-8">
            <p>Click "Run Query" to see the solution</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SQLQueries;