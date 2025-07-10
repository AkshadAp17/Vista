# Quick Deployment Checklist ⚡

## Before You Start - Gather These:
- [ ] Gmail email address
- [ ] Strong password for MongoDB
- [ ] GitHub account

## Step 1: MongoDB Atlas (5 mins)
1. Go to https://cloud.mongodb.com → Sign up
2. Create cluster → Choose FREE tier
3. Database Access → Add user: `hemamotor` with password
4. Network Access → Allow 0.0.0.0/0 (everywhere)
5. Copy connection string: `mongodb+srv://hemamotor:PASSWORD@cluster.xxxxx.mongodb.net/hema-motor`

## Step 2: Gmail App Password (2 mins)
1. Google Account → Security → 2-Step Verification (enable)
2. App Passwords → Generate for "Hema Motor"
3. Copy 16-character password

## Step 3: GitHub Upload (3 mins)
```bash
git init
git add .
git commit -m "Deploy Hema Motor"
git remote add origin https://github.com/USERNAME/hema-motor.git
git push -u origin main
```

## Step 4: Vercel Deploy (5 mins)
1. https://vercel.com → Sign up with GitHub
2. New Project → Import your repo
3. Add Environment Variables:
   - `MONGODB_URI` = your connection string from Step 1
   - `EMAIL_USER` = your Gmail
   - `EMAIL_PASSWORD` = app password from Step 2
   - `ADMIN_EMAIL` = akshadapastambh37@gmail.com
   - `ADMIN_PASSWORD` = Akshad@11
   - `NODE_ENV` = production
   - `SESSION_SECRET` = make-up-a-long-random-string
4. Click Deploy!

## Step 5: Test (2 mins)
- Visit your new URL
- Login with admin: akshadapastambh37@gmail.com / Akshad@11
- Check if vehicles show up

**Total Time: ~15 minutes**

Your app will be live at: `https://your-repo-name.vercel.app`