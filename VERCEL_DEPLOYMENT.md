# Vercel Deployment Guide for BigDentist

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database**: Set up PostgreSQL database (recommended: Supabase, Railway, or Neon)
4. **External Services**: Configure Stripe, UploadThing, and email service

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Required Environment Variables
Create these in your Vercel project settings:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Use SendGrid, Mailgun, or Resend)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"

# UploadThing
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Vimeo
VIMEO_ACCESS_TOKEN="your-vimeo-access-token"

# Base URL
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
```

## Step 2: Database Setup

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Run migrations:
```bash
npx prisma db push
```

### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Get connection string
4. Run migrations

### Option C: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Get connection string
4. Run migrations

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 3.2 Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave empty)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 3.3 Environment Variables
Add all environment variables from Step 1.2 in the Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add each variable with appropriate values
3. Select "Production" environment for all

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at `https://your-project.vercel.app`

## Step 4: Post-Deployment Setup

### 4.1 Database Migration
After deployment, run database migrations:
```bash
# In Vercel dashboard > Functions > Terminal
npx prisma db push
npx prisma generate
```

### 4.2 Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` in environment variables

### 4.3 SSL Certificate
Vercel automatically provides SSL certificates for all domains.

## Step 5: External Services Setup

### 5.1 Stripe Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5.2 UploadThing
1. Go to [uploadthing.com](https://uploadthing.com)
2. Create new project
3. Get API keys
4. Add to environment variables

### 5.3 Email Service (SendGrid)
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account and verify domain
3. Generate API key
4. Add SMTP settings to environment variables

## Step 6: Testing

### 6.1 Test Registration
1. Visit your deployed site
2. Try registering a new user
3. Check if confirmation email is sent

### 6.2 Test Payment
1. Use Stripe test cards
2. Complete a test purchase
3. Verify order confirmation email

### 6.3 Test Admin Features
1. Login as admin
2. Test Vimeo integration
3. Test file uploads
4. Test staff management

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are in `package.json`
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from Vercel
   - Run `npx prisma db push` in Vercel terminal

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check email service limits
   - Test with different email provider

4. **File Upload Issues**
   - Verify UploadThing configuration
   - Check file size limits
   - Test with different file types

### Useful Commands:
```bash
# Check build logs
vercel logs

# Deploy from local
vercel --prod

# Check environment variables
vercel env ls
```

## Performance Optimization

1. **Enable Edge Functions** for API routes
2. **Use CDN** for static assets
3. **Optimize Images** with Next.js Image component
4. **Enable Caching** for database queries
5. **Monitor Performance** with Vercel Analytics

## Security Checklist

- [ ] All environment variables are set
- [ ] Database is properly secured
- [ ] SSL certificate is active
- [ ] API keys are not exposed in client code
- [ ] Input validation is working
- [ ] Rate limiting is configured
- [ ] CORS is properly configured

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)

Your BigDentist application should now be successfully deployed on Vercel! 🚀 