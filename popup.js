// Study plan data
const studyPlan = [
  {
    day: 1,
    title: "Arrays & Strings",
    topics: ["Basic operations", "sliding window", "two pointers"],
    suggestedProblems: ["Kadane's Algorithm", "Two Sum", "Longest Substring Without Repeating Characters", "Sliding Window Maximum"]
  },
  {
    day: 2,
    title: "Recursion & Backtracking",
    topics: ["Recursive thinking", "base cases", "backtracking framework"],
    suggestedProblems: ["Subset Sum", "Generate Parentheses", "N-Queens Problem", "Word Search"]
  },
  {
    day: 3,
    title: "Linked Lists",
    topics: ["Singly", "Doubly", "Fast & Slow Pointers", "Cycle Detection"],
    suggestedProblems: ["Reverse Linked List", "Merge Two Sorted Lists", "Detect Cycle in Linked List", "Remove N-th Node from End"]
  },
  {
    day: 4,
    title: "Stacks & Queues",
    topics: ["Stack-based problems", "monotonic stacks", "queue operations"],
    suggestedProblems: ["Next Greater Element", "Min Stack", "Valid Parentheses", "Implement Queue using Stacks"]
  },
  {
    day: 5,
    title: "Hashing & Heaps",
    topics: ["HashMaps", "Priority Queues", "Frequency Counting"],
    suggestedProblems: ["Top K Frequent Elements", "Group Anagrams", "Find Median in a Stream", "Kth Largest Element in Array"]
  },
  {
    day: 6,
    title: "Binary Trees & BST",
    topics: ["DFS", "BFS", "Inorder", "Preorder", "Postorder", "BST properties"],
    suggestedProblems: ["Lowest Common Ancestor in BST", "Zigzag Level Order Traversal", "Validate BST", "Flatten Binary Tree to Linked List"]
  },
  {
    day: 7,
    title: "Graphs (BFS & DFS)",
    topics: ["Adjacency List", "DFS", "BFS", "Cycle Detection"],
    suggestedProblems: ["Number of Islands", "Detect Cycle in Graph", "Clone Graph", "Shortest Path in Binary Matrix"]
  },
  {
    day: 8,
    title: "Dynamic Programming Basics",
    topics: ["Top-Down vs Bottom-Up", "Memoization"],
    suggestedProblems: ["Fibonacci (DP)", "Climbing Stairs", "Coin Change", "Longest Common Subsequence"]
  },
  {
    day: 9,
    title: "DP – Hard Problems",
    topics: ["Knapsack", "Subset Sum", "Matrix DP"],
    suggestedProblems: ["0/1 Knapsack", "Longest Palindromic Subsequence", "Edit Distance"]
  },
  {
    day: 10,
    title: "Greedy Algorithms",
    topics: ["Greedy vs DP", "Interval Scheduling"],
    suggestedProblems: ["Activity Selection", "Huffman Encoding", "Minimum Platforms"]
  },
  {
    day: 11,
    title: "Sorting & Searching",
    topics: ["Merge Sort", "QuickSort", "Binary Search Variations"],
    suggestedProblems: ["Search in Rotated Sorted Array", "Median of Two Sorted Arrays", "K-th Smallest Element"]
  },
  {
    day: 12,
    title: "Mock Test 1",
    topics: ["Full-length coding test"],
    suggestedProblems: ["Analyze mistakes & revise weak areas"]
  },
  {
    day: 13,
    title: "Mock Test 2 + Review",
    topics: ["Another mock test", "Focus on speed & accuracy"],
    suggestedProblems: []
  },
  {
    day: 14,
    title: "Final Revision & Quick Tricks",
    topics: ["Important patterns", "Common mistakes & debugging techniques"],
    suggestedProblems: ["Stay calm & confident!"]
  }
];

// Global state
let currentState = {
  currentDay: 1,
  dailyTarget: 5,
  solvedToday: 0,
  reminderTime: "09:00",
  enableNotifications: true,
  username: "Mangun10",
  currentDate: "2025-03-23"
};

