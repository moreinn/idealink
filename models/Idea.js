import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  skillsNeeded: [String],
  country: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  postType: { type: String, enum: ['need', 'offer'], default: 'need' },
}, { timestamps: true });

export default mongoose.model('Idea', ideaSchema);