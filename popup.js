// Backend URL
const BACKEND_URL = 'http://localhost:3000';

// DOM Elements
const daySelect = document.getElementById('day');
const topicInput = document.getElementById('topic');
const questionNameInput = document.getElementById('question-name');
const suggestedQuestionsList = document.getElementById('suggested-questions');
const difficultySelect = document.getElementById('difficulty');
const timeSpentInput = document.getElementById('time-spent');
const commentsInput = document.getElementById('comments');
const mistakesInput = document.getElementById('mistakes');
const revisionNeededCheckbox = document.getElementById('revision-needed');
const solvedCountElement = document.getElementById('solved-count');
const totalCountElement = document.getElementById('total-count');
const dailyTargetElement = document.getElementById('daily-target');
const easyCountElement = document.getElementById('easy-count');
const mediumCountElement = document.getElementById('medium-count');
const hardCountElement = document.getElementById('hard-count');
const notificationElement = document.getElementById('notification');
const problemForm = document.getElementById('problem-form');
const selectDayElement = document.getElementById('select-day');
const dayProblemsElement = document.getElementById('day-problems');
const currentDayTopicElement = document.getElementById('current-day-topic');
const currentDayDescriptionElement = document.getElementById('current-day-description');
const targetProblemsInput = document.getElementById('target-problems');
const saveTargetButton = document.getElementById('save-target');
const dayProgressElement = document.getElementById('day-progress');
const exportDataButton = document.getElementById('export-data');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Get/generate user ID
function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['userId'], (result) => {
      if (result.userId) {
        resolve(result.userId);
      } else {
        // Generate a random user ID
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        chrome.storage.local.set({ userId }, () => {
          resolve(userId);
        });
      }
    });
  });
}

// Initialize the extension
async function initialize() {
  await loadDays();
  await updateStats();
  await loadCurrentDay();
  setupEventListeners();
}

// Load days into the select dropdown
async function loadDays() {
  const currentDayInfo = await getCurrentDayInfo();
  
  // Populate day select
  daySelect.innerHTML = '';
  selectDayElement.innerHTML = '';
  
  studyPlan.forEach(day => {
    const dayOption = document.createElement('option');
    dayOption.value = day.day;
    dayOption.textContent = `Day ${day.day}: ${day.topic}`;
    daySelect.appendChild(dayOption.cloneNode(true));
    selectDayElement.appendChild(dayOption);
  });
  
  // Set current day
  daySelect.value = currentDayInfo.day;
  selectDayElement.value = currentDayInfo.day;
  updateDayInfo(currentDayInfo.day);
}

// Update day information when day changes
function updateDayInfo(dayNumber) {
  const dayInfo = getDayInfo(parseInt(dayNumber));
  
  if (dayInfo) {
    topicInput.value = dayInfo.topic;
    
    // Update suggested questions
    suggestedQuestionsList.innerHTML = '';
    dayInfo.problems.forEach(problem => {
      const li = document.createElement('li');
      li.textContent = problem;
      li.addEventListener('click', () => {
        questionNameInput.value = problem;
      });
      suggestedQuestionsList.appendChild(li);
    });
    
    // Update day problems in plan tab
    dayProblemsElement.innerHTML = '';
    dayInfo.problems.forEach(problem => {
      const li = document.createElement('li');
      li.textContent = problem;
      dayProblemsElement.appendChild(li);
    });
  }
}

// Load current day info
async function loadCurrentDay() {
  const currentDayInfo = await getCurrentDayInfo();
  
  if (currentDayInfo) {
    currentDayTopicElement.textContent = `Day ${currentDayInfo.day}: ${currentDayInfo.topic}`;
    currentDayDescriptionElement.textContent = currentDayInfo.description;
  }
  
  // Get daily target
  chrome.storage.local.get(['dailyTarget'], (result) => {
    const dailyTarget = result.dailyTarget || 5;
    dailyTargetElement.textContent = dailyTarget;
    targetProblemsInput.value = dailyTarget;
  });
}

