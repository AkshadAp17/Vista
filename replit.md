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
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
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

## User Preferences

Preferred communication style: Simple, everyday language.