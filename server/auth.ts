import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { createSampleData } from "./sampleData";

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

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export class AuthService {
  static async signup(data: SignupData) {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Regular users are never admin by default
    // Admin accounts are created manually by the website creator
    const isAdmin = false;

    // Generate verification code for ALL users including admin
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await storage.upsertUser({
      id: randomUUID(),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      profileImageUrl: undefined,
      isAdmin: isAdmin,
      isEmailVerified: false, // ALL users including admin need email verification
      verificationCode: verificationCode,
      verificationCodeExpiry: verificationCodeExpiry,
    });

    // Send verification email to ALL users including admin
    try {
      await this.sendVerificationEmail(data.email, verificationCode);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't throw error, allow user creation to succeed
    }

    return user;
  }

  static async initializeAdmin() {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail("akshadapastambh37@gmail.com");
    if (existingAdmin) {
      return existingAdmin;
    }

    // Create admin user with email already verified
    const hashedPassword = await bcrypt.hash("Akshad@11", 12);
    
    const adminUser = await storage.upsertUser({
      id: randomUUID(),
      email: "akshadapastambh37@gmail.com",
      password: hashedPassword,
      firstName: "Akshada",
      lastName: "Pastambh",
      profileImageUrl: undefined,
      isAdmin: true,
      isEmailVerified: true, // Admin is already verified
      verificationCode: undefined,
      verificationCodeExpiry: undefined,
    });

    console.log("Admin user created successfully");
    
    // Initialize fresh chat system after admin creation
    console.log("Setting up fresh chat system...");
    const { setupFreshChatSystem } = await import('./freshSetup');
    await setupFreshChatSystem();
    
    return adminUser;
  }

  static async sendVerificationEmail(email: string, verificationCode: string) {
    try {
      // Check if email credentials are available
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log(`[DEV MODE] Verification code for ${email}: ${verificationCode}`);
        return;
      }
      
      const { sendEmail, createVerificationEmail } = await import('./emailService');
      const emailTemplate = createVerificationEmail(verificationCode);
      
      await sendEmail(email, emailTemplate.subject, emailTemplate.html);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Log the verification code for development
      console.log(`[DEV MODE] Verification code for ${email}: ${verificationCode}`);
    }
  }

  static async sendPasswordResetEmail(email: string, resetCode: string) {
    try {
      // Check if email credentials are available
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log(`[DEV MODE] Password reset code for ${email}: ${resetCode}`);
        return;
      }
      
      const { sendEmail, createPasswordResetEmail } = await import('./emailService');
      const emailTemplate = createPasswordResetEmail(resetCode);
      
      await sendEmail(email, emailTemplate.subject, emailTemplate.html);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      // Log the reset code for development
      console.log(`[DEV MODE] Password reset code for ${email}: ${resetCode}`);
    }
  }

  static async verifyEmail(email: string, verificationCode: string) {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.verificationCode !== verificationCode) {
      throw new Error("Invalid verification code");
    }

    if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
      throw new Error("Verification code has expired");
    }

    // Update user to mark email as verified
    await storage.updateUser(user.id, {
      isEmailVerified: true,
      verificationCode: undefined,
      verificationCodeExpiry: undefined,
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

    // Check if email is verified (required for ALL users including admin)
    if (!user.isEmailVerified) {
      throw new Error("Please verify your email before logging in. Check your email for verification code.");
    }

    return user;
  }

  // Secure admin creation - only for website creator during deployment
  static async createFirstAdmin(data: SignupData & { adminSecret: string }) {
    // Check if any admin already exists
    const hasAdmin = await storage.hasAdminUsers();
    if (hasAdmin) {
      throw new Error("Admin account already exists. Only one admin allowed.");
    }

    // Verify admin creation secret (you should set this as an environment variable)
    if (data.adminSecret !== process.env.ADMIN_CREATION_SECRET) {
      throw new Error("Invalid admin creation secret.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create admin user with verified email (no verification needed for admin)
    const adminUser = await storage.upsertUser({
      id: randomUUID(),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      profileImageUrl: undefined,
      isAdmin: true,
      isEmailVerified: true, // Admin is auto-verified
      verificationCode: undefined,
      verificationCodeExpiry: undefined,
    });

    return adminUser;
  }
}