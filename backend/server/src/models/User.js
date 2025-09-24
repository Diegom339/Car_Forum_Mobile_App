const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, trim: true, required: true },
  email:    { type: String, unique: true, trim: true, required: true },
  passwordHash: { type: String, required: true },
  roles:   { type: [String], default: ['user'] }, // user, mod, admin
  bio:     { type: String, default: '' },
  avatarUrl: String,
  stats: { threads: { type: Number, default: 0 }, posts: { type: Number, default: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
