# Replit.md - Hema Motor Application

## Overview

Hema Motor is a full-stack web application for buying and selling two-wheelers (motorcycles, scooters, electric vehicles). It's built as a modern marketplace platform with authentication, real-time messaging, and comprehensive vehicle management features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Database Provider**: MongoDB Memory Server for development
- **Authentication**: Custom authentication system with bcrypt
- **Session Management**: Express sessions with memory store
- **Real-time Communication**: WebSocket support for chat functionality

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user profile creation and management
- **Admin System**: Role-based access control with admin privileges

### Database Schema
- **Users**: Profile information, admin flags, timestamps
- **Vehicles**: Complete vehicle listings with seller relationships
- **Chat System**: Real-time messaging between buyers and sellers
- **Sessions**: Secure session storage for authentication

### Vehicle Management
- **Listings**: Create, read, update, delete vehicle listings
- **Search & Filter**: Advanced filtering by location, price, type, brand
- **Featured Vehicles**: Promoted listings system
- **Image Support**: Prepared for vehicle photo uploads

### Chat System
- **Real-time Messaging**: WebSocket-based chat between buyers and sellers
- **Chat Rooms**: Organized conversations per vehicle listing
- **Message History**: Persistent message storage and retrieval

## Data Flow

1. **User Authentication**: OpenID Connect flow through Replit Auth
2. **Vehicle Browsing**: Search and filter vehicles with real-time updates
3. **Interest Expression**: Users can start chat conversations with sellers
4. **Real-time Communication**: WebSocket connections for instant messaging
5. **Admin Management**: Administrative dashboard for platform oversight

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **react-hook-form**: Form management and validation
- **zod**: Runtime type validation
- **wouter**: Lightweight routing
- **ws**: WebSocket implementation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-cartographer**: Replit integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations manage schema changes

### Environment Configuration
- **DATABASE_URL**: Neon PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPLIT_DOMAINS**: Allowed domains for Replit Auth
- **ISSUER_URL**: OpenID Connect issuer URL

### Deployment Process
1. Build frontend assets with Vite
2. Bundle backend code with esbuild
3. Apply database migrations with Drizzle
4. Start production server with optimized builds

## Changelog

