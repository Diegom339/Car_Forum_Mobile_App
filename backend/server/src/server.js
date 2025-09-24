require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const threadRoutes = require('./routes/threads');
const categoryRoutes = require('./routes/categories');
const meRoutes = require('./routes/me');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.WEB_ORIGIN || '*' } });

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(fileUpload());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/threads', threadRoutes(io)); // inject io for live events
app.use('/api', meRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`API running on :${port}`));
})();
