import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "../server/routes";
import { AuthService } from "../server/auth";
import { connectDB } from "../server/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set default session secret if not provided - use environment variable in production
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = "dev-session-secret-change-in-production";
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Add CORS middleware for production
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://hema-motor.vercel.app',
    'https://hemamotor.com',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Initialize database and admin user
let isInitialized = false;
const initializeApp = async () => {
  if (isInitialized) return;
  
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB Atlas');

    // Initialize admin user
    try {
      await AuthService.initializeAdmin();
      console.log('Admin user initialized successfully');
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }

    isInitialized = true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Register routes
const setupRoutes = async () => {
  await initializeApp();
  await registerRoutes(app);
  
  // Serve static files from dist/public for frontend
  const staticPath = path.join(__dirname, '..', 'dist', 'public');
  app.use(express.static(staticPath));
  
  // Catch-all handler: send back React's index.html file for any non-API routes
  app.get('*', (req: Request, res: Response) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(staticPath, 'index.html'));
  });
  
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Check if headers have already been sent
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    
    console.error("Error:", err);
  });

  return app;
};

// Export for Vercel
export default async (req: Request, res: Response) => {
  const app = await setupRoutes();
  return app(req, res);
};