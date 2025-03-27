const studyPlan = [
  {
    day: 1,
    topic: "Arrays & Strings",
    description: "Learn: Basic operations, sliding window, two pointers",
    problems: [
      "Kadane's Algorithm (Max Subarray Sum)",
      "Two Sum",
      "Longest Substring Without Repeating Characters",
      "Sliding Window Maximum"
    ]
  },
  {
    day: 2,
    topic: "Recursion & Backtracking",
    description: "Learn: Recursive thinking, base cases, backtracking framework",
    problems: [
      "Subset Sum",
      "Generate Parentheses",
      "N-Queens Problem",
      "Word Search"
    ]
  },
  {
    day: 3,
    topic: "Linked Lists",
    description: "Learn: Singly, Doubly, Fast & Slow Pointers, Cycle Detection",
    problems: [
      "Reverse Linked List",
      "Merge Two Sorted Lists",
      "Detect Cycle in Linked List",
      "Remove N-th Node from End"
    ]
  },
  {
    day: 4,
    topic: "Stacks & Queues",
    description: "Learn: Stack-based problems, monotonic stacks, queue operations",
    problems: [
      "Next Greater Element",
      "Min Stack",
      "Valid Parentheses",
      "Implement Queue using Stacks"
    ]
  },
  {
    day: 5,
    topic: "Hashing & Heaps",
    description: "Learn: HashMaps, Priority Queues, Frequency Counting",
    problems: [
      "Top K Frequent Elements",
      "Group Anagrams",
      "Find Median in a Stream",
      "Kth Largest Element in Array"
    ]
  },
  {
    day: 6,
    topic: "Binary Trees & BST",
    description: "Learn: DFS, BFS, Inorder, Preorder, Postorder, BST properties",
    problems: [
      "Lowest Common Ancestor in BST",
      "Zigzag Level Order Traversal",
      "Validate BST",
      "Flatten Binary Tree to Linked List"
    ]
  },
  {
    day: 7,
    topic: "Graphs (BFS & DFS)",
    description: "Learn: Adjacency List, DFS, BFS, Cycle Detection",
    problems: [
      "Number of Islands",
      "Detect Cycle in Graph",
      "Clone Graph",
      "Shortest Path in Binary Matrix"
    ]
  },
  {
    day: 8,
    topic: "Dynamic Programming Basics",
    description: "Learn: Top-Down vs Bottom-Up, Memoization",
    problems: [
      "Fibonacci (DP)",
      "Climbing Stairs",
      "Coin Change",
      "Longest Common Subsequence"
    ]
  },
  {
    day: 9,
    topic: "DP – Hard Problems",
    description: "Learn: Knapsack, Subset Sum, Matrix DP",
    problems: [
      "0/1 Knapsack",
      "Longest Palindromic Subsequence",
      "Edit Distance"
    ]
  },
  {
    day: 10,
    topic: "Greedy Algorithms",
    description: "Learn: Greedy vs DP, Interval Scheduling",
    problems: [
      "Activity Selection",
      "Huffman Encoding",
      "Minimum Platforms"
    ]
  },
  {
    day: 11,
    topic: "Sorting & Searching",
    description: "Learn: Merge Sort, QuickSort, Binary Search Variations",
    problems: [
      "Search in Rotated Sorted Array",
      "Median of Two Sorted Arrays",
      "K-th Smallest Element"
    ]
  },
  {
    day: 12,
    topic: "Mock Test 1",
    description: "Solve a full-length coding test (90-120 mins). Analyze mistakes & revise weak areas.",
    problems: [
      "Comprehensive Test Problems",
      "Review Solutions",
      "Analyze Mistakes"
    ]
  },
  {
    day: 13,
    topic: "Mock Test 2 + Review",
    description: "Take another mock test. Focus on speed & accuracy.",
    problems: [
      "Comprehensive Test Problems",
      "Speed Optimization",
      "Review Weak Areas"
    ]
  },
  {
    day: 14,
    topic: "Final Revision & Quick Tricks",
    description: "Revise important patterns. Quick look at common mistakes & debugging techniques.",
    problems: [
      "Pattern Revision",
      "Common Mistakes Review",
      "Debugging Techniques"
    ]
  }
];

function getCurrentDayInfo() {
  // Check if the user has set a start date
  return new Promise((resolve) => {
    chrome.storage.local.get(['studyPlanStartDate'], (result) => {
      let startDate;
      if (result.studyPlanStartDate) {
        startDate = new Date(result.studyPlanStartDate);
      } else {
        // If no start date is set, use today as the start date
        startDate = new Date();
        chrome.storage.local.set({ studyPlanStartDate: startDate.toString() });
      }
      
      const today = new Date();
      const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      const currentDay = (daysDiff % 14) + 1; // Cycle through 14 days
      
      const dayInfo = studyPlan.find(day => day.day === currentDay);
      resolve(dayInfo);
    });
  });
}

function getDayInfo(dayNumber) {
  return studyPlan.find(day => day.day === dayNumber);
}

function resetStudyPlanStartDate() {
  const today = new Date();
  chrome.storage.local.set({ studyPlanStartDate: today.toString() }, () => {
    showNotification('Study plan reset to start from today!');
    loadCurrentDay();  // Reload current day info
    loadDays();        // Reload days in the dropdown
  });
}