import app from './app';
import { env } from './config/env';

const startServer = () => {
  try {
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      console.log(`🩺 Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
    });

    // Handle graceful shutdown
    const shutdown = () => {
      console.log(' shutting down gracefully...');
      server.close(() => {
        console.log('Closed out remaining connections.');
        process.exit(0);
      });

      // Force close if it takes too long
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
