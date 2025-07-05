import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// For debugging
console.log("MONGODB_URI is set:", !!process.env.MONGODB_URI);

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    if (process.env.MONGODB_URI) {
      // Use provided MongoDB URI if available
      await mongoose.connect(process.env.MONGODB_URI);
    } else {
      // Use in-memory MongoDB server for development
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      console.log(`Using MongoDB Memory Server at ${mongoUri}`);
      await mongoose.connect(mongoUri);
    }
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error details:', error);
    console.log('Failed to connect to MongoDB. Using in-memory database instead.');
    process.exit(1);
  }
};

export const db = mongoose.connection;