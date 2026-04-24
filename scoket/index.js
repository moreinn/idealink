import { saveMessage } from '../services/connectionService.js';

export const initSocket = (io) => {
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
      socket.to(connectionId).emit('incoming_call', { signal, from });
    });

    socket.on('accept_call', ({ connectionId, signal }) => {
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
};