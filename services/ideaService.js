import Idea from '../models/Idea.js';

export const createIdea = async (userId, { title, description, category, skillsNeeded, country }) => {
  if (!title || !description || !category) throw new Error('Title, description and category are required');

  const idea = await Idea.create({
    title, description, category, skillsNeeded, country,
    author: userId,
  });
  return idea;
};

export const getAllIdeas = async ({ category, country, skill }) => {
  const filter = {};
  if (category) filter.category = category;
  if (country) filter.country = country;
  if (skill) filter.skillsNeeded = { $in: [skill] };

  return await Idea.find(filter)
    .populate('author', 'name country skills socials')
    .sort({ createdAt: -1 });
};

export const getIdeaById = async (ideaId) => {
  const idea = await Idea.findById(ideaId)
    .populate('author', 'name country skills socials');
  if (!idea) throw new Error('Idea not found');
  return idea;
};

export const updateIdea = async (userId, ideaId, updateData) => {
  const idea = await Idea.findById(ideaId);
  if (!idea) throw new Error('Idea not found');
  if (idea.author.toString() !== userId) throw new Error('Not authorized to edit this idea');

  return await Idea.findByIdAndUpdate(ideaId, updateData, { new: true });
};

export const deleteIdea = async (userId, ideaId) => {
  const idea = await Idea.findById(ideaId);
  if (!idea) throw new Error('Idea not found');
  if (idea.author.toString() !== userId) throw new Error('Not authorized to delete this idea');

  await idea.deleteOne();
  return { message: 'Idea deleted successfully' };
};