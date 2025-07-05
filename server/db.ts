import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    const mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri && mongoUri.includes('mongodb+srv')) {
      // Try to connect to MongoDB Atlas first
      try {
        console.log(`Connecting to MongoDB Atlas...`);
        await mongoose.connect(mongoUri);
        console.log('MongoDB Atlas connected successfully');
        return;
      } catch (atlasError) {
        console.warn('MongoDB Atlas connection failed, falling back to Memory Server:', atlasError.message);
      }
    }
    
    // Fallback to MongoDB Memory Server
    console.log("Using MongoDB Memory Server for development");
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    console.log(`Using MongoDB Memory Server at ${memoryUri}`);
    await mongoose.connect(memoryUri);
    console.log('MongoDB Memory Server connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const db = mongoose.connection;