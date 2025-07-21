import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    // Try Atlas connection first
    try {
      console.log(`Connecting to MongoDB Atlas...`);
      await mongoose.connect(mongoUri);
      console.log('MongoDB Atlas connected successfully');
      return;
    } catch (error) {
      console.error('MongoDB Atlas connection failed:', error);
      console.log('Note: Please check your MongoDB Atlas network access settings');
      console.log('Falling back to Memory Server for development...');
    }
    
    // Fallback to Memory Server
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('MongoDB Memory Server connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const db = mongoose.connection;