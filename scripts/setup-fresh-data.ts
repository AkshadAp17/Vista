import { connectDB } from '../server/db';
import { User, Vehicle } from '../server/models';
import bcrypt from 'bcryptjs';

const setupFreshData = async () => {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Clear existing non-admin users
    await User.deleteMany({ email: { $ne: process.env.ADMIN_EMAIL } });
    console.log('Cleared existing non-admin users');
    
    // Create sample users (don't delete admin)
    const hashedPassword = await bcrypt.hash('password123', 10);

    const buyer = await User.create({
      id: 'buyer-001',
      email: 'buyer@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Buyer',
      phoneNumber: '+91 9876543210',
      isAdmin: false,
      isEmailVerified: true,
    });

    const seller = await User.create({
      id: 'seller-001',
      email: 'seller@example.com',
      password: hashedPassword,
      firstName: 'Mary',
      lastName: 'Seller',
      phoneNumber: '+91 9876543211',
      isAdmin: false,
      isEmailVerified: true,
    });

    console.log('Created sample users');

    // Create sample vehicles with proper pricing
    const vehicles = [
      {
        sellerId: seller._id,
        brand: 'Honda',
        model: 'Activa 6G',
        year: 2023,
        price: 85000,
        vehicleNumber: 'VH001',
        engineCapacity: '109.51cc',
        fuelType: 'Petrol',
        kmDriven: 2500,
        location: 'Mumbai, Maharashtra',
        description: 'Well-maintained Honda Activa in excellent condition. Single owner, all documents available.',
        condition: 'Excellent',
        isActive: true,
        isFeatured: true,
        vehicleType: 'scooter'
      },
      {
        sellerId: seller._id,
        brand: 'Yamaha',
        model: 'FZ-S V3',
        year: 2022,
        price: 120000,
        vehicleNumber: 'VH002',
        engineCapacity: '149cc',
        fuelType: 'Petrol',
        kmDriven: 8500,
        location: 'Delhi, NCR',
        description: 'Sporty Yamaha FZ-S with excellent performance and style.',
        condition: 'Good',
        isActive: true,
        isFeatured: false,
        vehicleType: 'motorcycle'
      },
      {
        sellerId: seller._id,
        brand: 'Ather',
        model: '450X Gen 3',
        year: 2024,
        price: 145000,
        vehicleNumber: 'VH003',
        engineCapacity: 'Electric',
        fuelType: 'Electric',
        kmDriven: 1200,
        location: 'Bangalore, Karnataka',
        description: 'Latest Ather electric scooter with smart features and fast charging.',
        condition: 'Like New',
        isActive: true,
        isFeatured: true,
        vehicleType: 'electric'
      }
    ];

    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`Created ${createdVehicles.length} sample vehicles`);

    console.log('Fresh sample data setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up fresh data:', error);
    process.exit(1);
  }
};

setupFreshData();