import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema); 