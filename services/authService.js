import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async ({ name, email, password, country, skills, bio, socials }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, country, skills, bio, socials });

  return {
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  return {
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  };
};

export const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

export const updateMyProfile = async (userId, { name, country, bio, skills, socials }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name, country, bio, skills, socials },
    { new: true }
  ).select('-password');
  return user;
};

export const getPublicProfile = async (userId) => {
  const user = await User.findById(userId).select('-password -email');
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserSocial = async (userId, { platform, url }) => {
  const allowed = ['linkedin', 'instagram', 'x', 'portfolio', 'github'];
  if (!allowed.includes(platform)) throw new Error('Invalid platform');

  const update = {
    [`socials.${platform}.url`]: url,
    [`socials.${platform}.verified`]: false,
  };

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  ).select('-password');

  return user;
};