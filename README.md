# Hema Motor 🏍️

A modern, full-stack marketplace for buying and selling two-wheelers including motorcycles, scooters, and electric vehicles. Built with React, Node.js, and real-time messaging capabilities.

## ✨ Features

### 🔐 Authentication & Security
- Secure authentication system using Replit Auth (OpenID Connect)
- Password hashing with bcrypt
- Role-based access control with admin privileges
- Forgot password functionality with 2-step verification
- Secure session management

### 🏍️ Vehicle Management
- Complete CRUD operations for vehicle listings
- Advanced search and filtering (location, price, type, brand, vehicle ID)
- Featured vehicles system
- Image uploads with base64 storage
- Vehicle status tracking (available, pending, sold)
- Auto-generated vehicle numbering (e.g., VH001)

### 🔍 Smart Search System
- Real-time search with instant filtering
- Search by location, price range, vehicle type, and keywords
- Conditional display logic (featured vehicles hidden during search)
- Clear filters functionality
- Dynamic result labeling

### 💬 Real-time Chat System
- WebSocket-based messaging between buyers and sellers
- Organized chat rooms per vehicle listing
- Persistent message history
- WhatsApp-style instant messaging with optimistic updates
- Relative time formatting
- Chat request notifications

### 👤 User Management
- Comprehensive profile and settings management
- Admin and user dashboards
- Password change functionality
- Phone number management

### 🎨 Modern UI/UX
- Tailwind CSS with custom design system
- Radix UI primitives with shadcn/ui components
- Dark gradients and smooth animations
- Bicycle-themed branding with orange accent colors
- Professional split-screen login/signup layouts
- Enhanced mobile responsiveness

### 🌟 Social Features
- Like/share functionality for vehicle listings
- Local storage for user preferences
- Business card component for company information

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js REST API
- **Real-time**: WebSocket support with `ws` library
- **Database**: MongoDB with Mongoose ODM
- **Session Storage**: PostgreSQL with connect-pg-simple
- **ORM**: Drizzle ORM

### Development & Deployment
- **Development DB**: MongoDB Memory Server
- **Email Service**: Gmail SMTP for OTP verification
- **Platform Integration**: Replit Auth and environment configuration
- **Deployment**: Vercel-optimized builds
- **Build Tools**: esbuild (backend), Vite (frontend)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- PostgreSQL (for sessions)
- Replit account (for authentication)
- Gmail account (for email service)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hema-motor
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# If using separate client/server setup
cd client
npm install
cd ../server
npm install
```

### 3. Environment Configuration
Create `.env` files in both root and backend directories:

**Root `.env`:**
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

**Backend `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/hema-motor
POSTGRESQL_URL=postgresql://username:password@localhost:5432/sessions
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_client_secret
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_app_password
SESSION_SECRET=your_session_secret
PORT=3001
```

### 4. Database Setup
```bash
# Start MongoDB service
sudo systemctl start mongod

# Start PostgreSQL service
sudo systemctl start postgresql

# Run database migrations (if any)
cd backend
npm run migrate
```

### 5. Start Development Servers
```bash
# Using the build script
npm run build

# Or start individual services
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
npm run dev

# Using Docker (if preferred)
docker build -t hema-motor .
docker run -p 3000:3000 hema-motor
```

Visit `http://localhost:5173` to access the application.

## 📁 Project Structure

```
hema-motor/
├── api/                   # Backend API routes and logic
├── client/                # Frontend React application
├── scripts/               # Build and deployment scripts
├── server/                # Server configuration and setup
├── shared/                # Shared utilities and types
├── .dockerignore          # Docker ignore file
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── Dockerfile             # Docker container configuration
├── Procfile               # Process file for deployment
├── README.md              # Project documentation
├── VERCEL_FIX.md          # Vercel deployment fixes
├── build.js               # Build configuration
├── build-vercel.sh        # Vercel build script
├── components.json        # UI components configuration
├── cookies.txt            # Cookie configuration
└── admin_*.txt            # Admin configuration files
```

## 🔧 Available Scripts

### Root Level
```bash
npm run build        # Build entire application using build.js
npm run dev          # Start development environment
npm run start        # Start production server
npm run deploy       # Deploy to production
```

### Client (Frontend)
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Server (Backend)
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
```

### Scripts Directory
```bash
./scripts/build.sh   # Custom build scripts
./build-vercel.sh    # Vercel-specific build process
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### Vehicles
- `GET /api/vehicles` - Get all vehicles with filters
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle listing
- `PUT /api/vehicles/:id` - Update vehicle listing
- `DELETE /api/vehicles/:id` - Delete vehicle listing

### Chat
- `GET /api/chats/:vehicleId` - Get chat messages for vehicle
- `POST /api/chats/:vehicleId` - Send message
- WebSocket: `/ws` - Real-time messaging

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

## 🎨 Design System

The application uses a consistent design system with:
- **Primary Colors**: Orange accent (#F97316) with dark gradients
- **Typography**: Modern, clean fonts with proper hierarchy
- **Components**: Reusable UI components following atomic design principles
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Animations**: Smooth transitions and micro-interactions

## 📱 Mobile Responsiveness

All components are optimized for mobile devices including:
- Responsive navigation and search bar
- Optimized vehicle card layouts
- Touch-friendly chat interface
- Mobile-specific login/signup flows

## 🔒 Security Features

- Password hashing with bcrypt
- Secure session management
- CORS protection
- Input validation with Zod
- Rate limiting on API endpoints
- SQL injection prevention
- XSS protection

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Use the provided `build-vercel.sh` script for deployment
4. Check `VERCEL_FIX.md` for deployment troubleshooting

### Docker Deployment
```bash
# Build Docker image
docker build -t hema-motor .

# Run container
docker run -p 3000:3000 -d hema-motor

# With environment file
docker run --env-file .env -p 3000:3000 -d hema-motor
```

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy using your hosting provider
# Files will be built according to build.js configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Recent Updates (January 2025)

- ✅ Removed browse categories for focused search experience
- ✅ Streamlined homepage with search-first approach
- ✅ Enhanced price range filter handling
- ✅ Improved conditional display logic for featured vehicles
- ✅ Added clear filters functionality
- ✅ Better search result labeling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🙏 Acknowledgments

- Replit for authentication services
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- MongoDB and PostgreSQL for reliable data storage

---

Built with ❤️ for the two-wheeler community
#   U R L  
 #   U R L  
 