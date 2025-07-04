import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { randomUUID } from "crypto";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  static async signup(data: SignupData) {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Check if this is the first user (should be admin)
    const stats = await storage.getStats();
    const isFirstUser = stats.totalUsers === 0;

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await storage.upsertUser({
      id: randomUUID(),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      profileImageUrl: null,
      isAdmin: isFirstUser, // First user becomes admin
    });

    return user;
  }

  static async login(data: LoginData) {
    // Find user by email
    const user = await storage.getUserByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
}