- July 04, 2025. Initial setup
- July 04, 2025. Implemented secure admin creation system - removed automatic admin generation for security. Only one admin can be created manually by website creator during deployment.
- July 04, 2025. Fixed logout functionality and session management - updated logout routes to use /api/auth/logout
- July 04, 2025. Added comprehensive settings/profile management system for both admin and users
- July 04, 2025. Enhanced dashboard navigation with proper role-based routing and settings functionality
- July 04, 2025. Added password change functionality with current password verification
- July 04, 2025. Implemented separate settings forms for admin and user roles with email/password management
- July 04, 2025. Fixed vehicle creation form validation and added comprehensive debugging
- July 04, 2025. Added scrollable admin settings modal for overflow handling
- July 04, 2025. Implemented photo upload functionality for vehicle listings with add/remove capabilities
- July 04, 2025. Added phone number field to user profiles and seller contact information
- July 04, 2025. Removed "Start Chat" button from admin view and added vehicle ID display
- July 04, 2025. Enhanced chat system to show unique vehicle IDs in conversations
- July 04, 2025. Added notifications schema for admin chat request notifications
- July 04, 2025. Migration completed from Replit Agent to Replit environment with PostgreSQL database setup
- July 04, 2025. Created initial admin user with credentials stored in replit.md for easy reference
- July 04, 2025. Fixed logout functionality - corrected endpoint URL and added proper redirect to landing page
- July 04, 2025. Enhanced header dropdown functionality - added working settings modal and improved dashboard navigation
- July 04, 2025. Fixed landing page search to redirect to login for authenticated search functionality
- July 04, 2025. Verified all core features working: admin login, dashboard navigation, settings modal, logout, and search
- July 04, 2025. Fixed vehicle image upload functionality - now properly converts uploaded files to base64 and stores in database
- July 04, 2025. Fixed Contact Seller button - now functional with phone number integration and toast notifications
- July 04, 2025. Enhanced vehicle detail page to properly display uploaded images when available
- July 04, 2025. Fixed chat system bugs: resolved white page issue, prevented self-chat for sellers, improved user interface types
- July 04, 2025. Added proper seller validation in chat - admins and vehicle owners cannot chat with themselves
- July 04, 2025. Created test buyer account for proper chat functionality testing between different users
- July 04, 2025. Migration completed from Replit Agent to Replit environment with PostgreSQL database setup
- July 04, 2025. Created initial admin user with credentials stored in replit.md for easy reference
- July 04, 2025. Configured Gmail SMTP service for OTP email verification system using environment variables
- July 04, 2025. Fixed vehicle image upload functionality - now properly converts uploaded files to base64 and stores in database
- July 04, 2025. Fixed Contact Seller button - now functional with phone number integration and toast notifications
- July 04, 2025. Enhanced vehicle detail page to properly display uploaded images when available
- July 04, 2025. Fixed chat system bugs: resolved white page issue, prevented self-chat for sellers, improved user interface types
- July 04, 2025. Added proper seller validation in chat - admins and vehicle owners cannot chat with themselves
- July 04, 2025. Created test buyer account for proper chat functionality testing between different users
- July 04, 2025. Fixed chat system navigation - now redirects to dashboard after starting chat instead of showing white page
- July 04, 2025. Added image navigation controls - forward/backward arrows and thumbnail selection for vehicle images
- July 04, 2025. Enhanced Contact Seller button - now shows detailed seller profile modal with contact options
- July 04, 2025. Added floating chat widget to admin dashboard for consistent UI experience across all pages
- July 04, 2025. Completely redesigned landing page with modern visuals, dark gradients, animations, and attractive UI components
- July 05, 2025. Migration completed from Replit Agent to Replit environment - maintained MongoDB setup as requested by user
- July 05, 2025. Fixed vehicle creation validation error - added proper string-to-number conversion for price, year, and kmDriven fields
- July 05, 2025. Application running successfully with MongoDB Memory Server, all core features functional
- July 05, 2025. Configured Gmail SMTP service for OTP email verification system using environment variables
- July 05, 2025. Fixed vehicle image upload functionality - now properly converts uploaded files to base64 and stores in database
- July 05, 2025. Fixed Contact Seller button - now functional with phone number integration and toast notifications
- July 05, 2025. Enhanced vehicle detail page to properly display uploaded images when available
- July 05, 2025. Fixed chat system bugs: resolved white page issue, prevented self-chat for sellers, improved user interface types
- July 05, 2025. Added proper seller validation in chat - admins and vehicle owners cannot chat with themselves
- July 05, 2025. Created test buyer account for proper chat functionality testing between different users
- July 05, 2025. Successfully migrated to environment variables for all sensitive data (MONGODB_URI, EMAIL_USER, EMAIL_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD)
- July 05, 2025. Fixed MongoDB connection issues by using memory server for development and in-memory session storage
- July 05, 2025. Application now running successfully with sample vehicle data (Honda Activa, Yamaha FZ-S, Ather 450X)
- July 05, 2025. All core features functional: authentication, vehicle creation, user management, and chat system
- July 05, 2025. Fixed WebSocket chat message validation issues and improved error handling
- July 05, 2025. Added functional Like/Share buttons to vehicle cards with proper user feedback
- July 05, 2025. Enhanced vehicle card UI with Like and Share functionality using local storage
- July 05, 2025. Price display properly formatted as currency in vehicle listings
- July 05, 2025. Implemented comprehensive social features: like/unlike vehicles, share with native API fallback to clipboard
- July 05, 2025. Successfully migrated from Replit Agent to Replit environment with environment variables configuration
- July 05, 2025. Configured MongoDB Atlas connection with intelligent fallback to Memory Server for development stability
- July 05, 2025. Integrated dotenv for proper environment variable management with user credentials
- July 05, 2025. Application running successfully in production-ready configuration with all core features functional
- July 05, 2025. MongoDB Atlas connection established successfully using correct cluster URL (cluster0.xec9uev.mongodb.net)
- July 05, 2025. Database connection now using production MongoDB Atlas with network access configured properly
- July 05, 2025. Successfully migrated from Replit Agent to Replit environment - all core functionality preserved
- July 05, 2025. Fixed critical vehicle form dialog issue - replaced page reload with proper state management to prevent white page
- July 05, 2025. Fixed admin dashboard white page issue - added null checks for vehicle data and WebSocket error handling
- July 05, 2025. Fixed vehicle chat dialog undefined messages error - added proper null checks for messages array
- July 05, 2025. Fixed vehicle price display showing "{object Object}" - added parseFloat conversion for MongoDB Decimal128 objects
- July 05, 2025. Fixed WebSocket connection issues in chat system - improved host detection and error handling

## Admin Credentials

**Your admin login credentials:**
- Email: akshadapastambh37@gmail.com
- Password: Akshad@11

Note: These credentials can be updated through the admin settings panel after logging in. The admin account has full access to the platform including user management, vehicle approval, and system settings.

## User Preferences

Preferred communication style: Simple, everyday language.