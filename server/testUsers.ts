import bcrypt from 'bcryptjs';
import { User, Vehicle, ChatRoom, Message, Favorite } from './models';

export const createTestUsers = async () => {
  try {
    console.log('Creating verified test users...');

    // Create verified test users with simple passwords for testing
    const hashedPassword = await bcrypt.hash('test123', 10);

    const testUsers = [
      {
        id: 'test-buyer-001',
        email: 'buyer1@test.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Buyer',
        phoneNumber: '+91 9876543215',
        isAdmin: false,
        isEmailVerified: true, // Pre-verified for testing
      },
      {
        id: 'test-buyer-002',
        email: 'buyer2@test.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Customer',
        phoneNumber: '+91 9876543216',
        isAdmin: false,
        isEmailVerified: true, // Pre-verified for testing
      },
      {
        id: 'test-seller-001',
        email: 'seller1@test.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Seller',
        phoneNumber: '+91 9876543217',
        isAdmin: false,
        isEmailVerified: true, // Pre-verified for testing
      }
    ];

    // Remove existing test users
    await User.deleteMany({ email: { $regex: '@test\\.com$' } });
    
    // Create new test users
    const createdUsers = await User.insertMany(testUsers);
    console.log(`Created ${createdUsers.length} verified test users`);

    return {
      buyer1: testUsers[0],
      buyer2: testUsers[1],
      seller1: testUsers[2]
    };
  } catch (error) {
    console.error('Error creating test users:', error);
    return null;
  }
};