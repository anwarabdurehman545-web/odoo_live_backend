
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User amaa qabamuun galmaa'eera!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      message: "User milkaa'inaans galmaa'eera!", 
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ykn Password dogoggora!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ykn Password dogoggora!' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      message: "Login milkaa'inaans ta'eera!", 
      token,
      user: { id: user._id, username: user.username, email: user.email } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Protected Profile Route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      message: "Protected route milkaa'inaans qaqqabameera!",
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
