# BigDentist Production Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Prepare Your Repository**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Add environment variables (see below)
   - Deploy automatically

3. **Environment Variables for Vercel**
   ```env
   # Database (Use PostgreSQL)
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # JWT Secret (Generate a strong one)
   JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-characters"
   
   # Stripe (Live keys)
   STRIPE_SECRET_KEY="sk_live_your_stripe_live_secret_key"
   STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_live_publishable_key"
   
   # App Configuration
   NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
   
   # Email (SMTP)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # Upload (UploadThing)
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   
   # Analytics
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   GOOGLE_SITE_VERIFICATION="your-google-verification-code"
   ```

### Option 2: Railway

1. **Deploy to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Add PostgreSQL Database**
   - Create PostgreSQL service in Railway
   - Connect to your app
   - Update DATABASE_URL

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Connect GitHub repository
   - Select Node.js environment
   - Add environment variables
   - Deploy

2. **Add Managed Database**
   - Create PostgreSQL database
   - Update connection string

## 🗄️ Database Setup

### PostgreSQL Setup Options

#### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Update DATABASE_URL

#### Option B: Railway PostgreSQL
1. Create PostgreSQL service in Railway
2. Copy connection string
3. Update DATABASE_URL

#### Option C: DigitalOcean Managed Database
1. Create PostgreSQL cluster
2. Get connection details
3. Update DATABASE_URL

### Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to production database
npm run db:push

# (Optional) Seed initial data
npm run db:seed
```

## 📧 Email Setup

### Gmail SMTP Setup
1. Enable 2-factor authentication on Gmail
2. Generate App Password
3. Use these settings:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ```

### Alternative: SendGrid
1. Create SendGrid account
2. Get API key
3. Update email configuration in `lib/email.ts`

## 💳 Payment Setup

### Stripe Production Setup
1. Switch to live mode in Stripe dashboard
2. Get live API keys
3. Update environment variables:
   ```env
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_PUBLISHABLE_KEY="pk_live_..."
   ```

### Webhook Setup (Optional)
1. Create webhook endpoint in Stripe
2. Point to: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📁 File Upload Setup

### UploadThing Setup
1. Go to [uploadthing.com](https://uploadthing.com)
2. Create account and app
3. Get API keys
4. Update environment variables:
   ```env
   UPLOADTHING_SECRET="your-secret"
   UPLOADTHING_APP_ID="your-app-id"
   ```

## 📊 Analytics Setup

### Google Analytics
1. Create Google Analytics 4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables:
   ```env
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   ```

### Google Search Console
1. Add your domain to Search Console
2. Get verification code
3. Add to environment variables:
   ```env
   GOOGLE_SITE_VERIFICATION="your-verification-code"
   ```

## 🔒 Security Checklist

### Before Going Live
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set up proper CORS if needed
- [ ] Review all environment variables
- [ ] Test payment flow with live Stripe keys
- [ ] Test email functionality
- [ ] Verify database connections
- [ ] Check file upload functionality

### Post-Launch
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy
- [ ] Set up SSL certificate (if not automatic)
- [ ] Test all user flows

## 🚨 Common Issues & Solutions

### Database Connection Issues
```bash
# Check connection
npx prisma db pull

# Reset if needed
npx prisma db push --force-reset
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### Environment Variables
- Ensure all variables are set in hosting platform
- Check for typos in variable names
- Verify sensitive data is not exposed

### Email Issues
- Check SMTP credentials
- Verify port settings
- Test with simple email first

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test locally with production environment variables
4. Contact support with specific error messages

## 🔄 Updates & Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor database performance
- [ ] Review security logs
- [ ] Backup database regularly
- [ ] Test payment flows

### Scaling Considerations
- [ ] Monitor resource usage
- [ ] Consider CDN for static assets
- [ ] Implement caching strategies
- [ ] Set up monitoring and alerting 