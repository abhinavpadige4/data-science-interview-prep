import React, { useState } from 'react';

const PythonChallenges: React.FC<{ 
  searchTerm: string; 
  onProgressUpdate: (progress: number) => void 
}> = ({ searchTerm, onProgressUpdate }) => {
  const challenges = [
    {
      id: 1,
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
      solution: `
def two_sum(nums, target):
    """
    Returns indices of the two numbers that add up to target.
    
    Args:
        nums: List of integers
        target: Target sum
        
    Returns:
        List of two indices
    """
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []
`
    },
    {
      id: 2,
      title: "Reverse Integer",
      description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
      difficulty: "Easy",
      solution: `
def reverse_integer(x):
    """
    Reverses digits of a 32-bit signed integer.
    
    Args:
        x: Integer to reverse
        
    Returns:
        Reversed integer or 0 if overflow
    """
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    
    sign = -1 if x < 0 else 1
    x_abs = abs(x)
    reversed_x = 0
    
    while x_abs != 0:
        digit = x_abs % 10
        reversed_x = reversed_x * 10 + digit
        x_abs //= 10
        
        # Check for overflow
        if reversed_x > INT_MAX // 10 or (reversed_x == INT_MAX // 10 and digit > INT_MAX % 10):
            return 0
    
    return sign * reversed_x
`
    },
    {
      id: 3,
      title: "Palindrome Number",
      description: "Given an integer x, return true if x is palindrome integer.",
      difficulty: "Easy",
      solution: `
def is_palindrome(x):
    """
    Checks if an integer is a palindrome.
    
    Args:
        x: Integer to check
        
    Returns:
        True if palindrome, False otherwise
    """
    if x < 0:
        return False
    
    original = x
    reversed_num = 0
    
    while x > 0:
        digit = x % 10
        reversed_num = reversed_num * 10 + digit
        x //= 10
    
    return original == reversed_num
`
    },
    {
      id: 4,
      title: "Merge Two Sorted Lists",
      description: "Merge two sorted linked lists and return it as a sorted list.",
      difficulty: "Medium",
      solution: `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    """
    Merges two sorted linked lists.
    
    Args:
        list1: Head of first sorted linked list
        list2: Head of second sorted linked list
        
    Returns:
        Head of merged sorted linked list
    """
    dummy = ListNode()
    current = dummy
    
    while list1 and list2:
        if list1.val < list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 if list1 else list2
    return dummy.next
`
    },
    {
      id: 5,
      title: "Valid Parentheses",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "Easy",
      solution: `
def is_valid_parentheses(s):
    """
    Checks if a string of parentheses is valid.
    
    Args:
        s: String containing parentheses
        
    Returns:
        True if valid, False otherwise
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            # If stack is not empty, pop the top element, else use dummy value
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    
    return not stack
`
    },
    {
      id: 6,
      title: "Binary Search",
      description: "Given a sorted array of integers nums and an integer target, return the index of target if it exists in nums, otherwise return -1.",
      difficulty: "Easy",
      solution: `
def binary_search(nums, target):
    """
    Performs binary search on a sorted array.
    
    Args:
        nums: Sorted list of integers
        target: Target value to find
        
    Returns:
        Index of target if found, -1 otherwise
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
`
    },
    {
      id: 7,
      title: "Maximum Subarray",
      description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      difficulty: "Medium",
      solution: `
def max_subarray(nums):
    """
    Finds the contiguous subarray with the largest sum (Kadane's algorithm).
    
    Args:
        nums: List of integers
        
    Returns:
        Maximum subarray sum
    """
    max_current = max_global = nums[0]
    
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        if max_current > max_global:
            max_global = max_current
    
    return max_global
`
    },
    {
      id: 8,
      title: "Climbing Stairs",
      description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      difficulty: "Easy",
      solution: `
def climb_stairs(n):
    """
    Calculates distinct ways to climb stairs (Fibonacci sequence).
    
    Args:
        n: Number of steps
        
    Returns:
        Number of distinct ways to reach the top
    """
    if n <= 2:
        return n
    
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    
    return b
`
    },
    {
      id: 9,
      title: "Best Time to Buy and Sell Stock",
      description: "Given an array prices where prices[i] is the price of a given stock on the ith day, find the maximum profit.",
      difficulty: "Easy",
      solution: `
def max_profit(prices):
    """
    Finds maximum profit from buying and selling stock once.
    
    Args:
        prices: List of stock prices
        
    Returns:
        Maximum profit
    """
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for price in prices[1:]:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    
    return max_profit
`
    },
    {
      id: 10,
      title: "Contains Duplicate",
      description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      difficulty: "Easy",
      solution: `
def contains_duplicate(nums):
    """
    Checks if array contains duplicates.
    
    Args:
        nums: List of integers
        
    Returns:
        True if duplicates exist, False otherwise
    """
    return len(nums) != len(set(nums))
`
    }
  ];

  const filteredChallenges = challenges.filter(challenge => 
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  // Update progress based on completed challenges
  React.useEffect(() => {
    const progress = Math.round((completedChallenges.length / challenges.length) * 100);
    onProgressUpdate(progress);
  }, [completedChallenges, onProgressUpdate]);

  const toggleComplete = (id: number) => {
    setCompletedChallenges(prev => {
      const index = prev.indexOf(id);
      if (index >= 0) {
        return prev.filter(challengeId => challengeId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <section className="mb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Python Coding Challenges
        </h2>
        
        <div className="space-y-6">
          {filteredChallenges.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            return (
              <div 
                key={challenge.id} 
                className={`bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 
                  ${isCompleted ? 'border-purple-500/50' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="text-purple-400">{challenge.id}.</span> {challenge.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full 
                      ${challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'}
                    `}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{challenge.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <button 
                      onClick={() => toggleComplete(challenge.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium 
                        ${isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:bg-gradient-to-l' 
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'}
                        transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                        rounded-lg`}
                    >
                      {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(challenge.solution.trim());
                        alert('Solution copied to clipboard!');
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-lg"
                    >
                      Show Solution
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                  
                  {!isCompleted && (
                    <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-700">
                      <p className="text-sm text-gray-400 italic">
                        Try solving this challenge first, then click "Show Solution" to check your answer.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {filteredChallenges.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-400">No challenges match your search: "<span className="font-medium">{searchTerm}</span>"</p>
            </div>
          )}
          
          {filteredChallenges.length === 0 && !searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-400">No challenges available</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Completed: <span className="font-medium text-white">{completedChallenges.length}</span> / {challenges.length} challenges
          </p>
        </div>
      </div>
    </section>
  );
};

export default PythonChallenges;