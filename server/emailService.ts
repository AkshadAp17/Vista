import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akshadapastambh37@gmail.com',
    pass: 'urxpqhiqtjuhmcrs'
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: 'akshadapastambh37@gmail.com',
      to,
      subject,
      html
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
export const createVerificationEmail = (verificationCode: string) => {
  return {
    subject: 'Email Verification',
    html: `
      <h1>Verify Your Email</h1>
      <p>Your verification code is: <strong>${verificationCode}</strong></p>
      <p>This code will expire in 1 hour.</p>
    `
  };
};

export const createPasswordResetEmail = (resetCode: string) => {
  return {
    subject: 'Password Reset Request',
    html: `
      <h1>Reset Your Password</h1>
      <p>Your password reset code is: <strong>${resetCode}</strong></p>
      <p>This code will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };
};

export const createWelcomeEmail = (firstName: string) => {
  return {
    subject: 'Welcome to Our Platform',
    html: `
      <h1>Welcome ${firstName}!</h1>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `
  };
}; 