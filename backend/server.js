const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Helper = require('./models/Helper');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// GET /api/helpers
app.get('/api/helpers', async (req, res) => {
  try {
    const helpers = await Helper.find();
    res.json(helpers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch helpers' });
  }
});

// POST /api/progress
app.post('/api/progress', async (req, res) => {
  const { username, starsEarned } = req.body;
  if (!username || typeof starsEarned !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, starsEarned });
    } else {
      user.starsEarned = starsEarned;
    }
    await user.save();
    res.json({ message: 'Progress saved', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
