import * as ideaService from '../services/ideaService.js';

export const createIdea = async (req, res) => {
  try {
    const idea = await ideaService.createIdea(req.user.id, req.body);
    res.status(201).json(idea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getIdeas = async (req, res) => {
  try {
    const ideas = await ideaService.getAllIdeas(req.query);
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIdea = async (req, res) => {
  try {
    const idea = await ideaService.getIdeaById(req.params.id);
    res.json(idea);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const idea = await ideaService.updateIdea(req.user.id, req.params.id, req.body);
    res.json(idea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    const result = await ideaService.deleteIdea(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};