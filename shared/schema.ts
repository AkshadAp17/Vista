import { z } from "zod";

export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  profileImageUrl: z.string().optional(),
  isAdmin: z.boolean().default(false),
  isEmailVerified: z.boolean().default(false),
  verificationCode: z.string().optional(),
  verificationCodeExpiry: z.date().optional(),
});

export const insertVehicleSchema = z.object({
  sellerId: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  price: z.number(),
  vehicleNumber: z.string(),
  engineCapacity: z.string().optional(),
  fuelType: z.string(),
  kmDriven: z.number(),
  location: z.string(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  condition: z.string().default("good"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  vehicleType: z.string(),
});

export const insertChatRoomSchema = z.object({
  vehicleId: z.string(),
  buyerId: z.string(),
  sellerId: z.string(),
  isActive: z.boolean().default(true),
});

export const insertMessageSchema = z.object({
  chatRoomId: z.string(),
  senderId: z.string(),
  content: z.string(),
  messageType: z.string().default("text"),
});

export interface User {
  _id: string;
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  _id: string;
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
  isActive: boolean;
  isFeatured: boolean;
  vehicleType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRoom {
  _id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType: string;
  createdAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface VehicleWithSeller extends Vehicle {
  seller: User;
}

export interface ChatRoomWithDetails extends ChatRoom {
  vehicle: Vehicle;
  buyer: User;
  seller: User;
  messages: (Message & { sender: User })[];
}

export type UpsertUser = z.infer<typeof insertUserSchema>;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;