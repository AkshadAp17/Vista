import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as bcrypt from "bcryptjs";
import { storage } from "./storage";
import { getSession } from "./replitAuth";
import { AuthService } from "./auth";
import { insertVehicleSchema, insertChatRoomSchema, insertMessageSchema } from "@shared/schema";
import { createSampleData } from "./sampleData";
import { createTestUsers } from "./testUsers";
import { clearAllChatData } from "./clearChatData";
import { setupFreshChatSystem } from "./freshSetup";

// Extend Express session to include userId
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(getSession());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Simple session-based auth middleware
  const isAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log("Session check:", { sessionId: req.session?.id, userId: req.session?.userId, hasSession: !!req.session });
    if (req.session?.userId) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const user = await AuthService.signup(req.body);
      res.json({ message: "Account created successfully", user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const user = await AuthService.login(req.body);
      req.session.userId = user.id;
      
      // Force session save and wait for completion
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        } else {
          console.log("Session saved successfully:", { sessionId: req.session.id, userId: req.session.userId });
          res.json({ message: "Login successful", user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin } });
        }
      });
      
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(401).json({ message: error.message });
    }
  });

  app.get('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      // Redirect to landing page after successful logout
      res.redirect('/');
    });
  });

  // Profile update route
  app.put('/api/auth/profile', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { firstName, lastName, email, phoneNumber } = req.body;
      
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: "First name, last name, and email are required" });
      }

      // Check if email is already used by another user
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      const updateData: any = { firstName, lastName, email };
      if (phoneNumber !== undefined) {
        updateData.phoneNumber = phoneNumber;
      }

      const updatedUser = await storage.updateUser(userId, updateData);
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Password update route
  app.put('/api/auth/password', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(userId, { password: hashedNewPassword });
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
      const user = await AuthService.verifyEmail(email, verificationCode);
      res.json({ message: "Email verified successfully", user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error: any) {
      console.error("Email verification error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email is already verified" });
      }

      // Generate new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await storage.updateUser(user.id, {
        verificationCode,
        verificationCodeExpiry,
      });

      await AuthService.sendVerificationEmail(email, verificationCode);
      res.json({ message: "Verification email sent successfully" });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });

  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin, 
        isEmailVerified: user.isEmailVerified 
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Secure admin creation route - only for website creator during deployment
  app.post('/api/auth/create-admin', async (req: Request, res: Response) => {
    try {
      const adminUser = await AuthService.createFirstAdmin(req.body);
      res.json({ 
        message: "Admin account created successfully", 
        user: { 
          id: adminUser.id, 
          email: adminUser.email, 
          firstName: adminUser.firstName, 
          lastName: adminUser.lastName, 
          isAdmin: adminUser.isAdmin 
        } 
      });
    } catch (error: any) {
      console.error("Admin creation error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Check if admin exists (public endpoint for setup)
  app.get('/api/auth/admin-exists', async (req: Request, res: Response) => {
    try {
      const hasAdmin = await storage.hasAdminUsers();
      res.json({ hasAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Forgot password route
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ message: "If an account with this email exists, a reset code will be sent." });
      }

      // Generate password reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await storage.updateUser(user.id, {
        verificationCode: resetCode,
        verificationCodeExpiry: resetCodeExpiry,
      });

      // Send password reset email
      try {
        await AuthService.sendPasswordResetEmail(email, resetCode);
      } catch (error) {
        console.error("Failed to send reset email:", error);
      }

      res.json({ message: "If an account with this email exists, a reset code will be sent." });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset password route
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { email, resetCode, newPassword } = req.body;
      if (!email || !resetCode || !newPassword) {
        return res.status(400).json({ message: "Email, reset code, and new password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid reset code" });
      }

      if (user.verificationCode !== resetCode) {
        return res.status(400).json({ message: "Invalid reset code" });
      }

      if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
        return res.status(400).json({ message: "Reset code has expired" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      // Update password and clear reset code
      await storage.updateUser(user.id, {
        password: hashedPassword,
        verificationCode: undefined,
        verificationCodeExpiry: undefined,
      });

      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Vehicle routes
  app.get('/api/vehicles', async (req, res) => {
    try {
      const { search, location, priceRange, vehicleType, sellerId } = req.query;
      
      const filters: any = {};
      if (search) filters.search = search as string;
      if (location) filters.location = location as string;
      if (vehicleType) filters.vehicleType = vehicleType as string;
      if (sellerId) filters.sellerId = sellerId as string;
      if (priceRange) {
        const [min, max] = (priceRange as string).split(',').map(Number);
        filters.priceRange = [min, max];
      }

      const vehicles = await storage.getVehicles(filters);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get('/api/vehicles/featured', async (req, res) => {
    try {
      const vehicles = await storage.getFeaturedVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching featured vehicles:", error);
      res.status(500).json({ message: "Failed to fetch featured vehicles" });
    }
  });

  app.get('/api/vehicles/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  app.post('/api/vehicles', isAuth, async (req: any, res) => {
    try {
      console.log("Vehicle creation request:", req.body);
      const userId = req.session.userId;
      console.log("User ID:", userId);
      
      // Convert string numbers to actual numbers
      const processedBody = {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : 0,
        year: req.body.year ? parseInt(req.body.year) : new Date().getFullYear(),
        kmDriven: req.body.kmDriven ? parseInt(req.body.kmDriven) : 0,
        sellerId: userId,
      };
      
      console.log("Processed body before validation:", processedBody);
      console.log("Types:", {
        price: typeof processedBody.price,
        year: typeof processedBody.year,
        kmDriven: typeof processedBody.kmDriven
      });
      
      const vehicleData = insertVehicleSchema.parse(processedBody);
      console.log("Parsed vehicle data:", vehicleData);
      
      const vehicle = await storage.createVehicle(vehicleData);
      console.log("Vehicle created successfully:", vehicle);
      res.json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({ message: "Failed to create vehicle", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put('/api/vehicles/:id', isAuth, async (req: any, res) => {
    try {
      const id = req.params.id;
      const userId = req.session.userId;
      
      // Check if user owns the vehicle or is admin
      const existingVehicle = await storage.getVehicle(id);
      if (!existingVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const user = await storage.getUser(userId);
      if (existingVehicle.sellerId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized to update this vehicle" });
      }

      // Convert string numbers to actual numbers if they exist
      const processedUpdateBody = { ...req.body };
      if (req.body.price) processedUpdateBody.price = parseFloat(req.body.price);
      if (req.body.year) processedUpdateBody.year = parseInt(req.body.year);
      if (req.body.kmDriven) processedUpdateBody.kmDriven = parseInt(req.body.kmDriven);
      
      const vehicleData = insertVehicleSchema.partial().parse(processedUpdateBody);
      const vehicle = await storage.updateVehicle(id, vehicleData);
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  // Update vehicle status (mark as sold, pending, etc.)
  app.patch('/api/vehicles/:id/status', isAuth, async (req: any, res) => {
    try {
      const id = req.params.id;
      const userId = req.session.userId;
      const { status } = req.body;
      
      if (!['available', 'pending', 'sold'].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'available', 'pending', or 'sold'" });
      }
      
      // Check if user owns the vehicle or is admin
      const existingVehicle = await storage.getVehicle(id);
      if (!existingVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const user = await storage.getUser(userId);
      if (existingVehicle.sellerId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized to update this vehicle" });
      }

      const updateData: any = { status };
      if (status === 'sold') {
        updateData.soldAt = new Date();
      } else if (status === 'available') {
        updateData.soldAt = null;
      }

      const vehicle = await storage.updateVehicle(id, updateData);
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      res.status(500).json({ message: "Failed to update vehicle status" });
    }
  });

  app.delete('/api/vehicles/:id', isAuth, async (req: any, res) => {
    try {
      const id = req.params.id;
      const userId = req.session.userId;
      
      // Check if user owns the vehicle or is admin
      const existingVehicle = await storage.getVehicle(id);
      if (!existingVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const user = await storage.getUser(userId);
      if (existingVehicle.sellerId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized to delete this vehicle" });
      }

      await storage.deleteVehicle(id);
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Chat routes
  app.get('/api/chat-rooms', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const chatRooms = await storage.getChatRooms(userId);
      res.json(chatRooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      res.status(500).json({ message: "Failed to fetch chat rooms" });
    }
  });

  app.get('/api/chat-rooms/:id', isAuth, async (req: any, res) => {
    try {
      const id = req.params.id;
      const chatRoom = await storage.getChatRoomWithMessages(id);
      if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
      }
      res.json(chatRoom);
    } catch (error) {
      console.error("Error fetching chat room:", error);
      res.status(500).json({ message: "Failed to fetch chat room" });
    }
  });

  app.post('/api/chat-rooms', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { vehicleId } = req.body;
      
      // Check if chat room already exists
      const existingChatRoom = await storage.getChatRoom(vehicleId, userId);
      if (existingChatRoom) {
        // Return existing chat room with messages
        const chatRoomWithMessages = await storage.getChatRoomWithMessages(existingChatRoom._id.toString());
        
        return res.json(chatRoomWithMessages);
      }
      
      // Get vehicle details to get seller ID
      const vehicle = await storage.getVehicle(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const chatRoomData = insertChatRoomSchema.parse({
        vehicleId,
        buyerId: userId,
        sellerId: vehicle.sellerId,
      });
      
      const chatRoom = await storage.createChatRoom(chatRoomData);
      const chatRoomWithMessages = await storage.getChatRoomWithMessages(chatRoom._id.toString());
      res.json(chatRoomWithMessages);
    } catch (error) {
      console.error("Error creating chat room:", error);
      res.status(500).json({ message: "Failed to create chat room" });
    }
  });

  app.post('/api/chat-rooms/:id/messages', isAuth, async (req: any, res) => {
    try {
      const chatRoomId = req.params.id;
      const userId = req.session.userId;
      const { content } = req.body;
      
      // Verify user is part of the chat room
      const chatRoom = await storage.getChatRoomWithMessages(chatRoomId);
      if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
      }
      
      if (chatRoom.buyerId !== userId && chatRoom.sellerId !== userId) {
        return res.status(403).json({ message: "Unauthorized to send messages in this chat room" });
      }
      
      const messageData = insertMessageSchema.parse({
        chatRoomId,
        senderId: userId,
        content,
      });
      
      const message = await storage.addMessage(messageData);
      const sender = await storage.getUser(userId);
      const messageWithSender = {
        ...message,
        _id: message._id || message.id,
        id: message._id || message.id,
        createdAt: message.createdAt || new Date().toISOString(),
        sender: {
          id: sender?.id || sender?._id || "",
          firstName: sender?.firstName || "",
          lastName: sender?.lastName || "",
          profileImageUrl: sender?.profileImageUrl || "",
        },
      };

      // Broadcast message to WebSocket clients IMMEDIATELY
      const buyerId = typeof chatRoom.buyerId === 'string' ? chatRoom.buyerId : chatRoom.buyerId.toString();
      const sellerId = typeof chatRoom.sellerId === 'string' ? chatRoom.sellerId : chatRoom.sellerId.toString();
      
      const broadcastMessage = {
        type: 'new_message',
        message: messageWithSender,
        chatRoomId: chatRoomId,
      };
      
      // Broadcast to all connected clients for instant delivery
      clients.forEach((clientWs, clientUserId) => {
        if ((clientUserId === buyerId || clientUserId === sellerId) && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify(broadcastMessage));
        }
      });
      
      res.json(messageWithSender);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/users', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/admin/create-sample-data', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      console.log("Admin requested sample data creation");
      const success = await createSampleData();
      
      if (success) {
        res.json({ message: "Sample data created successfully" });
      } else {
        res.status(500).json({ message: "Failed to create sample data" });
      }
    } catch (error) {
      console.error("Error creating sample data:", error);
      res.status(500).json({ message: "Failed to create sample data" });
    }
  });

  app.post('/api/admin/create-test-users', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      console.log("Admin requested test users creation");
      const testUsers = await createTestUsers();
      
      if (testUsers) {
        res.json({ 
          message: "Test users created successfully",
          users: {
            buyer1: { email: "buyer1@test.com", password: "test123" },
            buyer2: { email: "buyer2@test.com", password: "test123" },
            seller1: { email: "seller1@test.com", password: "test123" }
          }
        });
      } else {
        res.status(500).json({ message: "Failed to create test users" });
      }
    } catch (error) {
      console.error("Error creating test users:", error);
      res.status(500).json({ message: "Failed to create test users" });
    }
  });

  app.post('/api/admin/clear-chat-data', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      console.log("Admin requested chat data clearing");
      const success = await clearAllChatData();
      
      if (success) {
        res.json({ message: "All chat data cleared successfully" });
      } else {
        res.status(500).json({ message: "Failed to clear chat data" });
      }
    } catch (error) {
      console.error("Error clearing chat data:", error);
      res.status(500).json({ message: "Failed to clear chat data" });
    }
  });

  app.post('/api/admin/setup-fresh-chat', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      console.log("Admin requested fresh chat system setup");
      const result = await setupFreshChatSystem();
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json({ message: "Failed to setup fresh chat system", error: result.error });
      }
    } catch (error) {
      console.error("Error setting up fresh chat system:", error);
      res.status(500).json({ message: "Failed to setup fresh chat system" });
    }
  });

  // Favorites API routes
  app.post('/api/favorites/:vehicleId', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { vehicleId } = req.params;
      
      await storage.addToFavorites(userId, vehicleId);
      res.json({ message: "Added to favorites" });
    } catch (error: any) {
      if (error.message === 'Vehicle already in favorites') {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete('/api/favorites/:vehicleId', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { vehicleId } = req.params;
      
      await storage.removeFromFavorites(userId, vehicleId);
      res.json({ message: "Removed from favorites" });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  app.get('/api/favorites', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.get('/api/favorites/:vehicleId/status', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { vehicleId } = req.params;
      
      const isFavorite = await storage.isFavorite(userId, vehicleId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const clients = new Map<string, WebSocket>();

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'authenticate') {
          clients.set(message.userId, ws);
          ws.send(JSON.stringify({ type: 'authenticated', userId: message.userId }));
        } else if (message.type === 'chat_message') {
          // Validate required fields for chat messages
          if (!message.chatRoomId || !message.senderId || !message.content) {
            ws.send(JSON.stringify({ type: 'error', message: 'Missing required fields for chat message' }));
            return;
          }
          
          const messageData = insertMessageSchema.parse({
            chatRoomId: message.chatRoomId,
            senderId: message.senderId,
            content: message.content,
          });
          
          const newMessage = await storage.addMessage(messageData);
          const sender = await storage.getUser(message.senderId);
          const messageWithSender = {
            ...newMessage,
            _id: newMessage._id || newMessage.id,
            id: newMessage._id || newMessage.id,
            createdAt: newMessage.createdAt || new Date().toISOString(),
            sender: {
              id: sender?.id || sender?._id || "",
              firstName: sender?.firstName || "",
              lastName: sender?.lastName || "",
              profileImageUrl: sender?.profileImageUrl || "",
            },
          };
          
          // Get chat room details to notify both buyer and seller
          const chatRoom = await storage.getChatRoomWithMessages(message.chatRoomId);
          if (chatRoom) {
            const buyerId = typeof chatRoom.buyerId === 'string' ? chatRoom.buyerId : chatRoom.buyerId.toString();
            const sellerId = typeof chatRoom.sellerId === 'string' ? chatRoom.sellerId : chatRoom.sellerId.toString();
            
            const broadcastMessage = {
              type: 'new_message',
              message: messageWithSender,
              chatRoomId: message.chatRoomId,
            };
            
            // Broadcast to all connected clients for instant delivery
            clients.forEach((clientWs, userId) => {
              if ((userId === buyerId || userId === sellerId) && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify(broadcastMessage));
              }
            });
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Remove client from map
      let clientUserId = '';
      
      // Find the userId associated with this WebSocket
      clients.forEach((client, userId) => {
        if (client === ws) {
          clientUserId = userId;
        }
      });
      
      // Delete the entry if found
      if (clientUserId) {
        clients.delete(clientUserId);
      }
      
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
