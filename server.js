const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dsa-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Define Schema
const ProblemSchema = new mongoose.Schema({
  day: Number,
  topic: String,
  questionName: String,
  difficulty: String,
  timeSpent: Number,
  comments: String,
  mistakes: String,
  revisionNeeded: Boolean,
  completedDate: { type: Date, default: Date.now },
  userId: String
});

const Problem = mongoose.model('Problem', ProblemSchema);

// Routes
app.get('/api/problems/:userId', async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.params.userId });
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/problems', async (req, res) => {
  try {
    const newProblem = new Problem({
      day: req.body.day,
      topic: req.body.topic,
      questionName: req.body.questionName,
      difficulty: req.body.difficulty,
      timeSpent: req.body.timeSpent,
      comments: req.body.comments || '',
      mistakes: req.body.mistakes || '',
      revisionNeeded: req.body.revisionNeeded || false,
      userId: req.body.userId
    });
    
    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/problems/stats/:userId', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayProblems = await Problem.countDocuments({
      userId: req.params.userId,
      completedDate: { $gte: today }
    });
    
    const totalProblems = await Problem.countDocuments({
      userId: req.params.userId
    });
    
    const easy = await Problem.countDocuments({
      userId: req.params.userId,
      difficulty: 'easy'
    });
    
    const medium = await Problem.countDocuments({
      userId: req.params.userId,
      difficulty: 'medium'
    });
    
    const hard = await Problem.countDocuments({
      userId: req.params.userId,
      difficulty: 'hard'
    });
    
    res.json({
      todayProblems,
      totalProblems,
      problemsByDifficulty: { easy, medium, hard }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});