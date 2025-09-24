const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ msg: 'Missing fields' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });
  res.json({ token: jwt.sign({ uid: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '7d' }) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ msg: 'Invalid credentials' });
  res.json({ token: jwt.sign({ uid: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '7d' }) });
});

module.exports = router;
