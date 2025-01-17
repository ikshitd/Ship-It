import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.SERVER_PORT || 5002;
const SALT_ROUNDS = 10;
const SECRET = process.env.SECRET;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors()); // allow CORS for all express routes
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A user is connected with the id: ', socket.id);
  socket.on('joinBoard', (boardId) => {
    console.log(`User joined board: ${boardId}`);
    socket.join(`board-${boardId}`);
  });
  socket.on('taskMoved', async ({ boardId, taskId, newCategory }) => {
    try {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { taskCategory: newCategory },
      });
      io.to(`board-${boardId}`).emit('taskUpdated', updatedTask);
    } catch (err) {
      console.error('Error updating task category:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Taskplanner application!');
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

app.post('/add-task', authenticate, async (req, res) => {
  try {
    const { userId, boardId, columnId, taskDetails } = req.body;
    if (!userId || !boardId || !columnId || !taskDetails) {
      res.status(500).json({ error: 'Missing required fields' });
    }
    const board = await prisma.board.findFirst({ where: { id: boardId, userId: userId } });
    if (!board) {
      return res
        .status(404)
        .json({ error: `Board not found for the boardId: ${boardId} and userId: ${userId}` });
    }
    const newTask = await prisma.task.create({
      data: {
        heading: taskDetails.heading || 'Add Something!!',
        description: taskDetails.description || null,
        startDate: taskDetails.startDate ? new Date(taskDetails.startDate) : new Date(),
        dueDate: taskDetails.dueDate
          ? new Date(taskDetails.dueDate)
          : new Date(new Date().setDate(new Date().getDate() + 3)),
        priority: taskDetails.priority || 'Low',
        status: taskDetails.status || 'On_Track',
        taskCategory: columnId,
        assignee: taskDetails.assignee || 'Rufus',
        taskCategory: columnId,
        board: {
          connect: { id: boardId },
        },
      },
    });
    res.status(200).json({ message: 'Task added successfully', task: newTask });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while adding the task' });
  }
});

app.post('/update-task-category', authenticate, async (req, res) => {
  try {
    const { boardId, taskId, newCategory } = req.body;
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { tasks: true },
    });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    const task = board.tasks.find((t) => t.id === taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        taskCategory: newCategory,
      },
    });
    return res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while updating the task' });
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
