// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  // Initialize storage with default values if needed
  chrome.storage.local.get(['dsaStudyState'], function(result) {
    if (!result.dsaStudyState) {
      const defaultState = {
        currentDay: 1,
        dailyTarget: 5,
        solvedToday: 0,
        reminderTime: "09:00",
        enableNotifications: true,
        username: "Mangun10",
        currentDate: new Date().toISOString().split('T')[0]
      };
      
      chrome.storage.local.set({ dsaStudyState: defaultState });
    }
  });
  
  // Set up initial alarm
  setDailyReminderAlarm();
});

// Listen for alarms
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'dsaStudyReminder') {
    // Show notification
    chrome.storage.local.get(['dsaStudyState'], function(result) {
      if (result.dsaStudyState && result.dsaStudyState.enableNotifications) {
        const state = result.dsaStudyState;
        const currentDayIndex = state.currentDay - 1;
        
        // Study plan data
        const studyPlan = [
          { day: 1, title: "Arrays & Strings" },
          { day: 2, title: "Recursion & Backtracking" },
          { day: 3, title: "Linked Lists" },
          { day: 4, title: "Stacks & Queues" },
          { day: 5, title: "Hashing & Heaps" },
          { day: 6, title: "Binary Trees & BST" },
          { day: 7, title: "Graphs (BFS & DFS)" },
          { day: 8, title: "Dynamic Programming Basics" },
          { day: 9, title: "DP – Hard Problems" },
          { day: 10, title: "Greedy Algorithms" },
          { day: 11, title: "Sorting & Searching" },
          { day: 12, title: "Mock Test 1" },
          { day: 13, title: "Mock Test 2 + Review" },
          { day: 14, title: "Final Revision & Quick Tricks" }
        ];
        
        const dayTitle = studyPlan[currentDayIndex].title;
        const remaining = Math.max(0, state.dailyTarget - state.solvedToday);
        
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon128.png',
          title: `DSA Study Reminder: Day ${state.currentDay}`,
          message: `Today's topic: ${dayTitle}. You still need to solve ${remaining} problems to reach your goal!`,
          priority: 2
        });
      }
    });
  } else if (alarm.name === 'dailyReset') {
    // Reset the daily solved count and possibly advance to next day
    resetDailyProgress();
  }
});

// Set daily study reminder alarm
function setDailyReminderAlarm() {
  chrome.storage.local.get(['dsaStudyState'], function(result) {
    if (result.dsaStudyState && result.dsaStudyState.enableNotifications) {
      const timeString = result.dsaStudyState.reminderTime || "09:00";
      const [hours, minutes] = timeString.split(':').map(Number);
      
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
    }
  });
  
  // Also set up the daily reset alarm (midnight)
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  midnight.setDate(midnight.getDate() + 1); // Next day at midnight
  
  const delayToMidnight = (midnight - now) / (1000 * 60);
  
  chrome.alarms.create('dailyReset', {
    delayInMinutes: delayToMidnight,
    periodInMinutes: 24 * 60 // Daily
  });
}

// Reset daily progress at midnight
function resetDailyProgress() {
  chrome.storage.local.get(['dsaStudyState', 'dsaQuestionHistory'], function(result) {
    if (result.dsaStudyState) {
      const state = result.dsaStudyState;
      
      // Check if we need to advance to the next day
      // Logic: If they completed the target OR it's been more than a day since last reset
      const shouldAdvanceDay = state.solvedToday >= state.dailyTarget;
      
      // Update the state
      state.solvedToday = 0;
      state.currentDate = new Date().toISOString().split('T')[0];
      
      if (shouldAdvanceDay && state.currentDay < 14) {
        state.currentDay++;
      }
      
      // Save updated state
      chrome.storage.local.set({ dsaStudyState: state });
    }
  });
}

// Connect to a backend server (implement this as needed)
function syncWithBackend(data) {
  // This is where you would implement the logic to send data to your backend
  // Example using fetch:
  /*
  fetch('https://your-backend-server.com/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
}