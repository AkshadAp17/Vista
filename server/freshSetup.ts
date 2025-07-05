import bcrypt from 'bcryptjs';
import { User, Vehicle, ChatRoom, Message, Favorite } from './models';

export const setupFreshChatSystem = async () => {
  try {
    console.log('Setting up fresh chat system...');

    // Clear all existing chat data
    await Message.deleteMany({});
    await ChatRoom.deleteMany({});
    console.log('Cleared old chat data');

    // Create fresh test users with verified accounts
    const hashedPassword = await bcrypt.hash('test123', 10);

    const testUsers = [
      {
        id: 'buyer-001',
        email: 'buyer1@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Buyer',
        phoneNumber: '+91 9876543220',
        isAdmin: false,
        isEmailVerified: true,
      },
      {
        id: 'buyer-002',
        email: 'buyer2@example.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Customer',
        phoneNumber: '+91 9876543221',
        isAdmin: false,
        isEmailVerified: true,
      },
      {
        id: 'seller-001',
        email: 'seller1@example.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Seller',
        phoneNumber: '+91 9876543222',
        isAdmin: false,
        isEmailVerified: true,
      }
    ];

    // Remove existing test users
    await User.deleteMany({ email: { $regex: '@example\\.com$' } });
    
    // Create new test users
    const createdUsers = await User.insertMany(testUsers);
    console.log(`Created ${createdUsers.length} fresh test users for chat testing`);

    // Get existing vehicles to create chat rooms
    const vehicles = await Vehicle.find({ isActive: true }).limit(3);
    
    if (vehicles.length > 0) {
      // Create sample chat rooms between different users and vehicles
      const sampleChatRooms = [];
      
      // Buyer 1 interested in vehicle 1
      if (vehicles[0]) {
        sampleChatRooms.push({
          vehicleId: vehicles[0]._id.toString(),
          buyerId: 'buyer-001',
          sellerId: vehicles[0].sellerId,
          isActive: true
        });
      }
      
      // Buyer 2 interested in vehicle 2  
      if (vehicles[1]) {
        sampleChatRooms.push({
          vehicleId: vehicles[1]._id.toString(),
          buyerId: 'buyer-002',
          sellerId: vehicles[1].sellerId,
          isActive: true
        });
      }

      const createdChatRooms = await ChatRoom.insertMany(sampleChatRooms);
      console.log(`Created ${createdChatRooms.length} fresh chat rooms`);

      // Create sample messages for the chat rooms
      const sampleMessages = [
        {
          chatRoomId: createdChatRooms[0]._id.toString(),
          senderId: 'buyer-001',
          content: 'Hi! Is this vehicle still available?',
          messageType: 'text'
        },
        {
          chatRoomId: createdChatRooms[0]._id.toString(),
          senderId: vehicles[0].sellerId,
          content: 'Yes, it\'s available. Would you like to see it?',
          messageType: 'text'
        },
        {
          chatRoomId: createdChatRooms[0]._id.toString(),
          senderId: 'buyer-001',
          content: 'What\'s your best price?',
          messageType: 'text'
        }
      ];

      if (createdChatRooms[1]) {
        sampleMessages.push({
          chatRoomId: createdChatRooms[1]._id.toString(),
          senderId: 'buyer-002',
          content: 'Can I get more details about the engine condition?',
          messageType: 'text'
        });
      }

      const createdMessages = await Message.insertMany(sampleMessages);
      console.log(`Created ${createdMessages.length} fresh sample messages`);
    }

    console.log('Fresh chat system setup completed successfully!');
    return {
      success: true,
      users: testUsers.map(u => ({ email: u.email, password: 'test123' })),
      message: 'Fresh chat system with new users and conversations created'
    };

  } catch (error: any) {
    console.error('Error setting up fresh chat system:', error);
    return { success: false, error: error.message };
  }
};