// Update statistics
async function updateStats() {
  const userId = await getUserId();
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/problems/stats/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    
    const stats = await response.json();
    
    // Update counters
    solvedCountElement.textContent = stats.todayProblems;
    totalCountElement.textContent = stats.totalProblems;
    easyCountElement.textContent = stats.problemsByDifficulty.easy;
    mediumCountElement.textContent = stats.problemsByDifficulty.medium;
    hardCountElement.textContent = stats.problemsByDifficulty.hard;
    
    // Update progress visualization
    updateProgressVisualization();
  } catch (error) {
    console.error('Error fetching stats:', error);
    showNotification('Failed to fetch statistics', true);
  }
}

// Update progress visualization
async function updateProgressVisualization() {
  const userId = await getUserId();
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/problems/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch problems');
    
    const problems = await response.json();
    
    // Count problems by day
    const problemsByDay = {};
    studyPlan.forEach(day => {
      problemsByDay[day.day] = 0;
    });
    
    problems.forEach(problem => {
      if (problemsByDay[problem.day] !== undefined) {
        problemsByDay[problem.day]++;
      }
    });
    
    // Update progress bars
    dayProgressElement.innerHTML = '';
    
    // Group days into two rows of 7
    for (let i = 1; i <= 14; i++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'day-progress-item';
      
      const dayLabel = document.createElement('div');
      dayLabel.className = 'day-label';
      dayLabel.textContent = `Day ${i}`;
      
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      
      const target = 5; // or get from storage
      const count = problemsByDay[i] || 0;
      const percentage = Math.min(100, (count / target) * 100);
      
      const progressFill = document.createElement('div');
      progressFill.className = 'progress-fill';
      progressFill.style.height = `${percentage}%`;
      
      const progressText = document.createElement('div');
      progressText.className = 'progress-text';
      progressText.textContent = count;
      
      progressBar.appendChild(progressFill);
      progressBar.appendChild(progressText);
      
      dayDiv.appendChild(dayLabel);
      dayDiv.appendChild(progressBar);
      
      dayProgressElement.appendChild(dayDiv);
    }
  } catch (error) {
    console.error('Error updating progress visualization:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Submit form
  problemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = await getUserId();
    
    const problemData = {
      day: parseInt(daySelect.value),
      topic: topicInput.value,
      questionName: questionNameInput.value,
      difficulty: difficultySelect.value,
      timeSpent: parseInt(timeSpentInput.value),
      comments: commentsInput.value,
      mistakes: mistakesInput.value,
      revisionNeeded: revisionNeededCheckbox.checked,
      userId
    };
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(problemData)
      });
      
      if (!response.ok) throw new Error('Failed to save problem');
      
      // Problem saved successfully
      showNotification('Problem saved successfully!');
      
      // Reset form
      questionNameInput.value = '';
      difficultySelect.value = 'easy';
      timeSpentInput.value = '';
      commentsInput.value = '';
      mistakesInput.value = '';
      revisionNeededCheckbox.checked = false;
      
      // Update stats
      updateStats();
    } catch (error) {
      console.error('Error saving problem:', error);
      showNotification('Failed to save problem. Please try again.', true);
    }
  });
  
  // Day selection change
  daySelect.addEventListener('change', () => {
    updateDayInfo(daySelect.value);
  });
  
  selectDayElement.addEventListener('change', () => {
    updateDayInfo(selectDayElement.value);
  });
  
  // Save daily target
  saveTargetButton.addEventListener('click', () => {
    const target = parseInt(targetProblemsInput.value);
    if (target > 0) {
      chrome.storage.local.set({ dailyTarget: target }, () => {
        dailyTargetElement.textContent = target;
        showNotification('Daily target updated!');
        updateStats(); // Refresh progress bars
      });
    }
  });
  
  // Export data
  exportDataButton.addEventListener('click', async () => {
    const userId = await getUserId();
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/problems/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch problems');
      
      const problems = await response.json();
      
      // Create data URL for export
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(problems, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "dsa_study_data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
      showNotification('Failed to export data', true);
    }
  });
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      
      // Update active button
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Update active content
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tab}-tab`).classList.add('active');
      
      // If switching to stats tab, refresh stats
      if (tab === 'stats') {
        updateStats();
      }
    });
  });
}

// Show notification
function showNotification(message, isError = false) {
  notificationElement.textContent = message;
  notificationElement.className = 'notification';
  notificationElement.classList.add(isError ? 'error' : 'success');
  notificationElement.style.display = 'block';
  
  setTimeout(() => {
    notificationElement.style.display = 'none';
  }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initialize);