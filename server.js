import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import { saveMessage } from './services/connectionService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/connections', connectionRoutes);

app.get('/', (req, res) => res.send('IdeaLink API running'));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Socket.io — real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // join a chat room for a connection
  socket.on('join_room', (connectionId) => {
    socket.join(connectionId);
    console.log(`Socket ${socket.id} joined room ${connectionId}`);
  });

  // send a message
  socket.on('send_message', async ({ connectionId, senderId, text }) => {
    try {
      const message = await saveMessage(connectionId, senderId, text);
      io.to(connectionId).emit('receive_message', message);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

if (!mongoUri) {
  console.error('MONGO_URI is not set. Check your .env file.');
  process.exit(1);
}

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();