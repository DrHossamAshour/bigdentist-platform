# BigDentist | Online Learning Platform

A modern, responsive clone of the [easyT.online](https://easyt.online/) Arabic e-learning platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Beautiful, responsive design that matches the original easyT.online aesthetic
- **Arabic RTL Support**: Full right-to-left (RTL) layout support for Arabic content
- **Course Marketplace**: Display courses with ratings, prices, instructors, and progress tracking
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: Cairo (Arabic font)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd easyt-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🎨 Project Structure

```
easyt-clone/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Homepage component
│   ├── courses/
│   │   └── page.tsx         # Courses listing page
│   ├── subscriptions/
│   │   └── page.tsx         # Subscription plans page
│   ├── about/
│   │   └── page.tsx         # About us page
│   ├── login/
│   │   └── page.tsx         # Login page
│   └── register/
│       └── page.tsx         # Registration page
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section with featured course
│   ├── CourseGrid.tsx       # Course listings grid
│   └── Footer.tsx           # Footer with links and contact info
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🎯 Key Components

### Header Component
- Responsive navigation menu
- Mobile hamburger menu
- Authentication buttons
- Arabic RTL layout

### Hero Section
- Featured course showcase
- Course details and pricing
- Call-to-action buttons
- Gradient background design

### Course Grid
- Responsive course cards
- Course ratings and reviews
- Progress tracking bars
- Instructor information
- Pricing with discounts

### Footer
- Company information
- Navigation links
- Social media links
- Newsletter subscription
- Contact details

## 🎨 Design Features

- **Color Scheme**: Primary blue and secondary purple gradients
- **Typography**: Cairo font for optimal Arabic text rendering
- **Animations**: Smooth hover effects and transitions
- **Icons**: Lucide React icons for consistency
- **Layout**: RTL support with proper spacing and alignment

## 📱 Responsive Design

- **Desktop**: Full-width layout with 3-column course grid
- **Tablet**: 2-column course grid with adjusted spacing
- **Mobile**: Single-column layout with collapsible navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

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