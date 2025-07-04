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

    // Check if this is the admin email
    const isAdmin = data.email === "akshadapstambh37@gmail.com";

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
      isAdmin: isAdmin,
    });

    return user;
  }

  static async initializeAdmin() {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail("akshadapstambh37@gmail.com");
    if (existingAdmin) {
      return existingAdmin;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Akshad@11", 12);
    const adminUser = await storage.upsertUser({
      id: randomUUID(),
      email: "akshadapstambh37@gmail.com",
      password: hashedPassword,
      firstName: "Shubam",
      lastName: "Pujari",
      profileImageUrl: null,
      isAdmin: true,
    });

    return adminUser;
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