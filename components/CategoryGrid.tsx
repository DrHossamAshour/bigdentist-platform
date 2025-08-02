'use client'

import Link from 'next/link'
import { 
  Code, 
  Palette, 
  Smartphone, 
  Brain, 
  TrendingUp, 
  Camera,
  BookOpen,
  Users,
  Globe,
  Zap
} from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  href: string
}

export default function CategoryGrid() {
  const categories: Category[] = [
    {
      id: 'programming',
      name: 'Programming & Development',
      icon: <Code className="w-8 h-8" />,
      color: 'bg-blue-600',
      href: '/courses?category=programming'
    },
    {
      id: 'design',
      name: 'Design & Graphics',
      icon: <Palette className="w-8 h-8" />,
      color: 'bg-purple-600',
      href: '/courses?category=design'
    },
    {
      id: 'mobile',
      name: 'Mobile Development',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'bg-green-600',
      href: '/courses?category=mobile'
    },
    {
      id: 'ai',
      name: 'AI & Machine Learning',
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-red-600',
      href: '/courses?category=ai'
    },
    {
      id: 'business',
      name: 'Business & Marketing',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-indigo-600',
      href: '/courses?category=business'
    },
    {
      id: 'photography',
      name: 'Photography & Video',
      icon: <Camera className="w-8 h-8" />,
      color: 'bg-pink-600',
      href: '/courses?category=photography'
    },
    {
      id: 'education',
      name: 'Education & Training',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-yellow-600',
      href: '/courses?category=education'
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-teal-600',
      href: '/courses?category=social'
    },
    {
      id: 'language',
      name: 'Language Learning',
      icon: <Globe className="w-8 h-8" />,
      color: 'bg-orange-600',
      href: '/courses?category=language'
    },
    {
      id: 'productivity',
      name: 'Productivity',
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-cyan-600',
      href: '/courses?category=productivity'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600">
            Find courses in your area of interest
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col items-center text-center hover:transform hover:scale-105 transition-all duration-200"
            >
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-shadow duration-200`}>
                {category.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 