// Set up daily reminder
chrome.runtime.onInstalled.addListener(() => {
  // Create an alarm that fires daily
  chrome.alarms.create('studyReminder', {
    periodInMinutes: 1440 // 24 hours
  });
  
  // Set default daily target
  chrome.storage.local.get(['dailyTarget'], (result) => {
    if (!result.dailyTarget) {
      chrome.storage.local.set({ dailyTarget: 5 });
    }
  });
});

// Listen for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'studyReminder') {
    // Show a notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon128.png',
      title: 'DSA Study Plan Reminder',
      message: 'Time to solve your daily DSA problems!',
      buttons: [
        { title: 'Open' }
      ],
      priority: 2
    });
  }
});

// Handle notification button click
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    chrome.action.openPopup();
  }
});