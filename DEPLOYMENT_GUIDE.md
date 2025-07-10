# Hema Motor - Vercel Deployment Guide

## Overview
This guide will help you deploy your Hema Motor application (motorcycle marketplace) to Vercel. The application includes both frontend (React) and backend (Node.js/Express) components.

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Your project code pushed to GitHub, GitLab, or Bitbucket
3. MongoDB Atlas database (or any MongoDB instance)
4. SMTP credentials for email functionality

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/hema-motor.git
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas (if not already done)

1. Go to https://cloud.mongodb.com
2. Create a new project or use existing
3. Create a new cluster (free tier works fine)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0 for Vercel)
6. Get your connection string (looks like: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hema-motor)

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Node.js project
5. Configure the following:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Option B: Using Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to link your project

## Step 4: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hema-motor
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=akshadapastambh37@gmail.com
ADMIN_PASSWORD=Akshad@11
NODE_ENV=production
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- For Gmail, use App Passwords instead of regular password
- Keep your current admin credentials or update them as needed

## Step 5: Test Your Deployment

1. After deployment, Vercel will provide a URL like: https://hema-motor.vercel.app
2. Test the following:
   - Landing page loads
   - Login/signup works
   - Vehicle listings display
   - Admin dashboard functions
   - Chat system works
   - Email notifications work

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain (e.g., hemamotor.com)
3. Follow DNS configuration instructions
4. Vercel will automatically provide SSL certificate

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes
   - Check build logs in Vercel dashboard

2. **Database Connection Issues:**
   - Verify MongoDB URI is correct
   - Check network access settings in MongoDB Atlas
   - Ensure environment variables are set correctly

3. **Email Not Working:**
   - Verify SMTP credentials
   - Check spam folders
   - Ensure less secure apps are enabled (for Gmail)

4. **API Routes Not Working:**
   - Check `vercel.json` configuration
   - Verify API routes are properly defined
   - Check function logs in Vercel dashboard

## File Structure for Vercel

Your project structure should look like:
```
hema-motor/
├── api/             # Vercel API routes (serverless functions)
│   ├── index.ts     # Main API handler
│   └── [...slug].ts # Catch-all API route
├── server/          # Backend code (shared with API)
├── client/          # React frontend
├── shared/          # Shared types/schemas
├── dist/           # Build output
├── vercel.json     # Vercel configuration
└── package.json    # Dependencies
```

## Backend Architecture for Vercel

Your backend is now configured as serverless functions for Vercel:

1. **API Routes**: All backend functionality is accessible via `/api/*` endpoints
2. **Serverless Functions**: Each API request spawns a new serverless function
3. **Database Connection**: MongoDB connection is established per function call
4. **Session Management**: Uses in-memory session storage (consider Redis for production)
5. **WebSocket Support**: May need additional configuration for real-time features

## Important Notes for Backend Deployment

### WebSocket Limitations
Vercel's serverless functions don't support WebSocket connections. For your chat system, you have two options:

1. **HTTP-only Chat (Recommended for Vercel):**
   - Use polling or Server-Sent Events instead of WebSockets
   - Messages are sent via HTTP POST requests
   - Frontend polls for new messages every few seconds

2. **Separate WebSocket Service:**
   - Deploy WebSocket server on a different platform (Railway, Render, etc.)
   - Keep HTTP API on Vercel for all other functionality
   - Update frontend to connect to separate WebSocket endpoint

### Session Storage
For production on Vercel, consider:
- **Redis**: Use services like Upstash Redis for session storage
- **JWT Tokens**: Replace sessions with JWT tokens for stateless authentication
- **Database Sessions**: Store sessions in MongoDB (current setup uses memory)

## Performance Optimization

1. **Enable Caching:**
   - Static assets are automatically cached by Vercel
   - Consider implementing Redis for session storage in production

2. **Image Optimization:**
   - Use Vercel's image optimization features
   - Compress vehicle images before upload

3. **Database Optimization:**
   - Use MongoDB Atlas for better performance
   - Implement proper indexing for search queries

## Monitoring and Logs

1. **Vercel Dashboard:**
   - Monitor function execution
   - Check build logs
   - View real-time logs

2. **MongoDB Atlas:**
   - Monitor database performance
   - Set up alerts for connection issues

## Security Considerations

1. **Environment Variables:**
   - Never commit secrets to Git
   - Use Vercel's environment variable system
   - Rotate passwords regularly

2. **CORS Configuration:**
   - Ensure proper CORS settings for production domain
   - Update allowed origins in Express configuration

## Support

If you encounter issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review build logs in Vercel dashboard
3. Test locally first with `npm run build && npm start`
4. Contact support if needed

Your Hema Motor application is now ready for production deployment on Vercel!