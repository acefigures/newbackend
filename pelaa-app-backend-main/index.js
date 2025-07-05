
import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import { connectMongoDB } from "./services/db.js";
import router from "./routes/routes.js";

const runMain = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Connect to MongoDB
  await connectMongoDB();

  // Middleware setup
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/api', router);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'PlaygroundApp API is running',
      timestamp: new Date().toISOString()
    });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to PlaygroundApp API',
      version: '1.0.0',
      endpoints: {
        getAllGrounds: 'GET /api/grounds',
        searchGrounds: 'GET /api/grounds/search?name=&area=&type=',
        getNearbyPlaces: 'GET /api/nearby?lat=&lng=&maxDistance='
      }
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });

  // Global error handler
  app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  });

  // Start server
  app.listen(port, () => {
    console.log(`🚀 PlaygroundApp API running on port ${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Access at: http://0.0.0.0:${port}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⏹️ SIGTERM received, shutting down gracefully');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('⏹️ SIGINT received, shutting down gracefully');
    process.exit(0);
  });
};

runMain().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
