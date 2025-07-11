#!/usr/bin/env node

// Build script for Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Hema Motor for Vercel...');

try {
  // Build the frontend with Vite
  console.log('📦 Building frontend...');
  execSync('vite build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Verify the build output exists
  const distPath = path.join(process.cwd(), 'dist/public');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log('✅ Frontend build successful!');
    console.log('📁 Build files:', files.join(', '));
  } else {
    throw new Error('Build output directory not found');
  }

  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}