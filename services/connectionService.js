import Connection from '../models/Connection.js';
import Message from '../models/Message.js';

export const sendRequest = async (senderId, { receiverId, ideaId }) => {
  if (senderId === receiverId) throw new Error('You cannot connect with yourself');

  const existing = await Connection.findOne({
    sender: senderId,
    receiver: receiverId,
    idea: ideaId,
  });
  if (existing) throw new Error('Request already sent');

  const connection = await Connection.create({
    sender: senderId,
    receiver: receiverId,
    idea: ideaId,
  });
  return connection;
};

export const respondToRequest = async (userId, connectionId, status) => {
  const connection = await Connection.findById(connectionId);
  if (!connection) throw new Error('Connection not found');
  if (connection.receiver.toString() !== userId)
    throw new Error('Not authorized');
  if (connection.status !== 'pending')
    throw new Error('Request already responded to');

  connection.status = status;
  await connection.save();
  return connection;
};

export const getMyConnections = async (userId) => {
  return await Connection.find({
    $or: [{ sender: userId }, { receiver: userId }],
    status: 'accepted',
  })
    .populate('sender', 'name country skills socials')
    .populate('receiver', 'name country skills socials')
    .populate('idea', 'title category');
};

export const getMyRequests = async (userId) => {
  return await Connection.find({ receiver: userId, status: 'pending' })
    .populate('sender', 'name country skills socials')
    .populate('idea', 'title category');
};

export const saveMessage = async (connectionId, senderId, text) => {
  const connection = await Connection.findById(connectionId);
  if (!connection) throw new Error('Connection not found');
  if (connection.status !== 'accepted') throw new Error('Connection not accepted yet');

  const isParticipant =
    connection.sender.toString() === senderId ||
    connection.receiver.toString() === senderId;
  if (!isParticipant) throw new Error('Not part of this connection');

  return await Message.create({ connection: connectionId, sender: senderId, text });
};

export const getMessages = async (connectionId, userId) => {
  const connection = await Connection.findById(connectionId);
  if (!connection) throw new Error('Connection not found');

  const isParticipant =
    connection.sender.toString() === userId ||
    connection.receiver.toString() === userId;
  if (!isParticipant) throw new Error('Not authorized');

  return await Message.find({ connection: connectionId })
    .populate('sender', 'name')
    .sort({ createdAt: 1 });
};