import { connectDB } from '../server/db';
import { ChatRoom, Message, Vehicle } from '../server/models';

const clearAllData = async () => {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Clear all chat data
    console.log('Clearing all chat data...');
    const deletedMessages = await Message.deleteMany({});
    console.log(`Deleted ${deletedMessages.deletedCount} messages`);
    
    const deletedChatRooms = await ChatRoom.deleteMany({});
    console.log(`Deleted ${deletedChatRooms.deletedCount} chat rooms`);
    
    // Clear all vehicles to fix price issues
    console.log('Clearing all vehicles...');
    const deletedVehicles = await Vehicle.deleteMany({});
    console.log(`Deleted ${deletedVehicles.deletedCount} vehicles`);
    
    console.log('All data cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

clearAllData();