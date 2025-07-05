import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// For debugging - temporarily use memory server for stable operation
console.log("Using MongoDB Memory Server for development");

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    // Use in-memory MongoDB server for development
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`Using MongoDB Memory Server at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const db = mongoose.connection;