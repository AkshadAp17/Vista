# Hema Motor - Deployment Guide

## Overview
This guide covers deploying your full-stack Hema Motor application (React frontend + Express backend) to various hosting platforms.

## Option 1: Vercel (Recommended for Serverless)

### Setup Instructions:
1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json` in root directory
3. Set environment variables in Vercel dashboard
4. Deploy with `vercel --prod`

### Required Environment Variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `SESSION_SECRET` - Random 32+ character string for sessions
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `ADMIN_EMAIL` - Admin account email
- `ADMIN_PASSWORD` - Admin account password

### Advantages:
- Automatic SSL certificates
- Global CDN
- Serverless functions
- Easy scaling

## Option 2: Railway

### Setup Instructions:
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway auto-detects Node.js and deploys

### Configuration:
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: Uses Railway's PORT environment variable

## Option 3: Render

### Setup Instructions:
1. Connect GitHub repository to Render
2. Create Web Service
3. Set build and start commands
4. Configure environment variables

### Settings:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment: Node.js

## Option 4: Heroku

### Setup Instructions:
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set VAR_NAME=value`
4. Deploy: `git push heroku main`

### Required Files:
- `Procfile`: `web: npm start`
- Ensure `package.json` has proper scripts

## Option 5: DigitalOcean App Platform

### Setup Instructions:
1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

### Configuration:
- Source Directory: `/`
- Build Command: `npm run build`
- Run Command: `npm start`

## Option 6: AWS (EC2 + Load Balancer)

### Setup Instructions:
1. Launch EC2 instance (Ubuntu 20.04+)
2. Install Node.js, PM2, and Nginx
3. Configure reverse proxy with Nginx
4. Use PM2 for process management

### Steps:
```bash
# Install dependencies
sudo apt update
sudo apt install nginx nodejs npm
npm install -g pm2

# Setup application
git clone your-repo
cd your-repo
npm install
npm run build

# Start with PM2
pm2 start server/index.js --name hema-motor
pm2 startup
pm2 save

# Configure Nginx (create /etc/nginx/sites-available/hema-motor)
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/hema-motor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Database Requirements

All deployment options require:
- **MongoDB Atlas** (recommended) or MongoDB instance
- Connection string in `MONGODB_URI` environment variable

## Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created and configured
- [ ] Build scripts working locally (`npm run build`)
- [ ] All dependencies in `package.json`
- [ ] Proper error handling for production
- [ ] Security headers configured
- [ ] CORS settings for production domain

## Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Vercel | 100GB bandwidth | $20/month | Startups, small apps |
| Railway | $5/month credit | $5+/month | Simple deployment |
| Render | 750 hours/month | $7+/month | Full-stack apps |
| Heroku | 550-1000 hours | $7+/month | Prototypes |
| DigitalOcean | - | $5+/month | Custom control |
| AWS EC2 | 750 hours/year | Variable | Enterprise |

## Recommendations

1. **For MVP/Startup**: Vercel or Railway
2. **For Production**: AWS EC2 or DigitalOcean
3. **For Simple Setup**: Render or Railway
4. **For Enterprise**: AWS with Load Balancer

Choose based on your budget, technical requirements, and scaling needs.