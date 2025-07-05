import bcrypt from 'bcryptjs';
import { User, Vehicle, ChatRoom, Message, Favorite } from './models';

export const createSampleData = async () => {
  try {
    console.log('Setting up sample data...');

    // Clear existing data
    await User.deleteMany({ email: { $ne: process.env.ADMIN_EMAIL } });
    await Vehicle.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});
    await Favorite.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const sampleUsers = [
      {
        id: 'user-001',
        email: 'rajesh.kumar@example.com',
        password: hashedPassword,
        firstName: 'Rajesh',
        lastName: 'Kumar',
        phoneNumber: '+91 9876543210',
        isAdmin: false,
        isEmailVerified: true,
      },
      {
        id: 'user-002',
        email: 'priya.sharma@example.com',
        password: hashedPassword,
        firstName: 'Priya',
        lastName: 'Sharma',
        phoneNumber: '+91 9876543211',
        isAdmin: false,
        isEmailVerified: true,
      },
      {
        id: 'user-003',
        email: 'amit.patel@example.com',
        password: hashedPassword,
        firstName: 'Amit',
        lastName: 'Patel',
        phoneNumber: '+91 9876543212',
        isAdmin: false,
        isEmailVerified: true,
      },
      {
        id: 'user-004',
        email: 'sneha.singh@example.com',
        password: hashedPassword,
        firstName: 'Sneha',
        lastName: 'Singh',
        phoneNumber: '+91 9876543213',
        isAdmin: false,
        isEmailVerified: true,
      },
      {
        id: 'user-005',
        email: 'vikram.gupta@example.com',
        password: hashedPassword,
        firstName: 'Vikram',
        lastName: 'Gupta',
        phoneNumber: '+91 9876543214',
        isAdmin: false,
        isEmailVerified: true,
      }
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} sample users`);

    // Create sample vehicles with easy ID numbering
    const sampleVehicles = [
      {
        sellerId: 'user-001',
        brand: 'Honda',
        model: 'Activa 6G',
        year: 2023,
        price: 75000,
        vehicleNumber: 'VH001',
        engineCapacity: '109.51cc',
        fuelType: 'Petrol',
        kmDriven: 2500,
        location: 'Mumbai, Maharashtra',
        description: 'Well-maintained Honda Activa 6G in excellent condition. Single owner, all service records available.',
        condition: 'Excellent',
        isActive: true,
        isFeatured: true,
        vehicleType: 'Scooter',
        images: []
      },
      {
        sellerId: 'user-002',
        brand: 'Yamaha',
        model: 'FZ-S V3.0',
        year: 2022,
        price: 110000,
        vehicleNumber: 'VH002',
        engineCapacity: '149cc',
        fuelType: 'Petrol',
        kmDriven: 8500,
        location: 'Delhi, Delhi',
        description: 'Sporty Yamaha FZ-S with aggressive styling. Great for city rides and weekend touring.',
        condition: 'Good',
        isActive: true,
        isFeatured: false,
        vehicleType: 'Motorcycle',
        images: []
      },
      {
        sellerId: 'user-003',
        brand: 'Ather',
        model: '450X Gen 3',
        year: 2023,
        price: 140000,
        vehicleNumber: 'VH003',
        engineCapacity: 'Electric',
        fuelType: 'Electric',
        kmDriven: 1200,
        location: 'Bangalore, Karnataka',
        description: 'Latest Ather 450X electric scooter with smart features. Fast charging and long range.',
        condition: 'Excellent',
        isActive: true,
        isFeatured: true,
        vehicleType: 'Electric Scooter',
        images: []
      },
      {
        sellerId: 'user-001',
        brand: 'TVS',
        model: 'Apache RTR 160 4V',
        year: 2021,
        price: 95000,
        vehicleNumber: 'VH004',
        engineCapacity: '159.7cc',
        fuelType: 'Petrol',
        kmDriven: 15000,
        location: 'Chennai, Tamil Nadu',
        description: 'Performance-oriented TVS Apache with race-tuned suspension. Perfect for enthusiasts.',
        condition: 'Good',
        isActive: true,
        isFeatured: false,
        vehicleType: 'Motorcycle',
        images: []
      },
      {
        sellerId: 'user-004',
        brand: 'Hero',
        model: 'Splendor Plus',
        year: 2020,
        price: 65000,
        vehicleNumber: 'VH005',
        engineCapacity: '97.2cc',
        fuelType: 'Petrol',
        kmDriven: 25000,
        location: 'Pune, Maharashtra',
        description: 'Reliable Hero Splendor Plus, perfect for daily commuting. Very fuel efficient.',
        condition: 'Fair',
        isActive: true,
        isFeatured: false,
        vehicleType: 'Motorcycle',
        images: []
      },
      {
        sellerId: 'user-005',
        brand: 'Suzuki',
        model: 'Gixxer SF 250',
        year: 2023,
        price: 185000,
        vehicleNumber: 'VH006',
        engineCapacity: '249cc',
        fuelType: 'Petrol',
        kmDriven: 3500,
        location: 'Hyderabad, Telangana',
        description: 'Premium Suzuki Gixxer SF with full fairing. Excellent build quality and performance.',
        condition: 'Excellent',
        isActive: true,
        isFeatured: true,
        vehicleType: 'Motorcycle',
        images: []
      },
      {
        sellerId: 'user-002',
        brand: 'Bajaj',
        model: 'Chetak Electric',
        year: 2022,
        price: 125000,
        vehicleNumber: 'VH007',
        engineCapacity: 'Electric',
        fuelType: 'Electric',
        kmDriven: 4200,
        location: 'Jaipur, Rajasthan',
        description: 'Classic design meets modern technology. Bajaj Chetak electric with retro styling.',
        condition: 'Good',
        isActive: true,
        isFeatured: false,
        vehicleType: 'Electric Scooter',
        images: []
      },
      {
        sellerId: 'user-003',
        brand: 'KTM',
        model: 'Duke 200',
        year: 2021,
        price: 145000,
        vehicleNumber: 'VH008',
        engineCapacity: '199.5cc',
        fuelType: 'Petrol',
        kmDriven: 12000,
        location: 'Kolkata, West Bengal',
        description: 'Aggressive KTM Duke 200 with sharp handling. Perfect for urban riding and weekend trips.',
        condition: 'Good',
        isActive: true,
        isFeatured: false,
        vehicleType: 'Motorcycle',
        images: []
      },
      {
        sellerId: 'user-004',
        brand: 'Honda',
        model: 'CB Shine SP',
        year: 2022,
        price: 78000,
        vehicleNumber: 'VH009',
        engineCapacity: '124cc',
        fuelType: 'Petrol',
        kmDriven: 6500,
        location: 'Ahmedabad, Gujarat',
        description: 'Honda CB Shine SP with reliable engine and comfortable riding position.',
        condition: 'Good',
        isActive: true,
        isFeatured: false,
        vehicleType: 'Motorcycle',
        images: []
      },
      {
        sellerId: 'user-005',
        brand: 'Ola',
        model: 'S1 Pro',
        year: 2023,
        price: 115000,
        vehicleNumber: 'VH010',
        engineCapacity: 'Electric',
        fuelType: 'Electric',
        kmDriven: 800,
        location: 'Gurgaon, Haryana',
        description: 'Latest Ola S1 Pro electric scooter with app connectivity and fast charging.',
        condition: 'Excellent',
        isActive: true,
        isFeatured: true,
        vehicleType: 'Electric Scooter',
        images: []
      }
    ];

    const createdVehicles = await Vehicle.insertMany(sampleVehicles);
    console.log(`Created ${createdVehicles.length} sample vehicles`);

    // Create sample chat rooms and messages
    const sampleChatRooms = [
      {
        vehicleId: createdVehicles[0]._id.toString(),
        buyerId: 'user-002',
        sellerId: 'user-001',
        isActive: true
      },
      {
        vehicleId: createdVehicles[1]._id.toString(),
        buyerId: 'user-003',
        sellerId: 'user-002',
        isActive: true
      },
      {
        vehicleId: createdVehicles[2]._id.toString(),
        buyerId: 'user-001',
        sellerId: 'user-003',
        isActive: true
      }
    ];

    const createdChatRooms = await ChatRoom.insertMany(sampleChatRooms);
    console.log(`Created ${createdChatRooms.length} sample chat rooms`);

    // Create sample messages
    const sampleMessages = [
      {
        chatRoomId: createdChatRooms[0]._id.toString(),
        senderId: 'user-002',
        content: 'Hi! Is this Honda Activa still available?',
        messageType: 'text'
      },
      {
        chatRoomId: createdChatRooms[0]._id.toString(),
        senderId: 'user-001',
        content: 'Yes, it\'s available. Would you like to see it?',
        messageType: 'text'
      },
      {
        chatRoomId: createdChatRooms[0]._id.toString(),
        senderId: 'user-002',
        content: 'Great! Can we meet this weekend?',
        messageType: 'text'
      },
      {
        chatRoomId: createdChatRooms[1]._id.toString(),
        senderId: 'user-003',
        content: 'What\'s the final price for the Yamaha FZ-S?',
        messageType: 'text'
      },
      {
        chatRoomId: createdChatRooms[1]._id.toString(),
        senderId: 'user-002',
        content: 'The listed price is final. It\'s well maintained.',
        messageType: 'text'
      },
      {
        chatRoomId: createdChatRooms[2]._id.toString(),
        senderId: 'user-001',
        content: 'Interested in the Ather 450X. How\'s the battery life?',
        messageType: 'text'
      }
    ];

    const createdMessages = await Message.insertMany(sampleMessages);
    console.log(`Created ${createdMessages.length} sample messages`);

    // Create some sample favorites
    const sampleFavorites = [
      {
        userId: 'user-001',
        vehicleId: createdVehicles[1]._id.toString()
      },
      {
        userId: 'user-001',
        vehicleId: createdVehicles[2]._id.toString()
      },
      {
        userId: 'user-002',
        vehicleId: createdVehicles[3]._id.toString()
      },
      {
        userId: 'user-003',
        vehicleId: createdVehicles[0]._id.toString()
      }
    ];

    await Favorite.insertMany(sampleFavorites);
    console.log(`Created ${sampleFavorites.length} sample favorites`);

    console.log('Sample data setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up sample data:', error);
    return false;
  }
};