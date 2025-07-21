import { ChatRoom, Message } from './models';

export const clearAllChatData = async () => {
  try {
    console.log('Clearing all chat data...');
    
    // Delete all messages
    const deletedMessages = await Message.deleteMany({});
    console.log(`Deleted ${deletedMessages.deletedCount} messages`);
    
    // Delete all chat rooms
    const deletedChatRooms = await ChatRoom.deleteMany({});
    console.log(`Deleted ${deletedChatRooms.deletedCount} chat rooms`);
    
    console.log('All chat data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing chat data:', error);
    return false;
  }
};