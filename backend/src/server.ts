import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import assignmentRoutes from './routes/assignmentRoutes';
import { startWorker } from './workers/generationWorker';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
export const io = new Server(server, {
  cors: {
    origin: '*', // For development
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

import multer from 'multer';
const pdfParse = require('pdf-parse');

// Routes
app.use('/api/assignments', assignmentRoutes);

// File Upload Route
const upload = multer({ storage: multer.memoryStorage() });
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    
    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString('utf8');
    }

    res.json({ text });
  } catch (err) {
    console.error('File parse error:', err);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vedaai';

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      // Start the background worker for AI generation
      startWorker();
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
