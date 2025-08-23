# Hema Motor 🏍️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue)](https://www.postgresql.org/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-success)](https://vista-3.onrender.com/)

A modern, full-stack marketplace for buying and selling two-wheelers including motorcycles, scooters, and electric vehicles. Built with React, Node.js, and real-time messaging capabilities.

## 🌐 Live Demo

**🚀 [View Live Application](https://vista-3.onrender.com/)**

Experience the full functionality of Hema Motor with our live demo deployment. The application includes all features mentioned below and is hosted on Render for optimal performance.

## 🌟 Features

### 🔐 Authentication & Security
- **Secure Authentication**: OAuth integration with Replit Auth (OpenID Connect)
- **Password Security**: bcrypt hashing with salt rounds
- **Role-Based Access**: Admin and user privilege management
- **Password Recovery**: 2-step verification with OTP via email
- **Session Management**: Secure session handling with PostgreSQL storage

### 🏍️ Vehicle Management
- **Complete CRUD**: Full vehicle listing management
- **Advanced Search**: Multi-parameter filtering (location, price, type, brand, vehicle ID)
- **Featured Listings**: Promotional vehicle showcase system
- **Media Upload**: Base64 image storage with compression
- **Status Tracking**: Real-time vehicle availability (available, pending, sold)
- **Smart Numbering**: Auto-generated vehicle IDs (VH001, VH002, etc.)

### 🔍 Intelligent Search System
- **Real-Time Search**: Instant results with debounced input
- **Multi-Filter Support**: Location, price range, vehicle type, and keyword search
- **Dynamic Results**: Conditional display logic for featured vehicles
- **Filter Management**: Clear all filters functionality
- **Result Analytics**: Dynamic result count and categorization

### 💬 Real-Time Chat System
- **WebSocket Messaging**: Instant communication between buyers and sellers
- **Organized Rooms**: Vehicle-specific chat channels
- **Message Persistence**: Complete chat history storage
- **Optimistic Updates**: WhatsApp-style instant message delivery
- **Smart Timestamps**: Relative time formatting (2m ago, 1h ago)
- **Notifications**: Chat request alerts and unread message counts

### 👤 User Management
- **Profile Management**: Comprehensive user settings and information
- **Dashboard Systems**: Separate admin and user control panels
- **Security Controls**: Password change and account management
- **Contact Management**: Phone number verification and updates

### 🎨 Modern UI/UX
- **Design System**: Tailwind CSS with custom component library
- **Component Library**: Radix UI primitives with shadcn/ui components
- **Visual Identity**: Professional gradient themes with orange accents
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: Micro-interactions and transitions
- **Accessibility**: WCAG 2.1 compliant interface elements

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with Hot Module Replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod schema validation
- **Styling**: Tailwind CSS utility-first framework
- **UI Components**: Radix UI headless components + shadcn/ui

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js RESTful API
- **Real-Time**: WebSocket implementation with `ws` library
- **Database**: MongoDB with Mongoose ODM
- **Session Store**: PostgreSQL with connect-pg-simple
- **Query Builder**: Drizzle ORM for type-safe database queries
- **Email Service**: Nodemailer with Gmail SMTP

### Development & Deployment
- **Development Database**: MongoDB Memory Server for testing
- **Authentication Provider**: Replit OAuth integration
- **Build System**: Custom build pipeline with esbuild
- **Deployment**: Vercel-optimized configuration
- **Environment Management**: dotenv with validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **MongoDB**: Version 4.4 or higher
- **PostgreSQL**: Version 13 or higher
- **Git**: For version control
- **Replit Account**: For OAuth authentication setup
- **Gmail Account**: For OTP email services (with app password)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/hema-motor.git
cd hema-motor
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
cd ..
```

### 3. Environment Setup

Create environment files in the project root:

**.env (Root)**
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
NODE_ENV=development
```

**.env (Backend/Server)**
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hema-motor
POSTGRESQL_URL=postgresql://username:password@localhost:5432/sessions

# Authentication
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_client_secret
SESSION_SECRET=your_super_secure_session_secret

# Email Service
GMAIL_USER=your.email@gmail.com
GMAIL_PASS=your_gmail_app_password

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 4. Database Setup

**MongoDB Setup:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using MongoDB Atlas (cloud)
# Update MONGODB_URI in .env to your Atlas connection string
```

**PostgreSQL Setup:**
```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Create database
createdb sessions

# Run migrations if available
cd server && npm run migrate
```

### 5. Start Development Environment

```bash
# Method 1: Use the build script
npm run build && npm start

# Method 2: Start services individually
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

# Method 3: Using Docker
docker-compose up -d
```

**Access the application:**
- **Live Demo**: https://vista-3.onrender.com/
- Frontend (Dev): http://localhost:5173
- Backend API (Dev): http://localhost:3001
- WebSocket (Dev): ws://localhost:3001

## 📁 Project Structure

```
hema-motor/
├── 📁 api/                    # Backend API routes and middleware
│   ├── routes/               # Express route definitions
│   ├── middleware/           # Custom middleware functions
│   └── controllers/          # Request handlers
├── 📁 client/                # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Route-based page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── 📁 server/                # Server configuration and setup
│   ├── models/              # Database models (Mongoose)
│   ├── utils/               # Server utilities
│   ├── websocket/           # WebSocket handlers
│   └── package.json         # Backend dependencies
├── 📁 shared/                # Shared utilities and types
│   ├── types/               # Common TypeScript interfaces
│   └── constants/           # Application constants
├── 📁 scripts/               # Build and deployment scripts
├── 📄 .env.example           # Environment template
├── 📄 .gitignore            # Git ignore rules
├── 📄 Dockerfile            # Container configuration
├── 📄 docker-compose.yml    # Multi-service container setup
├── 📄 package.json          # Root dependencies and scripts
├── 📄 README.md             # Project documentation
└── 📄 CHANGELOG.md          # Version history
```

## 🔧 Available Scripts

### Root Level Commands
```bash
npm run dev          # Start development environment
npm run build        # Build entire application
npm run start        # Start production server
npm run test         # Run all tests
npm run lint         # Lint entire codebase
npm run format       # Format code with Prettier
npm run deploy       # Deploy to production
```

### Frontend Commands
```bash
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run frontend tests
npm run lint:fix     # Fix linting issues
```

### Backend Commands
```bash
cd server
npm run dev          # Start Express server with nodemon
npm run build        # Build server for production
npm run start        # Start production server
npm run test         # Run API tests
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
```

## 🌐 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth/logout` | User logout | ✅ |
| POST | `/api/auth/forgot-password` | Request password reset | ❌ |
| POST | `/api/auth/reset-password` | Reset password with OTP | ❌ |
| GET | `/api/auth/verify` | Verify session | ✅ |

### Vehicle Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/vehicles` | Get all vehicles with filters | ❌ |
| GET | `/api/vehicles/featured` | Get featured vehicles | ❌ |
| GET | `/api/vehicles/:id` | Get specific vehicle | ❌ |
| POST | `/api/vehicles` | Create vehicle listing | ✅ |
| PUT | `/api/vehicles/:id` | Update vehicle listing | ✅ |
| DELETE | `/api/vehicles/:id` | Delete vehicle listing | ✅ |
| POST | `/api/vehicles/:id/like` | Toggle vehicle like | ✅ |

### Chat System Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/chats/:vehicleId` | Get chat messages | ✅ |
| POST | `/api/chats/:vehicleId/messages` | Send message | ✅ |
| GET | `/api/chats/rooms` | Get user's chat rooms | ✅ |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | ✅ |
| PUT | `/api/users/profile` | Update user profile | ✅ |
| POST | `/api/users/change-password` | Change password | ✅ |
| GET | `/api/users/listings` | Get user's vehicle listings | ✅ |

### WebSocket Events
```javascript
// Client to Server
'join_chat' - Join vehicle chat room
'send_message' - Send chat message
'typing' - Typing indicator

// Server to Client
'message_received' - New chat message
'user_joined' - User joined chat
'user_left' - User left chat
'typing_status' - Typing status update
```

## 🔒 Security Features

- **Authentication**: OAuth 2.0 with Replit integration
- **Password Security**: bcrypt with configurable salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Prevention**: Parameterized queries with Mongoose
- **XSS Protection**: Content sanitization and CSP headers
- **CORS Configuration**: Restricted origin access
- **Rate Limiting**: API endpoint request limiting
- **Environment Security**: Sensitive data in environment variables

## 🚀 Deployment Guide

### Render Deployment (Current Live Demo)

The application is currently deployed on Render at: **https://vista-3.onrender.com/**

**Render Deployment Steps:**
1. **Connect Repository** to Render
2. **Configure Environment Variables** in Render Dashboard
3. **Set Build Command**: `npm run build`
4. **Set Start Command**: `npm start`
5. **Configure Web Service** with appropriate instance type

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel --prod
   ```

2. **Environment Variables**
   Configure in Vercel Dashboard:
   - `MONGODB_URI`
   - `POSTGRESQL_URL`
   - `REPLIT_CLIENT_ID`
   - `REPLIT_CLIENT_SECRET`
   - `GMAIL_USER`
   - `GMAIL_PASS`
   - `SESSION_SECRET`

3. **Build Configuration**
   The project includes optimized Vercel configuration in `vercel.json`

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -t hema-motor .
   ```

2. **Run Container**
   ```bash
   # With environment file
   docker run --env-file .env -p 3000:3000 hema-motor
   
   # Or with docker-compose
   docker-compose up -d
   ```

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy Files**
   - Upload `dist/` folder to your hosting provider
   - Configure environment variables
   - Set up reverse proxy (Nginx recommended)

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:frontend
npm run test:backend
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load testing for scalability

## 📊 Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, query optimization, caching
- **Real-time**: Efficient WebSocket connection management
- **Build**: Tree shaking, minification, compression

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/hema-motor.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/amazing-feature
   # Create pull request on GitHub
   ```

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Maintain test coverage above 80%
- Update documentation for new features

## 📈 Roadmap

### Version 2.0 (Q2 2025)
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered vehicle recommendations
- [ ] Payment gateway integration
- [ ] Multi-language support

### Version 2.1 (Q3 2025)
- [ ] Video calls for vehicle inspections
- [ ] Blockchain-based ownership verification
- [ ] Advanced filtering with machine learning
- [ ] Social features and user reviews

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

**Build Failures**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help
- 📖 Check the [Wiki](https://github.com/yourusername/hema-motor/wiki)
- 🐛 Report bugs in [Issues](https://github.com/yourusername/hema-motor/issues)
- 💬 Join our [Discord Community](https://discord.gg/hema-motor)
- 📧 Email support: support@hemamotor.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Replit Team** - For seamless OAuth integration
- **Vercel** - For excellent deployment platform
- **Radix UI** - For accessible component primitives  
- **Tailwind CSS** - For utility-first styling approach
- **MongoDB & PostgreSQL** - For reliable data storage solutions
- **Open Source Community** - For the amazing tools and libraries

## 📞 Support & Contact

- **🌐 Live Demo**: [https://vista-3.onrender.com/](https://vista-3.onrender.com/)
- **📚 Documentation**: [https://docs.hemamotor.com](https://docs.hemamotor.com)
- **✉️ Support Email**: support@hemamotor.com
- **🐦 Twitter**: [@HemaMotor](https://twitter.com/HemaMotor)
- **💼 LinkedIn**: [HemaMotor](https://linkedin.com/company/hemamotor)

---

<div align="center">
  <p><strong>Built with ❤️ for the two-wheeler community</strong></p>
  <p>© 2025 Hema Motor. All rights reserved.</p>
</div>
