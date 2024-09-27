import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json()); // Use express.json() for parsing JSON bodies

// Routes
app.use('/', router); // No need for parentheses, just use the router directly

// Server creation
const server = http.createServer(app);

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

// MongoDB connection
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('MongoDB connection string not provided!');
  process.exit(1); // Exit if no connection string is found
}

mongoose.Promise = Promise;

mongoose
  .connect(mongoUrl) // No need for useNewUrlParser and useUnifiedTopology
  .then(() => console.log('Database connected'))
  .catch((error: Error) => {
    console.error('Error connecting to DB:', error);
    process.exit(1);
  });

// Graceful shutdown on termination signals
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');

  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected on app termination');
  } catch (err) {
    console.error('Error while closing MongoDB connection:', err);
  } finally {
    process.exit(0);
  }
};

// Handle termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Handle MongoDB connection errors
mongoose.connection.on('error', (error: Error) =>
  console.error('MongoDB connection error:', error),
);
