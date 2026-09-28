import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { clientRoutes } from './routes/clientRoutes';
import { healthRoutes } from './routes/healthRoutes';
import { seedRoutes } from './routes/seedRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/seed', seedRoutes);

// Serve static frontend build if present (e.g. on Render or production deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 ClientPulse AI server is running on port ${PORT}`);
  console.log(`🧠 Hindsight Base URL: ${process.env.HINDSIGHT_BASE_URL}`);
  console.log(`⚡ Groq LLM Model: ${process.env.LLM_MODEL || 'openai/gpt-oss-120b'}`);
});
