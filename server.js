import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import { saveMessage } from './services/connectionService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/connections', connectionRoutes);

app.get('/', (req, res) => res.send('IdeaLink API running'));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (connectionId) => {
    socket.join(connectionId);
    console.log(`User ${socket.id} joined room: ${connectionId}`);
    const room = io.sockets.adapter.rooms.get(connectionId);
    console.log(`Room ${connectionId} now has ${room?.size} user(s)`);
  });

  socket.on('send_message', async ({ connectionId, senderId, text }) => {
    try {
      const message = await saveMessage(connectionId, senderId, text);
      io.to(connectionId).emit('receive_message', message);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('call_user', ({ connectionId, signal, from }) => {
    console.log('CALL SENT TO ROOM:', connectionId);
    const room = io.sockets.adapter.rooms.get(connectionId);
    console.log(`Room has ${room?.size} user(s) when call was made`);
    socket.to(connectionId).emit('incoming_call', { signal, from });
  });

  socket.on('accept_call', ({ connectionId, signal }) => {
    console.log('CALL ACCEPTED IN ROOM:', connectionId);
    socket.to(connectionId).emit('call_accepted', { signal });
  });

  socket.on('ice_candidate', ({ connectionId, candidate }) => {
    socket.to(connectionId).emit('ice_candidate', { candidate });
  });

  socket.on('end_call', ({ connectionId }) => {
    socket.to(connectionId).emit('call_ended');
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