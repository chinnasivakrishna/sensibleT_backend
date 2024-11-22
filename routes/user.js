const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username,email, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});



module.exports = router;
