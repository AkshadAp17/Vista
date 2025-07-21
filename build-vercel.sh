#!/bin/bash
echo "Building for Vercel deployment..."

# Build the frontend
echo "Building frontend with Vite..."
npx vite build

# Check if build was successful
if [ -d "dist/public" ]; then
    echo "✅ Build successful! Files created in dist/public/"
    ls -la dist/public/
else
    echo "❌ Build failed - dist/public directory not found"
    exit 1
fi

echo "🚀 Ready for Vercel deployment!"