// DOM Elements
const elements = {
  // User info
  currentUser: document.getElementById('current-user'),
  currentDate: document.getElementById('current-date'),
  
  // Tracker tab
  currentDayTitle: document.getElementById('current-day-title'),
  dailyTarget: document.getElementById('daily-target'),
  solvedCount: document.getElementById('solved-count'),
  remainingCount: document.getElementById('remaining-count'),
  
  // Form
  questionForm: document.getElementById('question-form'),
  questionName: document.getElementById('question-name'),
  difficulty: document.getElementById('difficulty'),
  timeTaken: document.getElementById('time-taken'),
  comments: document.getElementById('comments'),
  revisionNeeded: document.getElementById('revision-needed'),
  submitBtn: document.getElementById('submit-btn'),
  
  // History tab
  searchQuestions: document.getElementById('search-questions'),
  filterDay: document.getElementById('filter-day'),
  historyList: document.getElementById('history-list'),
  
  // Settings tab
  dailyQuestionTarget: document.getElementById('daily-question-target'),
  reminderTime: document.getElementById('reminder-time'),
  enableNotifications: document.getElementById('enable-notifications'),
  saveSettings: document.getElementById('save-settings'),
  resetProgress: document.getElementById('reset-progress'),
  
  // Tabs
  tabButtons: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content')
};

// Initialize the extension
function initializeExtension() {
  // Load saved state from Chrome storage
  chrome.storage.local.get(['dsaStudyState', 'dsaQuestionHistory'], function(result) {
    if (result.dsaStudyState) {
      currentState = { ...currentState, ...result.dsaStudyState };
    }
    
    // Update UI with current state
    updateUI();
    
    // Populate history if available
    if (result.dsaQuestionHistory) {
      populateHistory(result.dsaQuestionHistory);
    }
  });
  
  // Set up event listeners
  setupEventListeners();
}

// Update UI elements with current state
function updateUI() {
  // Update user info
  elements.currentUser.textContent = `Hello, ${currentState.username}!`;
  elements.currentDate.textContent = currentState.currentDate;
  
  // Update tracker tab
  const currentDayData = studyPlan[currentState.currentDay - 1];
  elements.currentDayTitle.textContent = `Day ${currentState.currentDay}: ${currentDayData.title}`;
  elements.dailyTarget.textContent = currentState.dailyTarget;
  elements.solvedCount.textContent = currentState.solvedToday;
  elements.remainingCount.textContent = Math.max(0, currentState.dailyTarget - currentState.solvedToday);
  
  // Update settings
  elements.dailyQuestionTarget.value = currentState.dailyTarget;
  elements.reminderTime.value = currentState.reminderTime;
  elements.enableNotifications.checked = currentState.enableNotifications;
}

// Set up event listeners for the UI
function setupEventListeners() {
  // Tab switching
  elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Update active tab button
      elements.tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show appropriate tab content
      elements.tabContents.forEach(content => {
        content.classList.add('hidden');
        if (content.id === tabId) {
          content.classList.remove('hidden');
        }
      });
    });
  });
  
  // Form submission
  elements.questionForm.addEventListener('submit', handleQuestionSubmit);
  
  // Search and filter history
  elements.searchQuestions.addEventListener('input', filterHistory);
  elements.filterDay.addEventListener('change', filterHistory);
  
  // Settings
  elements.saveSettings.addEventListener('click', saveSettings);
  elements.resetProgress.addEventListener('click', resetProgress);
}

// Handle question submission
function handleQuestionSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const questionData = {
    name: elements.questionName.value,
    difficulty: elements.difficulty.value,
    timeTaken: parseInt(elements.timeTaken.value),
    comments: elements.comments.value,
    revisionNeeded: elements.revisionNeeded.checked,
    day: currentState.currentDay,
    timestamp: new Date().toISOString(),
    dayTitle: studyPlan[currentState.currentDay - 1].title
  };
  
  // Save to Chrome storage
  chrome.storage.local.get(['dsaQuestionHistory'], function(result) {
    const history = result.dsaQuestionHistory || [];
    history.push(questionData);
    
    chrome.storage.local.set({ dsaQuestionHistory: history }, function() {
      // Update today's solved count
      currentState.solvedToday++;
      
      // Save updated state
      saveState();
      
      // Update UI
      updateUI();
      
      // Reset form
      elements.questionForm.reset();
      
      // Show success notification
      showNotification('Question saved successfully!');
      
      // If daily target reached, show celebration
      if (currentState.solvedToday >= currentState.dailyTarget) {
        showNotification('🎉 Congratulations! You\'ve reached your daily goal!');
      }
    });
  });
}

