import {
  User,
  Vehicle,
  ChatRoom,
  Message,
  Notification,
  Favorite
} from "./models";
import mongoose from 'mongoose';

export interface UpsertUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  isAdmin?: boolean;
  isEmailVerified?: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
}

export interface InsertVehicle {
  sellerId: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  vehicleNumber: string;
  engineCapacity?: string;
  fuelType: string;
  kmDriven: number;
  location: string;
  description?: string;
  images?: string[];
  condition: string;
  isActive?: boolean;
  isFeatured?: boolean;
  vehicleType: string;
}

export interface InsertChatRoom {
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  isActive?: boolean;
}

export interface InsertMessage {
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType?: string;
}

// Define simplified interfaces for MongoDB document responses
export interface VehicleWithSeller {
  _id: mongoose.Types.ObjectId | string;
  sellerId: mongoose.Types.ObjectId | string;
  brand: string;
  model: string;
  year: number;
  price: mongoose.Types.Decimal128 | number;
  vehicleNumber: string;
  engineCapacity?: string;
  fuelType: string;
  kmDriven: number;
  location: string;
  description?: string;
  images?: string[];
  condition: string;
  isActive: boolean;
  isFeatured: boolean;
  vehicleType: string;
  createdAt: Date;
  updatedAt: Date;
  seller: any;
}

export interface ChatRoomWithDetails {
  _id: mongoose.Types.ObjectId | string;
  vehicleId: mongoose.Types.ObjectId | string;
  buyerId: mongoose.Types.ObjectId | string;
  sellerId: mongoose.Types.ObjectId | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  vehicle: any;
  buyer: any;
  seller: any;
  messages: any[];
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  getAllUsers(): Promise<any[]>;
  upsertUser(user: UpsertUser): Promise<any>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<any>;
  
  // Vehicle operations
  getVehicles(filters?: { 
    search?: string; 
    location?: string; 
    priceRange?: [number, number]; 
    vehicleType?: string;
    sellerId?: string;
  }): Promise<VehicleWithSeller[]>;
  getVehicle(id: string): Promise<VehicleWithSeller | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<any>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<any>;
  deleteVehicle(id: string): Promise<void>;
  getFeaturedVehicles(): Promise<VehicleWithSeller[]>;
  
  // Chat operations
  getChatRoom(vehicleId: string, buyerId: string): Promise<any | undefined>;
  createChatRoom(chatRoom: InsertChatRoom): Promise<any>;
  getChatRooms(userId: string): Promise<ChatRoomWithDetails[]>;
  getChatRoomWithMessages(id: string): Promise<ChatRoomWithDetails | undefined>;
  addMessage(message: InsertMessage): Promise<any>;
  getMessages(chatRoomId: string): Promise<any[]>;
  
  // Favorites operations
  addToFavorites(userId: string, vehicleId: string): Promise<any>;
  removeFromFavorites(userId: string, vehicleId: string): Promise<void>;
  getUserFavorites(userId: string): Promise<VehicleWithSeller[]>;
  isFavorite(userId: string, vehicleId: string): Promise<boolean>;
  
