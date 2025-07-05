import { connectDB } from '../server/db.js';
import { Vehicle } from '../server/models/index.js';

export const updateSampleVehicleStatus = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    // Find a sample vehicle to mark as sold
    const vehicle = await Vehicle.findOne({ brand: 'Honda', model: 'Activa 6G' });
    
    if (vehicle) {
      vehicle.status = 'sold';
      vehicle.soldAt = new Date();
      await vehicle.save();
      console.log(`Marked Honda Activa 6G (ID: ${vehicle._id}) as sold`);
    }
    
    // Find another vehicle to mark as pending
    const pendingVehicle = await Vehicle.findOne({ brand: 'Yamaha', model: 'FZ-S V3' });
    
    if (pendingVehicle) {
      pendingVehicle.status = 'pending';
      await pendingVehicle.save();
      console.log(`Marked Yamaha FZ-S V3 (ID: ${pendingVehicle._id}) as pending`);
    }
    
    console.log('Vehicle status updates completed successfully');
    
  } catch (error) {
    console.error('Error updating vehicle status:', error);
  }
};

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSampleVehicleStatus().then(() => process.exit(0));
}