import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneNumber: text('phone_number'),
  profileImageUrl: text('profile_image_url'),
  isAdmin: boolean('is_admin').default(false).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  verificationCode: text('verification_code'),
  verificationCodeExpiry: timestamp('verification_code_expiry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Vehicles table
export const vehicles = pgTable('vehicles', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id').references(() => users.id).notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  vehicleNumber: text('vehicle_number').notNull(),
  engineCapacity: text('engine_capacity'),
  fuelType: text('fuel_type').notNull(),
  kmDriven: integer('km_driven').notNull(),
  location: text('location').notNull(),
  description: text('description'),
  images: text('images').array(),
  condition: text('condition').default('good').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  vehicleType: text('vehicle_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Chat rooms table
export const chatRooms = pgTable('chat_rooms', {
  id: serial('id').primaryKey(),
  vehicleId: integer('vehicle_id').references(() => vehicles.id).notNull(),
  buyerId: integer('buyer_id').references(() => users.id).notNull(),
  sellerId: integer('seller_id').references(() => users.id).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatRoomId: integer('chat_room_id').references(() => chatRooms.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  messageType: text('message_type').default('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: text('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  sentMessages: many(messages),
  buyerChatRooms: many(chatRooms, { relationName: "buyer" }),
  sellerChatRooms: many(chatRooms, { relationName: "seller" }),
  notifications: many(notifications),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  seller: one(users, {
    fields: [vehicles.sellerId],
    references: [users.id],
  }),
  chatRooms: many(chatRooms),
}));

export const chatRoomsRelations = relations(chatRooms, ({ one, many }) => ({
  vehicle: one(vehicles, {
    fields: [chatRooms.vehicleId],
    references: [vehicles.id],
  }),
  buyer: one(users, {
    fields: [chatRooms.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(users, {
    fields: [chatRooms.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chatRoom: one(chatRooms, {
    fields: [messages.chatRoomId],
    references: [chatRooms.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof insertUserSchema._type;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof insertVehicleSchema._type;

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = typeof insertChatRoomSchema._type;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof insertMessageSchema._type;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof insertNotificationSchema._type;

// Extended types with relations
export interface VehicleWithSeller extends Vehicle {
  seller: User;
}

export interface ChatRoomWithDetails extends ChatRoom {
  vehicle: Vehicle;
  buyer: User;
  seller: User;
  messages: (Message & { sender: User })[];
}