import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const db = mongoose.connection;