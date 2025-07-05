import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    default: 'text',
  },
}, {
  timestamps: true,
});

export const Message = mongoose.model('Message', messageSchema); 