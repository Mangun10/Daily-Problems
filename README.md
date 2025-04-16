

# DSA Study Plan Tracker - Chrome Extension

A Chrome extension to help you track and complete a structured 14-day Data Structures and Algorithms (DSA) study plan. This tool helps you stay consistent with your DSA practice by providing daily topic suggestions, tracking your solved problems, and visualizing your progress.

![DSA Study Plan Tracker](https://example.com/screenshot.png)

## Features

- **14-Day Structured Study Plan**: Complete curriculum covering essential DSA topics
- **Daily Problem Tracking**: Log problems you've solved with details like:
  - Difficulty level (Easy, Medium, Hard)
  - Time spent
  - Mistakes made
  - Comments and notes
  - Option to mark for revision
- **Progress Visualization**: Track your progress through the 14-day plan
- **Statistics**: View breakdown of problems by difficulty and day
- **Daily Reminders**: Chrome notifications to remind you to solve your daily problems
- **Custom Daily Targets**: Set your own daily problem-solving goals
- **Data Export**: Export your tracked data for further analysis

## Table of Contents

1. [Installation](#installation)
2. [Backend Setup](#backend-setup)
3. [How to Use](#how-to-use)
4. [Study Plan Curriculum](#study-plan-curriculum)
5. [Customization](#customization)
6. [Troubleshooting](#troubleshooting)
7. [Contributing](#contributing)
8. [License](#license)

## Installation

### Chrome Extension Setup

1. Clone this repository:
   ```
   git clone https://github.com/Mangun10/dsa-study-plan-tracker.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer Mode" (toggle in the top-right corner)

4. Click "Load unpacked" and select the extension directory

5. The extension icon should appear in your Chrome toolbar

### Backend Setup

The extension requires a backend server to store your progress data:

1. Navigate to the backend directory:
   ```
   cd dsa-study-plan-tracker/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install MongoDB if you haven't already:
   - [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

4. Start your MongoDB server:
   ```
   # On Windows
   "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="C:\data\db"
   
   # On macOS/Linux
   mongod --dbpath /data/db
   ```

5. Start the backend server:
   ```
   node server.js
   ```

6. The server will run at `http://localhost:3000`

## How to Use

### Getting Started

1. Click on the extension icon in your Chrome toolbar
2. The extension will automatically set today as Day 1 of your study plan
3. You'll see today's topic and suggested problems

### Tracking Problems

1. When you solve a problem:
   - Select the day (defaults to the current day)
   - Enter the problem name or select from suggested problems
   - Select the difficulty level
   - Enter the time spent (in minutes)
   - Add any comments or notes about your approach
   - Note any mistakes you made
   - Check "Revision Needed" if you want to revisit this problem later

2. Click "Submit" to save your progress

### Viewing Statistics

1. Click on the "Statistics" tab to view:
   - Today's solved problems vs. your daily target
   - Total problems solved
   - Breakdown by difficulty
   - Day-by-day progress visualization

### Customizing Your Study Plan

1. On the "Study Plan" tab:
   - Set your daily target number of problems
   - View suggested problems for each day

### Resetting Your Study Plan

If you want to restart the study plan from Day 1:

1. Go to the "Statistics" tab
2. Click the "Reset Study Plan" button
3. The plan will restart from Day 1 starting today

## Study Plan Curriculum

The 14-day study plan covers the following topics:

| Day | Topic | Focus Areas |
|-----|-------|-------------|
| 1 | Arrays & Strings | Basic operations, sliding window, two pointers |
| 2 | Recursion & Backtracking | Recursive thinking, base cases, backtracking framework |
| 3 | Linked Lists | Singly, Doubly, Fast & Slow Pointers, Cycle Detection |
| 4 | Stacks & Queues | Stack-based problems, monotonic stacks, queue operations |
| 5 | Hashing & Heaps | HashMaps, Priority Queues, Frequency Counting |
| 6 | Binary Trees & BST | DFS, BFS, Inorder, Preorder, Postorder, BST properties |
| 7 | Graphs (BFS & DFS) | Adjacency List, DFS, BFS, Cycle Detection |
| 8 | Dynamic Programming Basics | Top-Down vs Bottom-Up, Memoization |
| 9 | DP – Hard Problems | Knapsack, Subset Sum, Matrix DP |
| 10 | Greedy Algorithms | Greedy vs DP, Interval Scheduling |
| 11 | Sorting & Searching | Merge Sort, QuickSort, Binary Search Variations |
| 12 | Mock Test 1 | Comprehensive practice test |
| 13 | Mock Test 2 + Review | Speed optimization, revision |
| 14 | Final Revision | Pattern revision, common mistakes review |

## Customization

### Modifying the Study Plan

To customize the topics and problems in the study plan:

1. Edit the `studyPlan.js` file
2. Update the topics, descriptions, and suggested problems for each day
3. Reload the extension

### Changing the Backend URL

If you deploy your backend to a different server:

1. Update the `BACKEND_URL` variable in `popup.js`
2. Update the permissions in `manifest.json` to include your new domain

## Troubleshooting

### Extension Not Connecting to Backend

1. Make sure your backend server is running
2. Check if CORS is properly configured in your server
3. Verify the `BACKEND_URL` in `popup.js` matches your server address

### Data Not Saving

1. Check the browser console for any errors
2. Make sure MongoDB is running and accessible
3. Check the server logs for any database connection issues

### Reset Button Not Working

1. Make sure you've added the reset button to your HTML
2. Verify the event listener is properly set up in `popup.js`
3. Check the browser console for any JavaScript errors

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Created by [Mangun10](https://github.com/Mangun10) | 2025
