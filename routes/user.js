const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, 'users.json');

const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users.json:', error);
  }
};

router.get('/', (req, res) => {
  const users = getUsers();
  res.json(users);
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: 'Email must be filled' });
  if (!password) return res.status(400).json({ error: 'Password must be filled' });

  const users = getUsers();

  const userExists = users.find(user => user.email === email);
  if (userExists) return res.status(400).json({ error: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ success: true, user: { email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find(user => user.email === email);
  if (!user) return res.status(401).json({ success: false, error: 'Invalid email or password' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ success: false, error: 'Invalid email or password' });

  res.status(200).json({ success: true });
});

module.exports = router;
