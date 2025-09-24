const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body:   { type: String, required: true },
  images: [String],
  editedAt: Date,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

PostSchema.index({ body: 'text' });
module.exports = mongoose.model('Post', PostSchema);
