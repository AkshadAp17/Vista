import bcrypt from 'bcryptjs';
import { User } from './models';

export const setupAdminUser = async () => {
  try {
    const adminEmail = 'akshadapastambh37@gmail.com';
    const adminPassword = 'Akshad@11';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    await User.create({
      id: 'admin-' + Date.now(),
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
      isEmailVerified: true,
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}; 