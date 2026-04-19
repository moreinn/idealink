import * as connectionService from '../services/connectionService.js';

export const sendRequest = async (req, res) => {
  try {
    const connection = await connectionService.sendRequest(req.user.id, req.body);
    res.status(201).json(connection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status))
      return res.status(400).json({ message: 'Status must be accepted or declined' });

    const connection = await connectionService.respondToRequest(
      req.user.id, req.params.id, status
    );
    res.json(connection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyConnections = async (req, res) => {
  try {
    const connections = await connectionService.getMyConnections(req.user.id);
    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await connectionService.getMyRequests(req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await connectionService.getMessages(req.params.id, req.user.id);
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};