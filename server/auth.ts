import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";

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
    pass: process.env.EMAIL_PASS,
  },
});

export class AuthService {
  static async signup(data: SignupData) {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Check if this is the admin email
    const isAdmin = data.email === "akshadapastambh37@gmail.com";

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
      profileImageUrl: null,
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

    // Create admin user with email verification required
    const hashedPassword = await bcrypt.hash("Akshad@11", 12);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const adminUser = await storage.upsertUser({
      id: randomUUID(),
      email: "akshadapastambh37@gmail.com",
      password: hashedPassword,
      firstName: "Shubam",
      lastName: "Pujari",
      profileImageUrl: null,
      isAdmin: true,
      isEmailVerified: false, // Admin must verify email
      verificationCode: verificationCode,
      verificationCodeExpiry: verificationCodeExpiry,
    });

    // Send verification email to admin
    try {
      await this.sendVerificationEmail("akshadapastambh37@gmail.com", verificationCode);
      console.log("Admin verification email sent successfully");
    } catch (error) {
      console.error("Failed to send admin verification email:", error);
    }

    return adminUser;
  }

  static async sendVerificationEmail(email: string, verificationCode: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification - Hema Motor",
      html: `
        <h2>Welcome to Hema Motor!</h2>
        <p>Please verify your email address by using this verification code:</p>
        <h3 style="color: #f97316; font-size: 24px; letter-spacing: 3px;">${verificationCode}</h3>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account with Hema Motor, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
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
      verificationCode: null,
      verificationCodeExpiry: null,
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
}