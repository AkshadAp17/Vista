import {
  users,
  vehicles,
  chatRooms,
  messages,
  type User,
  type UpsertUser,
  type Vehicle,
  type InsertVehicle,
  type VehicleWithSeller,
  type ChatRoom,
  type InsertChatRoom,
  type Message,
  type InsertMessage,
  type ChatRoomWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Vehicle operations
  getVehicles(filters?: { 
    search?: string; 
    location?: string; 
    priceRange?: [number, number]; 
    vehicleType?: string;
    sellerId?: string;
  }): Promise<VehicleWithSeller[]>;
  getVehicle(id: number): Promise<VehicleWithSeller | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle>;
  deleteVehicle(id: number): Promise<void>;
  getFeaturedVehicles(): Promise<VehicleWithSeller[]>;
  
  // Chat operations
  getChatRoom(vehicleId: number, buyerId: string): Promise<ChatRoom | undefined>;
  createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom>;
  getChatRooms(userId: string): Promise<ChatRoomWithDetails[]>;
  getChatRoomWithMessages(id: number): Promise<ChatRoomWithDetails | undefined>;
  addMessage(message: InsertMessage): Promise<Message>;
  getMessages(chatRoomId: number): Promise<(Message & { sender: User })[]>;
  
  // Admin operations
  getStats(): Promise<{
    totalVehicles: number;
    totalUsers: number;
    activeChats: number;
    totalSales: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Vehicle operations
  async getVehicles(filters?: { 
    search?: string; 
    location?: string; 
    priceRange?: [number, number]; 
    vehicleType?: string;
    sellerId?: string;
  }): Promise<VehicleWithSeller[]> {
    let query = db
      .select()
      .from(vehicles)
      .innerJoin(users, eq(vehicles.sellerId, users.id))
      .where(eq(vehicles.isActive, true));

    if (filters?.search) {
      query = query.where(
        sql`${vehicles.brand} ILIKE ${'%' + filters.search + '%'} OR ${vehicles.model} ILIKE ${'%' + filters.search + '%'}`
      );
    }

    if (filters?.location) {
      query = query.where(sql`${vehicles.location} ILIKE ${'%' + filters.location + '%'}`);
    }

    if (filters?.vehicleType) {
      query = query.where(eq(vehicles.vehicleType, filters.vehicleType));
    }

    if (filters?.sellerId) {
      query = query.where(eq(vehicles.sellerId, filters.sellerId));
    }

    if (filters?.priceRange) {
      query = query.where(
        and(
          sql`${vehicles.price} >= ${filters.priceRange[0]}`,
          sql`${vehicles.price} <= ${filters.priceRange[1]}`
        )
      );
    }

    const results = await query.orderBy(desc(vehicles.createdAt));
    
    return results.map(row => ({
      ...row.vehicles,
      seller: row.users,
    }));
  }

  async getVehicle(id: number): Promise<VehicleWithSeller | undefined> {
    const [result] = await db
      .select()
      .from(vehicles)
      .innerJoin(users, eq(vehicles.sellerId, users.id))
      .where(eq(vehicles.id, id));

    if (!result) return undefined;

    return {
      ...result.vehicles,
      seller: result.users,
    };
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicles)
      .values(vehicle)
      .returning();
    return newVehicle;
  }

  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set({ ...vehicle, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }

  async getFeaturedVehicles(): Promise<VehicleWithSeller[]> {
    const results = await db
      .select()
      .from(vehicles)
      .innerJoin(users, eq(vehicles.sellerId, users.id))
      .where(and(eq(vehicles.isFeatured, true), eq(vehicles.isActive, true)))
      .orderBy(desc(vehicles.createdAt))
      .limit(8);

    return results.map(row => ({
      ...row.vehicles,
      seller: row.users,
    }));
  }

  // Chat operations
  async getChatRoom(vehicleId: number, buyerId: string): Promise<ChatRoom | undefined> {
    const [chatRoom] = await db
      .select()
      .from(chatRooms)
      .where(
        and(
          eq(chatRooms.vehicleId, vehicleId),
          eq(chatRooms.buyerId, buyerId)
        )
      );
    return chatRoom;
  }

  async createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom> {
    const [newChatRoom] = await db
      .insert(chatRooms)
      .values(chatRoom)
      .returning();
    return newChatRoom;
  }

  async getChatRooms(userId: string): Promise<ChatRoomWithDetails[]> {
    const results = await db
      .select()
      .from(chatRooms)
      .innerJoin(vehicles, eq(chatRooms.vehicleId, vehicles.id))
      .innerJoin(users, eq(chatRooms.buyerId, users.id))
      .where(
        and(
          eq(chatRooms.isActive, true),
          sql`${chatRooms.buyerId} = ${userId} OR ${chatRooms.sellerId} = ${userId}`
        )
      )
      .orderBy(desc(chatRooms.updatedAt));

    const chatRoomsWithDetails = await Promise.all(
      results.map(async (row) => {
        const seller = await this.getUser(row.chat_rooms.sellerId);
        const recentMessages = await this.getMessages(row.chat_rooms.id);
        
        return {
          ...row.chat_rooms,
          vehicle: row.vehicles,
          buyer: row.users,
          seller: seller!,
          messages: recentMessages,
        };
      })
    );

    return chatRoomsWithDetails;
  }

  async getChatRoomWithMessages(id: number): Promise<ChatRoomWithDetails | undefined> {
    const [chatRoom] = await db
      .select()
      .from(chatRooms)
      .innerJoin(vehicles, eq(chatRooms.vehicleId, vehicles.id))
      .where(eq(chatRooms.id, id));

    if (!chatRoom) return undefined;

    const buyer = await this.getUser(chatRoom.chat_rooms.buyerId);
    const seller = await this.getUser(chatRoom.chat_rooms.sellerId);
    const messagesList = await this.getMessages(id);

    return {
      ...chatRoom.chat_rooms,
      vehicle: chatRoom.vehicles,
      buyer: buyer!,
      seller: seller!,
      messages: messagesList,
    };
  }

  async addMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    
    // Update chat room's updated_at timestamp
    await db
      .update(chatRooms)
      .set({ updatedAt: new Date() })
      .where(eq(chatRooms.id, message.chatRoomId));

    return newMessage;
  }

  async getMessages(chatRoomId: number): Promise<(Message & { sender: User })[]> {
    const results = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.chatRoomId, chatRoomId))
      .orderBy(messages.createdAt);

    return results.map(row => ({
      ...row.messages,
      sender: row.users,
    }));
  }

  // Admin operations
  async getStats(): Promise<{
    totalVehicles: number;
    totalUsers: number;
    activeChats: number;
    totalSales: number;
  }> {
    const [vehicleCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(vehicles)
      .where(eq(vehicles.isActive, true));

    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [chatCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chatRooms)
      .where(eq(chatRooms.isActive, true));

    // For demo purposes, calculate total sales based on vehicle prices
    const [salesTotal] = await db
      .select({ total: sql<number>`sum(price)` })
      .from(vehicles)
      .where(eq(vehicles.isActive, false)); // Assuming inactive vehicles are sold

    return {
      totalVehicles: vehicleCount?.count || 0,
      totalUsers: userCount?.count || 0,
      activeChats: chatCount?.count || 0,
      totalSales: salesTotal?.total || 0,
    };
  }
}

export const storage = new DatabaseStorage();