// Save current state to Chrome storage
function saveState() {
  chrome.storage.local.set({ dsaStudyState: currentState });
}

// Show notification
function showNotification(message) {
  // You can implement this with a toast notification or alert
  console.log(message);
  
  // For now, just create a simple toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Add the toast styles if not already in CSS
  const style = document.createElement('style');
  style.textContent = `
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--primary);
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 1000;
      animation: fadeInOut 3s ease forwards;
    }
    
    @keyframes fadeInOut {
      0% { opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { opacity: 0; display: none; }
    }
  `;
  
  document.head.appendChild(style);
  
  // Remove after animation
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

// Populate history list
function populateHistory(history) {
  elements.historyList.innerHTML = '';
  
  if (history.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-history">No questions solved yet.</div>';
    return;
  }
  
  // Sort by most recent first
  history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  history.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // Format date for display
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    // Create difficulty tag class
    const difficultyClass = `difficulty-${item.difficulty.toLowerCase()}`;
    
    historyItem.innerHTML = `
      <div class="history-item-header">
        <span class="history-item-title">${item.name}
          <span class="difficulty-tag ${difficultyClass}">${item.difficulty}</span>
        </span>
        <span class="history-item-date">Day ${item.day} | ${formattedDate}</span>
      </div>
      <div class="history-item-body">
        <div>Time: ${item.timeTaken} minutes</div>
        ${item.comments ? `<div>Notes: ${item.comments}</div>` : ''}
        ${item.revisionNeeded ? `<div class="needs-revision">⚠️ Needs revision</div>` : ''}
      </div>
    `;
    
    elements.historyList.appendChild(historyItem);
  });
}

// Filter history based on search term and day filter
function filterHistory() {
  const searchTerm = elements.searchQuestions.value.toLowerCase();
  const dayFilter = elements.filterDay.value;
  
  chrome.storage.local.get(['dsaQuestionHistory'], function(result) {
    let filteredHistory = result.dsaQuestionHistory || [];
    
    // Apply day filter
    if (dayFilter !== 'all') {
      filteredHistory = filteredHistory.filter(item => item.day === parseInt(dayFilter));
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredHistory = filteredHistory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.comments.toLowerCase().includes(searchTerm)
      );
    }
    
    populateHistory(filteredHistory);
  });
}

// Save settings
function saveSettings() {
  currentState.dailyTarget = parseInt(elements.dailyQuestionTarget.value);
  currentState.reminderTime = elements.reminderTime.value;
  currentState.enableNotifications = elements.enableNotifications.checked;
  
  saveState();
  updateUI();
  
  // Update alarm for reminder
  if (currentState.enableNotifications) {
    setReminderAlarm(currentState.reminderTime);
  } else {
    chrome.alarms.clear('dsaStudyReminder');
  }
  
  showNotification('Settings saved successfully!');
}

// Set reminder alarm
function setReminderAlarm(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  chrome.alarms.clear('dsaStudyReminder', () => {
    // Calculate when to fire the alarm
    const now = new Date();
    const reminderTime = new Date(now);
    reminderTime.setHours(hours, minutes, 0, 0);
    
    // If the time is already past for today, set it for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const delayInMinutes = (reminderTime - now) / (1000 * 60);
    
    // Create alarm
    chrome.alarms.create('dsaStudyReminder', {
      delayInMinutes,
      periodInMinutes: 24 * 60 // Daily
    });
  });
}

// Reset all progress
function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    chrome.storage.local.clear(() => {
      currentState = {
        currentDay: 1,
        dailyTarget: 5,
        solvedToday: 0,
        reminderTime: "09:00",
        enableNotifications: true,
        username: "Mangun10",
        currentDate: "2025-03-23"
      };
      
      updateUI();
      elements.historyList.innerHTML = '<div class="empty-history">No questions solved yet.</div>';
      showNotification('All progress has been reset.');
    });
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initializeExtension);