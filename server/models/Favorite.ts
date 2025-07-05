import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to ensure unique user-vehicle combinations
favoriteSchema.index({ userId: 1, vehicleId: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);