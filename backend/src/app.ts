import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Express = express();

// Security & Base Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Request parsers with sensible limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging for development
if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use(env.API_PREFIX, apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