  // Admin operations
  getStats(): Promise<{
    totalVehicles: number;
    totalUsers: number;
    activeChats: number;
    totalSales: number;
  }>;
  hasAdminUsers(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  
  private transformVehicle(vehicleObj: any, seller: any = null): VehicleWithSeller {
    return {
      ...vehicleObj,
      id: vehicleObj._id.toString(),
      price: parseFloat(vehicleObj.price.toString()),
      seller: seller ? seller : null
    } as unknown as VehicleWithSeller;
  }
  // User operations
  async getUser(id: string): Promise<any | undefined> {
    const user = await User.findOne({ id });
    return user ? user.toObject() : undefined;
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    const user = await User.findOne({ email });
    return user ? user.toObject() : undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<any> {
    const user = await User.findOneAndUpdate(
      { id: userData.id },
      { ...userData, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    return user.toObject();
  }

  async getAllUsers(): Promise<any[]> {
    const users = await User.find({})
      .select('-password -verificationCode')
      .sort({ createdAt: -1 });
    return users.map(user => user.toObject());
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<any> {
    const user = await User.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user.toObject();
  }

  // Vehicle operations
  async getVehicles(filters?: { 
    search?: string; 
    location?: string; 
    priceRange?: [number, number]; 
    vehicleType?: string;
    sellerId?: string;
  }): Promise<VehicleWithSeller[]> {
    let query: any = { isActive: true };

    if (filters?.search) {
      const searchConditions = [
        { brand: { $regex: filters.search, $options: 'i' } },
        { model: { $regex: filters.search, $options: 'i' } },
        { vehicleNumber: { $regex: filters.search, $options: 'i' } }
      ];
      
      // If search looks like a MongoDB ObjectId, include exact ID match
      if (filters.search.match(/^[0-9a-fA-F]{24}$/)) {
        searchConditions.push({ _id: filters.search });
      }
      
      query.$or = searchConditions;
    }

    if (filters?.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters?.vehicleType) {
      query.vehicleType = { $regex: new RegExp(`^${filters.vehicleType}`, 'i') };
    }

    if (filters?.sellerId) {
      query.sellerId = filters.sellerId;
    }

    if (filters?.priceRange) {
      query.price = { 
        $gte: filters.priceRange[0], 
        $lte: filters.priceRange[1] 
      };
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    
    const results = await Promise.all(
      vehicles.map(async (vehicle) => {
        const seller = await User.findOne({ id: vehicle.sellerId.toString() });
        const vehicleObj = vehicle.toObject();
        return this.transformVehicle(vehicleObj, seller ? seller.toObject() : null);
      })
    );
    
    return results;
  }

  async getVehicle(id: string): Promise<VehicleWithSeller | undefined> {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return undefined;

    const seller = await User.findOne({ id: vehicle.sellerId.toString() });
    const vehicleObj = vehicle.toObject();
    
    return this.transformVehicle(vehicleObj, seller ? seller.toObject() : null);
  }

  async createVehicle(vehicle: InsertVehicle): Promise<any> {
    // Generate vehicle number if not provided
    if (!vehicle.vehicleNumber) {
      const count = await Vehicle.countDocuments();
      vehicle.vehicleNumber = `VH${String(count + 1).padStart(3, '0')}`;
    }
    
    const newVehicle = await Vehicle.create(vehicle);
    return newVehicle.toObject();
  }

  async updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<any> {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { ...vehicle, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedVehicle) {
      throw new Error("Vehicle not found");
    }
    
    return updatedVehicle.toObject();
  }

  async deleteVehicle(id: string): Promise<void> {
    await Vehicle.findByIdAndDelete(id);
  }

  async getFeaturedVehicles(): Promise<VehicleWithSeller[]> {
    const vehicles = await Vehicle.find({ 
      isFeatured: true, 
      isActive: true 
    }).sort({ createdAt: -1 }).limit(8);

    const results = await Promise.all(
      vehicles.map(async (vehicle) => {
        const seller = await User.findOne({ id: vehicle.sellerId.toString() });
        const vehicleObj = vehicle.toObject();
        return this.transformVehicle(vehicleObj, seller ? seller.toObject() : null);
      })
    );
    
    return results;
  }

  // Chat operations
  async getChatRoom(vehicleId: string, buyerId: string): Promise<any | undefined> {
    const chatRoom = await ChatRoom.findOne({ vehicleId, buyerId });
    return chatRoom ? chatRoom.toObject() : undefined;
  }

  async createChatRoom(chatRoom: InsertChatRoom): Promise<any> {
    const newChatRoom = await ChatRoom.create(chatRoom);
    return newChatRoom.toObject();
  }

  async getChatRooms(userId: string): Promise<ChatRoomWithDetails[]> {
    const chatRooms = await ChatRoom.find({
      isActive: true,
      $or: [{ buyerId: userId }, { sellerId: userId }]
    }).sort({ updatedAt: -1 });

    const results = await Promise.all(
      chatRooms.map(async (room) => {
        const vehicle = await Vehicle.findById(room.vehicleId);
        const buyer = await User.findOne({ id: room.buyerId.toString() });
        const seller = await User.findOne({ id: room.sellerId.toString() });
        const messages = await this.getMessages(room._id.toString());
        const roomObj = room.toObject();
        
        return {
          ...roomObj,
          id: roomObj._id.toString(),
          vehicle: vehicle ? this.transformVehicle(vehicle.toObject()) : null,
          buyer: buyer ? buyer.toObject() : null,
          seller: seller ? seller.toObject() : null,
          messages
        } as unknown as ChatRoomWithDetails;
      })
    );
    
    return results;
  }

  async getChatRoomWithMessages(id: string): Promise<ChatRoomWithDetails | undefined> {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) return undefined;

    const vehicle = await Vehicle.findById(chatRoom.vehicleId);
    const buyer = await User.findOne({ id: chatRoom.buyerId.toString() });
    const seller = await User.findOne({ id: chatRoom.sellerId.toString() });
    const messages = await this.getMessages(id);
    const roomObj = chatRoom.toObject();
    
    return {
      ...roomObj,
      id: roomObj._id.toString(),
      vehicle: vehicle ? this.transformVehicle(vehicle.toObject()) : null,
      buyer: buyer ? buyer.toObject() : null,
      seller: seller ? seller.toObject() : null,
      messages
    } as unknown as ChatRoomWithDetails;
  }

  async addMessage(message: InsertMessage): Promise<any> {
    const newMessage = await Message.create({
      ...message,
      createdAt: new Date(), // Ensure createdAt is set properly
    });
    
    // Update the chat room's updatedAt timestamp
    await ChatRoom.findByIdAndUpdate(
      message.chatRoomId,
      { updatedAt: new Date() }
    );
    
    const messageObj = newMessage.toObject();
    // Ensure the ID field exists and is properly formatted
    return {
      ...messageObj,
      id: messageObj._id.toString(),
      createdAt: messageObj.createdAt || new Date()
    };
  }

  async getMessages(chatRoomId: string): Promise<any[]> {
    const messages = await Message.find({ chatRoomId })
      .sort({ createdAt: 1 })
      .limit(100);
    
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const sender = await User.findOne({ id: message.senderId });
        const messageObj = message.toObject();
        
        // Debug logging for message content
        console.log("Debug - Message object:", {
          id: messageObj._id,
          content: messageObj.content,
          senderId: messageObj.senderId,
          chatRoomId: messageObj.chatRoomId
        });
        
        return {
          ...messageObj,
          id: messageObj._id.toString(),
          createdAt: messageObj.createdAt || new Date(),
          sender: sender ? sender.toObject() : null
        };
      })
    );
    
    return messagesWithSenders;
  }

  // Admin operations
  async getStats(): Promise<{
    totalVehicles: number;
    totalUsers: number;
    activeChats: number;
    totalSales: number;
  }> {
    const [totalVehicles, totalUsers, activeChats, soldVehicles] = await Promise.all([
      Vehicle.countDocuments(),
      User.countDocuments(),
      ChatRoom.countDocuments({ isActive: true }),
      Vehicle.find({ status: 'sold' })
    ]);
    
    // Calculate total sales from sold vehicles
    const totalSales = soldVehicles.reduce((sum, vehicle) => {
      const price = typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : Number(vehicle.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    
    console.log(`Stats calculated: ${totalVehicles} vehicles, ${totalUsers} users, ${activeChats} active chats, ₹${totalSales.toLocaleString()} total sales from ${soldVehicles.length} sold vehicles`);
    
    return {
      totalVehicles,
      totalUsers,
      activeChats,
      totalSales
    };
  }

  // Favorites operations
  async addToFavorites(userId: string, vehicleId: string): Promise<any> {
    try {
      const favorite = new Favorite({
        userId,
        vehicleId: new mongoose.Types.ObjectId(vehicleId)
      });
      return await favorite.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error - already favorited
        throw new Error('Vehicle already in favorites');
      }
      throw error;
    }
  }

  async removeFromFavorites(userId: string, vehicleId: string): Promise<void> {
    await Favorite.deleteOne({
      userId,
      vehicleId: new mongoose.Types.ObjectId(vehicleId)
    });
  }

  async getUserFavorites(userId: string): Promise<VehicleWithSeller[]> {
    const favorites = await Favorite.find({ userId }).populate({
      path: 'vehicleId',
      model: 'Vehicle'
    });
    
    const results = await Promise.all(
      favorites.map(async (favorite: any) => {
        if (favorite.vehicleId) {
          const seller = await User.findOne({ id: favorite.vehicleId.sellerId.toString() });
          return this.transformVehicle(favorite.vehicleId.toObject(), seller ? seller.toObject() : null);
        }
        return null;
      })
    );
    
    return results.filter(Boolean) as VehicleWithSeller[];
  }

  async isFavorite(userId: string, vehicleId: string): Promise<boolean> {
    const favorite = await Favorite.findOne({
      userId,
      vehicleId: new mongoose.Types.ObjectId(vehicleId)
    });
    return !!favorite;
  }

  async hasAdminUsers(): Promise<boolean> {
    const adminCount = await User.countDocuments({ isAdmin: true });
    return adminCount > 0;
  }
}

export const storage = new DatabaseStorage();
