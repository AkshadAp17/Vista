import 'dotenv/config';
import { connectDB } from '../server/db';
import { Vehicle } from '../server/models/Vehicle';

export const fixVehicleNumbers = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get all vehicles without proper vehicle numbers
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles to check`);

    let updatedCount = 0;
    
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      
      if (!vehicle.vehicleNumber || vehicle.vehicleNumber === 'undefined' || vehicle.vehicleNumber === '') {
        const newVehicleNumber = `VH${String(i + 1).padStart(3, '0')}`;
        
        await Vehicle.findByIdAndUpdate(vehicle._id, {
          vehicleNumber: newVehicleNumber
        });
        
        console.log(`Updated vehicle ${vehicle._id} with number ${newVehicleNumber}`);
        updatedCount++;
      } else {
        console.log(`Vehicle ${vehicle._id} already has number: ${vehicle.vehicleNumber}`);
      }
    }

    console.log(`Fixed ${updatedCount} vehicle numbers`);
    
    // Display updated vehicles
    const updatedVehicles = await Vehicle.find({}).select('brand model vehicleNumber price');
    console.log('Current vehicles:');
    updatedVehicles.forEach(v => {
      console.log(`- ${v.brand} ${v.model} (${v.vehicleNumber}) - ₹${v.price}`);
    });

    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error('Error fixing vehicle numbers:', error);
    return { success: false, error };
  }
};

// Run immediately
fixVehicleNumbers().then(() => process.exit(0));