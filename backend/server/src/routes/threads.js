const router = require('express').Router();
const auth = require('../middleware/auth');
const Thread = require('../models/Thread');
const Post = require('../models/Post');

module.exports = (io) => {
  router.get('/', async (req, res) => {
    const { category, q, tag, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };
    const threads = await Thread.find(filter)
      .sort({ lastActivityAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'username avatarUrl');
    res.json(threads);
  });

  router.post('/', auth, async (req, res) => {
    const { title, body, category, tags = [] } = req.body;
    const thread = await Thread.create({ title, body, category, tags, author: req.user.uid });
    res.status(201).json(thread);
  });

  router.get('/:id', async (req, res) => {
    const thread = await Thread.findById(req.params.id)
      .populate('author', 'username avatarUrl');
    if (!thread) return res.status(404).json({ msg: 'Not found' });
    const posts = await Post.find({ thread: thread._id })
      .sort({ createdAt: 1 })
      .populate('author', 'username avatarUrl');
    res.json({ thread, posts });
  });

  router.post('/:id/posts', auth, async (req, res) => {
    const post = await Post.create({ thread: req.params.id, author: req.user.uid, body: req.body.body });
    await Thread.findByIdAndUpdate(req.params.id, { lastActivityAt: new Date() });
    io.emit('post:new', { threadId: req.params.id, postId: post._id }); // realtime ping
    res.status(201).json(post);
  });

  return router;
};
