import { Pool } from 'pg';
import mongoose from 'mongoose';
import { User, Vehicle, ChatRoom, Message, Notification } from '../server/models';

// PostgreSQL connection
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// MongoDB connection
const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
};

const migrateUsers = async () => {
  const { rows } = await pgPool.query('SELECT * FROM users');
  for (const row of rows) {
    await User.create({
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      phoneNumber: row.phone_number,
      profileImageUrl: row.profile_image_url,
      isAdmin: row.is_admin,
      isEmailVerified: row.is_email_verified,
      verificationCode: row.verification_code,
      verificationCodeExpiry: row.verification_code_expiry,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log('Users migrated successfully');
};

const migrateVehicles = async () => {
  const { rows } = await pgPool.query('SELECT * FROM vehicles');
  for (const row of rows) {
    await Vehicle.create({
      sellerId: row.seller_id,
      brand: row.brand,
      model: row.model,
      year: row.year,
      price: row.price,
      vehicleNumber: row.vehicle_number,
      engineCapacity: row.engine_capacity,
      fuelType: row.fuel_type,
      kmDriven: row.km_driven,
      location: row.location,
      description: row.description,
      images: row.images,
      condition: row.condition,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      vehicleType: row.vehicle_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log('Vehicles migrated successfully');
};

const migrateChatRooms = async () => {
  const { rows } = await pgPool.query('SELECT * FROM chat_rooms');
  for (const row of rows) {
    await ChatRoom.create({
      vehicleId: row.vehicle_id,
      buyerId: row.buyer_id,
      sellerId: row.seller_id,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log('Chat rooms migrated successfully');
};

const migrateMessages = async () => {
  const { rows } = await pgPool.query('SELECT * FROM messages');
  for (const row of rows) {
    await Message.create({
      chatRoomId: row.chat_room_id,
      senderId: row.sender_id,
      content: row.content,
      messageType: row.message_type,
      createdAt: row.created_at,
    });
  }
  console.log('Messages migrated successfully');
};

const migrateNotifications = async () => {
  const { rows } = await pgPool.query('SELECT * FROM notifications');
  for (const row of rows) {
    await Notification.create({
      userId: row.user_id,
      type: row.type,
      title: row.title,
      message: row.message,
      data: row.data,
      isRead: row.is_read,
      createdAt: row.created_at,
    });
  }
  console.log('Notifications migrated successfully');
};

const migrate = async () => {
  try {
    await connectMongoDB();
    
    // Migrate data in order of dependencies
    await migrateUsers();
    await migrateVehicles();
    await migrateChatRooms();
    await migrateMessages();
    await migrateNotifications();
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    await pgPool.end();
  }
};

migrate(); 