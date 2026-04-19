import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema({
  url: { type: String, default: '' },
  verified: { type: Boolean, default: false },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [String],

  socials: {
    linkedin:  { type: socialSchema, default: () => ({}) },
    instagram: { type: socialSchema, default: () => ({}) },
    x:         { type: socialSchema, default: () => ({}) },
    portfolio: { type: socialSchema, default: () => ({}) },
    github:    { type: socialSchema, default: () => ({}) },
  },

}, { timestamps: true });

export default mongoose.model('User', userSchema);