import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as bcrypt from "bcryptjs";
import { storage } from "./storage";
import { getSession } from "./replitAuth";
import { AuthService } from "./auth";
import { insertVehicleSchema, insertChatRoomSchema, insertMessageSchema } from "@shared/schema";

// Extend Express session to include userId
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(getSession());

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
      res.json({ message: "Logged out successfully" });
    });
  });

  // Profile update route
  app.put('/api/auth/profile', isAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { firstName, lastName, email } = req.body;
      
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if email is already used by another user
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      const updatedUser = await storage.updateUser(userId, { firstName, lastName, email });
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

  app.get('/api/auth/user', isAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin, isEmailVerified: user.isEmailVerified });
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
      const id = parseInt(req.params.id);
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
      const userId = req.session.userId;
      const vehicleData = insertVehicleSchema.parse({
        ...req.body,
        sellerId: userId,
      });
      
      const vehicle = await storage.createVehicle(vehicleData);
      res.json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.put('/api/vehicles/:id', isAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
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

      const vehicleData = insertVehicleSchema.partial().parse(req.body);
      const vehicle = await storage.updateVehicle(id, vehicleData);
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete('/api/vehicles/:id', isAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
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
        return res.json(existingChatRoom);
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
      res.json(chatRoom);
    } catch (error) {
      console.error("Error creating chat room:", error);
      res.status(500).json({ message: "Failed to create chat room" });
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
          const messageData = insertMessageSchema.parse({
            chatRoomId: message.chatRoomId,
            senderId: message.senderId,
            content: message.content,
          });
          
          const newMessage = await storage.addMessage(messageData);
          const messageWithSender = {
            ...newMessage,
            sender: await storage.getUser(message.senderId),
          };
          
          // Get chat room details to notify both buyer and seller
          const chatRoom = await storage.getChatRoomWithMessages(message.chatRoomId);
          if (chatRoom) {
            const buyerWs = clients.get(chatRoom.buyerId);
            const sellerWs = clients.get(chatRoom.sellerId);
            
            const broadcastMessage = {
              type: 'new_message',
              message: messageWithSender,
              chatRoomId: message.chatRoomId,
            };
            
            if (buyerWs && buyerWs.readyState === WebSocket.OPEN) {
              buyerWs.send(JSON.stringify(broadcastMessage));
            }
            
            if (sellerWs && sellerWs.readyState === WebSocket.OPEN) {
              sellerWs.send(JSON.stringify(broadcastMessage));
            }
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Remove client from map
      for (const [userId, client] of clients.entries()) {
        if (client === ws) {
          clients.delete(userId);
          break;
        }
      }
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
