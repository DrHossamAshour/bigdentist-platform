#!/bin/bash

# BigDentist Vercel Deployment Script

echo "🚀 Starting BigDentist deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your site should be live at the URL shown above."
echo ""
echo "📋 Next steps:"
echo "1. Set up your database (Supabase, Railway, or Neon)"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Set up external services (Stripe, UploadThing, Email)"
echo "4. Run database migrations: npx prisma db push"
echo "5. Test your application" 