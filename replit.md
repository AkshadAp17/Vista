# Replit.md - Hema Motor Application

## Overview
Hema Motor is a full-stack web application designed as a modern marketplace for buying and selling two-wheelers (motorcycles, scooters, electric vehicles). It features robust authentication, real-time messaging, and comprehensive vehicle management capabilities, aiming to be a leading platform in the two-wheeler market.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)
- **Search Optimization**: Removed browse categories component to focus on core search functionality
- **UI Simplification**: Streamlined homepage to display search bar and vehicle results only
- **Search Enhancement**: Fixed price range filter handling for both dash and comma formats
- **Conditional Display**: Featured vehicles now hide when search filters are active
- **Filter Management**: Added clear filters button and improved search result labeling

## System Architecture

### UI/UX Decisions
- **Styling**: Tailwind CSS with a custom design system.
- **UI Components**: Radix UI primitives integrated with shadcn/ui.
- **Visuals**: Modern visuals with dark gradients and animations.
- **Branding**: Bicycle-themed rebranding across all components with consistent logo and icon placement, including orange icons for brand consistency.
- **Responsiveness**: Enhanced mobile responsiveness across all components, including optimized layouts for search bar, vehicle cards, header, and landing page.
- **Login/Signup Pages**: Professional and visually appealing split-screen layouts with branding elements.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Vite for build, Wouter for routing, TanStack Query for server state, React Hook Form with Zod for forms.
- **Backend**: Node.js with Express.js REST API, WebSocket support for real-time communication.
- **Authentication**: Custom authentication system leveraging Replit Auth (OpenID Connect) with bcrypt for password hashing and secure session management. Includes role-based access control (admin privileges), automatic user profile creation, and a complete forgot password functionality with 2-step verification.
- **Vehicle Management**: CRUD operations for vehicle listings, advanced search and filter capabilities (location, price, type, brand, vehicle ID/number), support for featured vehicles, and image uploads (base64 storage). Includes a comprehensive vehicle status system ("available", "pending", "sold").
- **Search System**: Optimized search interface with real-time filtering by search terms, location, price range, and vehicle type. Features conditional display (featured vehicles hidden during search), clear filters functionality, and dynamic result labeling.
- **Chat System**: Real-time WebSocket-based messaging between buyers and sellers, organized chat rooms per vehicle listing, persistent message history, WhatsApp-style instant message display with optimistic updates, and relative time formatting.
- **User Management**: Comprehensive settings/profile management for both admin and users, including password change and phone number fields.
- **Social Features**: Like/share functionality for vehicle cards with local storage.
- **Utilities**: Auto-generated vehicle numbering (e.g., VH001), notification system for chat requests, and a business card component for company information.

### System Design Choices
- **Data Flow**: User authentication via OpenID Connect, vehicle browsing with real-time updates, interest expression leading to chat, real-time communication via WebSockets, and admin oversight.
- **Session Management**: Secure session storage.
- **Deployment**: Optimized for Vercel deployment with production builds via Vite (frontend) and esbuild (backend).

## External Dependencies
- **Database**: MongoDB (with Mongoose ODM) for core data, MongoDB Memory Server for development.
- **PostgreSQL**: Used for session storage with `connect-pg-simple` and `drizzle-orm` (though MongoDB is the primary data store, PostgreSQL was part of earlier iterations for sessions).
- **Frontend Libraries**: `@tanstack/react-query`, `@radix-ui/*`, `react-hook-form`, `zod`, `wouter`.
- **Backend Libraries**: `ws` (for WebSockets).
- **Build Tools**: `vite`, `typescript`, `tailwindcss`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-runtime-error-modal`.
- **Email Service**: Gmail SMTP (for OTP email verification).
- **Replit Integration**: Replit Auth, Replit environment configuration.
- **Deployment**: Vercel.