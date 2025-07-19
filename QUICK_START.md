# 🚀 Quick Start: Deploy BigDentist to Vercel

## Immediate Steps (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

### 3. Set Environment Variables
In Vercel dashboard > Project Settings > Environment Variables, add:

```env
# Database (Get from Supabase/Railway/Neon)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-project.vercel.app"

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Get from SendGrid)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-api-key"

# UploadThing (Get from uploadthing.com)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Vimeo (Get from Vimeo Developer)
VIMEO_ACCESS_TOKEN="your-token"

# Base URL
NEXT_PUBLIC_BASE_URL="https://your-project.vercel.app"
```

### 4. Setup Database
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Add to `DATABASE_URL` in Vercel
5. Run migration in Vercel terminal: `npx prisma db push`

### 5. Test Your Site
Visit your Vercel URL and test:
- ✅ User registration
- ✅ Admin login
- ✅ Course creation
- ✅ Payment processing

## Need Help?

- 📖 Full guide: `VERCEL_DEPLOYMENT.md`
- 🐛 Issues: Check build logs in Vercel dashboard
- 💬 Support: Vercel Discord or GitHub Issues

Your BigDentist site will be live in minutes! 🎉 