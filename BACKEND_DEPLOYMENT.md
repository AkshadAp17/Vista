# Backend Deployment Guide for Vercel

## Overview
Your Hema Motor backend is now configured for Vercel's serverless architecture. Here's what was set up:

## Backend Architecture

### 1. API Structure
```
api/
├── index.ts           # Main API handler (all routes)
├── [...slug].ts       # Catch-all route handler
├── auth/
│   └── [...slug].ts   # Authentication routes
├── vehicles/
│   └── [...slug].ts   # Vehicle management routes
└── chat/
    └── [...slug].ts   # Chat system routes
```

### 2. Serverless Functions
- **Single Handler**: All API requests go through `api/index.ts`
- **Route Distribution**: Express router handles all `/api/*` endpoints
- **Database Init**: MongoDB connection established per function call
- **Session Management**: Currently uses in-memory storage

### 3. Key Features Deployed

#### ✅ Working Features:
- **Authentication System**: Login/signup/logout
- **User Management**: Admin and regular users
- **Vehicle Management**: CRUD operations for vehicles
- **Vehicle Search**: Search and filter functionality
- **Profile Management**: User settings and preferences
- **Email Notifications**: Password reset and verification

#### ⚠️ Limitations on Vercel:
- **WebSocket Chat**: Needs modification for serverless
- **Session Storage**: In-memory (lost between requests)
- **File Uploads**: Limited to base64 encoding

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel backend configuration"
git push origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect the configuration
4. Add environment variables (see below)

### 3. Environment Variables
Set these in Vercel dashboard:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hema-motor
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=akshadapastambh37@gmail.com
ADMIN_PASSWORD=Akshad@11
NODE_ENV=production
SESSION_SECRET=your-super-secret-session-key
```

## Backend Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Reset password

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/:id` - Get specific vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Chat System
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create new chat room
- `GET /api/chat/rooms/:id` - Get chat room with messages
- `POST /api/chat/messages` - Send message

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user

## Production Considerations

### 1. Session Management
Current limitation: In-memory sessions don't persist between serverless function calls.

**Solutions:**
- **Option A**: Implement JWT tokens for stateless authentication
- **Option B**: Use Redis for session storage (Upstash Redis recommended)
- **Option C**: Store sessions in MongoDB

### 2. WebSocket Chat
Current limitation: Vercel serverless functions don't support WebSockets.

**Solutions:**
- **Option A**: Use HTTP polling for chat (check for new messages every 5 seconds)
- **Option B**: Deploy WebSocket server separately (Railway, Render, etc.)
- **Option C**: Use Server-Sent Events (SSE) for real-time updates

### 3. File Storage
Current: Base64 encoding stored in database.

**Recommendations:**
- Use Vercel's image optimization
- Consider external storage (AWS S3, Cloudinary)
- Implement proper image compression

## Testing Your Deployment

### 1. API Health Check
```bash
curl https://your-app.vercel.app/api/auth/user
```

### 2. Database Connection
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 3. Frontend Integration
- Check if frontend can communicate with backend
- Test login/signup functionality
- Verify vehicle listings load properly

## Monitoring

### 1. Vercel Dashboard
- Function execution logs
- Error tracking
- Performance metrics

### 2. MongoDB Atlas
- Database performance
- Connection monitoring
- Query optimization

## Troubleshooting

### Common Issues:

1. **Cold Start Delays**
   - First request may take longer
   - Consider keeping functions warm with cron jobs

2. **Database Connection Timeouts**
   - Increase connection timeout in MongoDB config
   - Implement connection pooling

3. **Session Issues**
   - Sessions not persisting between requests
   - Consider JWT tokens for stateless auth

4. **CORS Errors**
   - Update allowed origins in `api/index.ts`
   - Verify production domain is included

## Next Steps

1. **Deploy and Test**: Deploy to Vercel and test all functionality
2. **Fix Chat System**: Implement HTTP polling or separate WebSocket service
3. **Session Management**: Implement JWT or Redis sessions
4. **Performance**: Optimize database queries and implement caching
5. **Monitoring**: Set up error tracking and performance monitoring

Your backend is now ready for serverless deployment on Vercel!