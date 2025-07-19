# easyT.online Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"

# App Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Email Configuration (for future use)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Upload Configuration (for future use)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Open Prisma Studio to view/edit data
npm run db:studio
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Features Implemented

### ✅ Complete Features
- **User Authentication**: Login/Register with JWT
- **Course Management**: Create, view, and manage courses
- **User Dashboard**: Student progress tracking and enrolled courses
- **Course Detail Pages**: Video player and lesson navigation
- **Payment System**: Stripe integration for course purchases
- **Admin Panel**: Course creation and management
- **Responsive Design**: Mobile-friendly interface
- **English Language**: All text converted to English

### 🔧 Technical Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (can be changed to PostgreSQL/MySQL)
- **Authentication**: JWT with bcrypt password hashing
- **Payments**: Stripe integration
- **Styling**: Tailwind CSS with custom design system

## 🎯 Key Pages

### Public Pages
- `/` - Homepage with featured courses
- `/courses` - Course catalog with search and filters
- `/courses/[id]` - Individual course page with video player
- `/login` - User login
- `/register` - User registration
- `/about` - About page
- `/subscriptions` - Subscription plans

### Protected Pages
- `/dashboard` - User dashboard with enrolled courses
- `/admin` - Admin dashboard
- `/admin/courses` - Course management
- `/admin/courses/new` - Create new course

### Payment Pages
- `/payment/success` - Payment success page
- `/payment/cancel` - Payment cancellation page

## 🔐 Authentication

The application uses JWT-based authentication with HTTP-only cookies for security.

**User Roles:**
- `STUDENT` - Can enroll in courses and access learning content
- `INSTRUCTOR` - Can create and manage their own courses
- `ADMIN` - Can manage all courses and users
- `SUPER_ADMIN` - Full system access

## 💳 Payment Integration

Stripe is integrated for course purchases. To enable payments:

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Add them to your environment variables
4. Test with Stripe's test card numbers

## 🗄️ Database Schema

The application includes comprehensive database models for:
- Users and authentication
- Courses and lessons
- Enrollments and progress tracking
- Reviews and ratings
- Orders and payments
- Subscriptions and billing

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    500: '#your-primary-color',
    // ... other shades
  },
  secondary: {
    500: '#your-secondary-color',
    // ... other shades
  },
}
```

### Content
Update course data and static content in the respective page components.

## 📞 Support

For questions or support, please check the documentation or create an issue in the repository.

---

**Note**: This is a production-ready e-learning platform. Make sure to:
- Use strong JWT secrets in production
- Set up proper email services
- Configure a production database
- Set up proper SSL certificates
- Implement proper error monitoring 