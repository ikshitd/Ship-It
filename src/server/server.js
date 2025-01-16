import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.SERVER_PORT || 5002;
const SALT_ROUNDS = 10;
const SECRET = process.env.SECRET;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors()); // allow CORS for all express routes

app.get('/', (req, res) => {
  res.send('Welcome to the Taskplanner application!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/* Middleware for authentication */
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/tasks', authenticate, async (req, res) => {
  const task = await prisma.task.findMany();
  res.json(task);
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/boards', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const boards = await prisma.board.findMany({ where: { userId: userId }, include: { tasks: true } });
    res.json(boards);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Error fetching boards for userId: ${req.userId}` });
  }
});

app.post('/add-board', authenticate, async (req, res) => {
  const { userId, boardName } = req.body;
  if (!userId || !boardName) {
    return res.status(400).json({ error: 'userId and boardName, both are required' });
  }
  try {
    const newBoard = await prisma.board.create({
      data: {
        name: boardName,
        userId: userId,
        tasks: {},
      },
    });
    res.status(200).json(newBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create board' });
  }
});
