const express = require('express');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Middleware to verify token and extract user ID
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'secret');  // Assuming 'secret' is your JWT secret
    req.user = decoded;  // Store the decoded user data in req.user
    next();  // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create Transaction
router.post('/', authMiddleware, async (req, res) => {
  const { amount, transaction_type } = req.body;
  const user = req.user.id;  // Get user ID from decoded token
  const transaction = new Transaction({ amount, transaction_type, user });
  await transaction.save();
  res.status(201).json(transaction);
});

// Get User Transactions - Fetch transactions based on user ID from the token
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;  // Get user ID from the decoded token
  console.log(userId)

  try {
    // Find transactions associated with the user
    const transactions = await Transaction.find({ user: userId });

    // Return transactions to the frontend
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Transaction Status
router.put('/:transaction_id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.transaction_id, { status }, { new: true });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Transaction Details
router.get('/:transaction_id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transaction_id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Get user ID from the decoded token
  console.log(userId)

  try {
    // Find transactions associated with the user
    const transactions = await Transaction.find({ user: userId });

    // Find user details using the userId
    const user = await User.findById(userId);
    console.log(user)

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return transactions and user's name to the frontend
    res.json({ 
      transactions,
      userName: user.username // Assuming the user model has a 'name' field
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
