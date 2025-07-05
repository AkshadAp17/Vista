import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  engineCapacity: String,
  fuelType: {
    type: String,
    required: true,
  },
  kmDriven: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: String,
  images: [String],
  condition: {
    type: String,
    default: 'good',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['motorcycle', 'scooter', 'electric'],
  },
}, {
  timestamps: true,
});

export const Vehicle = mongoose.model('Vehicle', vehicleSchema); 