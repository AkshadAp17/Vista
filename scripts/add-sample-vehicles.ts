import * as dotenv from 'dotenv';
import { connectDB } from '../server/db';
import { storage } from '../server/storage';

// Load environment variables
dotenv.config();

const sampleVehicles = [
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72', // Admin user
    brand: 'Honda',
    model: 'CBR 150R',
    year: 2023,
    price: 185000,
    fuelType: 'Petrol',
    kmDriven: 1500,
    location: 'Mumbai',
    description: 'Excellent condition sports bike, well maintained with all documents.',
    condition: 'Excellent',
    isActive: true,
    isFeatured: true,
    vehicleType: 'motorcycle',
    engineCapacity: '150cc',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'Yamaha',
    model: 'MT-15',
    year: 2022,
    price: 165000,
    fuelType: 'Petrol',
    kmDriven: 3200,
    location: 'Delhi',
    description: 'Naked street bike with aggressive styling. Single owner.',
    condition: 'Good',
    isActive: true,
    isFeatured: false,
    vehicleType: 'motorcycle',
    engineCapacity: '155cc',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'TVS',
    model: 'Apache RTR 200',
    year: 2021,
    price: 140000,
    fuelType: 'Petrol',
    kmDriven: 8500,
    location: 'Bangalore',
    description: 'Performance motorcycle with dual-channel ABS. Regular service done.',
    condition: 'Good',
    isActive: true,
    isFeatured: true,
    vehicleType: 'motorcycle',
    engineCapacity: '200cc',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'Bajaj',
    model: 'Pulsar NS 160',
    year: 2022,
    price: 115000,
    fuelType: 'Petrol',
    kmDriven: 4200,
    location: 'Pune',
    description: 'Stylish naked bike with great fuel efficiency. Perfect for city rides.',
    condition: 'Excellent',
    isActive: true,
    isFeatured: false,
    vehicleType: 'motorcycle',
    engineCapacity: '160cc',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'Hero',
    model: 'Splendor Plus',
    year: 2023,
    price: 75000,
    fuelType: 'Petrol',
    kmDriven: 2100,
    location: 'Chennai',
    description: 'Reliable commuter bike with excellent mileage. Family owned.',
    condition: 'Excellent',
    isActive: true,
    isFeatured: false,
    vehicleType: 'motorcycle',
    engineCapacity: '100cc',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'Ola',
    model: 'S1 Pro',
    year: 2023,
    price: 135000,
    fuelType: 'Electric',
    kmDriven: 2800,
    location: 'Hyderabad',
    description: 'High-performance electric scooter with excellent range. Comes with charger.',
    condition: 'Excellent',
    isActive: true,
    isFeatured: true,
    vehicleType: 'scooter',
    engineCapacity: 'Electric',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'Bajaj',
    model: 'Chetak Premium',
    year: 2022,
    price: 145000,
    fuelType: 'Electric',
    kmDriven: 3500,
    location: 'Jaipur',
    description: 'Premium electric scooter with retro design. All accessories included.',
    condition: 'Good',
    isActive: true,
    isFeatured: false,
    vehicleType: 'scooter',
    engineCapacity: 'Electric',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'Suzuki',
    model: 'Access 125',
    year: 2021,
    price: 85000,
    fuelType: 'Petrol',
    kmDriven: 12000,
    location: 'Kolkata',
    description: 'Comfortable scooter for daily commute. Well maintained with regular service.',
    condition: 'Good',
    isActive: true,
    isFeatured: false,
    vehicleType: 'scooter',
    engineCapacity: '125cc',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'KTM',
    model: 'Duke 390',
    year: 2020,
    price: 285000,
    fuelType: 'Petrol',
    kmDriven: 15000,
    location: 'Goa',
    description: 'Powerful naked bike with premium features. Enthusiast owned.',
    condition: 'Good',
    isActive: true,
    isFeatured: true,
    vehicleType: 'motorcycle',
    engineCapacity: '390cc',
    images: []
  },
  {
    sellerId: 'c9765588-3ef7-4abf-81d8-30e703cf6f72',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    year: 2022,
    price: 195000,
    fuelType: 'Petrol',
    kmDriven: 6800,
    location: 'Ahmedabad',
    description: 'Iconic cruiser motorcycle with timeless design. Perfect for long rides.',
    condition: 'Excellent',
    isActive: true,
    isFeatured: true,
    vehicleType: 'motorcycle',
    engineCapacity: '350cc',
    images: []
  }
];

export const addSampleVehicles = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Add each vehicle with auto-generated vehicle number
    for (const vehicle of sampleVehicles) {
      try {
        const createdVehicle = await storage.createVehicle(vehicle as any);
        console.log(`Added vehicle: ${vehicle.brand} ${vehicle.model} - ${createdVehicle.vehicleNumber}`);
      } catch (error) {
        console.error(`Error adding vehicle ${vehicle.brand} ${vehicle.model}:`, error);
      }
    }

    console.log('Sample vehicles added successfully!');
  } catch (error) {
    console.error('Error adding sample vehicles:', error);
  }
};

// Run the script
addSampleVehicles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });