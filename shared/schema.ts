import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for email/password auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  isEmailVerified: boolean("is_email_verified").default(false),
  verificationCode: varchar("verification_code"),
  verificationCodeExpiry: timestamp("verification_code_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  brand: varchar("brand").notNull(),
  model: varchar("model").notNull(),
  year: integer("year").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  vehicleNumber: varchar("vehicle_number").notNull().unique(),
  engineCapacity: varchar("engine_capacity"),
  fuelType: varchar("fuel_type").notNull(),
  kmDriven: integer("km_driven").notNull(),
  location: varchar("location").notNull(),
  description: text("description"),
  images: text("images").array(),
  condition: varchar("condition").notNull().default("good"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  vehicleType: varchar("vehicle_type").notNull(), // motorcycle, scooter, electric
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat rooms table
export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatRoomId: integer("chat_room_id").notNull().references(() => chatRooms.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: varchar("message_type").default("text"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  chatRooms: many(chatRooms),
  messages: many(messages),
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
  }),
  seller: one(users, {
    fields: [chatRooms.sellerId],
    references: [users.id],
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
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

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Extended types for API responses
export type VehicleWithSeller = Vehicle & {
  seller: User;
};

export type ChatRoomWithDetails = ChatRoom & {
  vehicle: Vehicle;
  buyer: User;
  seller: User;
  messages: (Message & { sender: User })[];
};
