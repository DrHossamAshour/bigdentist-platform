'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Mock data fallback
const mockCourses = [
  {
    id: '1',
    title: 'FINANCIAL ANALYSIS Diploma',
    subtitle: 'المحاسبة والتحليل المالي',
    topics: ['Principles of Accounting', 'Banking Operations', 'ODOO ERP', 'Sage50 & QuickBooks', 'Economic Feasibility'],
    countdown: '31:45',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop'
  },
  {
    id: '2',
    title: 'DATA ANALYSIS Diploma',
    subtitle: 'تحليل البيانات',
    topics: ['Google Analytics', 'Excel Dashboard', 'SPSS & Power BI', 'Google Looker & Tableau', 'Python Data Analysis'],
    countdown: '36:30',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
  },
  {
    id: '3',
    title: 'SMART INVESTMENT Diploma',
    subtitle: 'الاستثمار الذكي',
    topics: ['Stock Market', 'Cryptocurrency & Forex', 'Crisis Management', 'Investing During Crises'],
    countdown: '18:45',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop'
  },
  {
    id: '4',
    title: 'APP DEVELOPMENT Diploma',
    subtitle: 'تطوير التطبيقات',
    topics: ['Flutter & Dart', 'Android Studio', 'Java SE', 'Kotlin', 'Swift'],
    countdown: '75:30',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop'
  },
  {
    id: '5',
    title: 'PROFESSIONAL ENTREPRENEURSHIP Diploma',
    subtitle: 'ريادة الأعمال المهنية',
    topics: ['Business Administration', 'Entrepreneurship & Startups', 'Business Model Creation', 'Strategic Management', 'Re-engineering (BPR)', 'Agile & Scrum', 'Crisis Management'],
    countdown: '26:30',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop'
  },
  {
    id: '6',
    title: 'DENTAL PRACTICE MANAGEMENT Diploma',
    subtitle: 'إدارة العيادة السنية',
    topics: ['Patient Management', 'Financial Planning', 'Staff Training', 'Marketing Strategy', 'Quality Control'],
    countdown: '25:30',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
  },
  {
    id: '7',
    title: 'DIGITAL MARKETING Diploma',
    subtitle: 'التسويق الرقمي',
    topics: ['Social Media Marketing', 'Content Creation', 'SEO Optimization', 'Email Marketing', 'PPC Advertising'],
    countdown: '42:15',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'
  },
  {
    id: '8',
    title: 'WEB DEVELOPMENT Diploma',
    subtitle: 'تطوير المواقع الإلكترونية',
    topics: ['HTML & CSS', 'JavaScript', 'React & Next.js', 'Node.js', 'Database Design'],
    countdown: '58:20',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
  }
]

const featuredCourses = [
  {
    id: '1',
    title: 'MODERN ORTHODONTIC TECHNIQUES',
    subtitle: 'Complete Orthodontic Training',
    description: 'Learn modern orthodontic methods and treatment planning',
    price: 199,
    originalPrice: 299,
    tag: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
  },
  {
    id: '2',
    title: 'COSMETIC DENTISTRY MASTERCLASS',
    subtitle: 'Aesthetic Dentistry Excellence',
    description: 'Master cosmetic dental procedures and smile design',
    price: 249,
    originalPrice: 349,
    tag: 'NEW',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=250&fit=crop'
  },
  {
    id: '3',
    title: 'ENDODONTIC EXCELLENCE',
    subtitle: 'Root Canal Mastery',
    description: 'Advanced endodontic techniques and treatment protocols',
    price: 179,
    originalPrice: 279,
    tag: 'TRENDING',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop'
  }
]

interface Course {
  id: string
  title: string
  subtitle?: string
  topics?: string[]
  countdown?: string
  image?: string
  thumbnail?: string
  description?: string
  price?: number
  originalPrice?: number
  tag?: string
}

export default function Hero() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(5)

  // Fetch courses from API
  useEffect(() => {
    fetchCourses()
  }, [])

  // Set responsive cards count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1) // Mobile: 1 card
      } else if (window.innerWidth < 768) {
        setCardsToShow(2) // Small tablet: 2 cards
      } else if (window.innerWidth < 1024) {
        setCardsToShow(3) // Tablet: 3 cards
      } else if (window.innerWidth < 1280) {
        setCardsToShow(4) // Small desktop: 4 cards
      } else {
        setCardsToShow(5) // Desktop: 5 cards
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses?published=true')
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          // Transform API data to match our format
          const transformedCourses = data.map((course: any) => ({
            id: course.id,
            title: course.title,
            subtitle: course.category || 'Course',
            topics: course.description ? [course.description.substring(0, 50) + '...'] : ['Course content'],
            countdown: '25:00',
            image: course.thumbnail || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
          }))
          setCourses(transformedCourses)
        } else {
          setCourses(mockCourses)
        }
      } else {
        setCourses(mockCourses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses(mockCourses)
    } finally {
      setLoading(false)
    }
  }

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (courses.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, courses.length - cardsToShow + 1))
    }, 6000)

    return () => clearInterval(interval)
  }, [courses.length, cardsToShow])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, courses.length - cardsToShow + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, courses.length - cardsToShow + 1)) % Math.max(1, courses.length - cardsToShow + 1))
  }

  const getCardStyle = (index: number) => {
    const position = index - currentIndex
    const cardWidth = 100 / cardsToShow
    const baseStyle = `flex-shrink-0 px-2 transition-all duration-700`
    
    if (position < 0 || position >= cardsToShow) {
      return `${baseStyle} opacity-0 scale-75`
    }
    
    if (cardsToShow === 1) {
      // Single card - no 3D effect
      return `${baseStyle} w-full transform scale-100 opacity-100`
    } else if (cardsToShow === 2) {
      // Two cards
      if (position === 0) {
        return `${baseStyle} w-1/2 transform -rotate-y-6 scale-90 opacity-75 -translate-x-2`
      } else {
        return `${baseStyle} w-1/2 transform rotate-y-6 scale-90 opacity-75 translate-x-2`
      }
    } else if (cardsToShow === 3) {
      // Three cards
      if (position === 0) {
        return `${baseStyle} w-1/3 transform -rotate-y-12 scale-85 opacity-60 -translate-x-4`
      } else if (position === 1) {
        return `${baseStyle} w-1/3 transform scale-100 opacity-100 z-10`
      } else {
        return `${baseStyle} w-1/3 transform rotate-y-12 scale-85 opacity-60 translate-x-4`
      }
    } else {
      // 4-5 cards with 3D effect
      if (position === 0) {
        return `${baseStyle} w-1/${cardsToShow} transform -rotate-y-12 scale-85 opacity-60 -translate-x-4`
      } else if (position === 1) {
        return `${baseStyle} w-1/${cardsToShow} transform -rotate-y-6 scale-90 opacity-75 -translate-x-2`
      } else if (position === Math.floor(cardsToShow / 2)) {
        return `${baseStyle} w-1/${cardsToShow} transform scale-100 opacity-100 z-10`
      } else if (position === cardsToShow - 2) {
        return `${baseStyle} w-1/${cardsToShow} transform rotate-y-6 scale-90 opacity-75 translate-x-2`
      } else if (position === cardsToShow - 1) {
        return `${baseStyle} w-1/${cardsToShow} transform rotate-y-12 scale-85 opacity-60 translate-x-4`
      } else {
        return `${baseStyle} w-1/${cardsToShow} transform scale-95 opacity-85`
      }
    }
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              New at BigDentist
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest courses and premium learning content
            </p>
          </div>

          {/* Course Carousel - Responsive */}
          <div className="relative max-w-7xl mx-auto">
            {/* Navigation Arrows - Hidden on mobile */}
            {cardsToShow < courses.length && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-20 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-4 shadow-lg transition-all duration-200 hover:shadow-xl hidden sm:block"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-20 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-4 shadow-lg transition-all duration-200 hover:shadow-xl hidden sm:block"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </>
            )}

            {/* Carousel Container */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
                  width: `${courses.length * (100 / cardsToShow)}%`
                }}
              >
                {courses.map((course, index) => (
                  <div key={course.id} className={getCardStyle(index)}>
                    <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl shadow-xl overflow-hidden border border-primary-400 h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                      {/* Course Image */}
                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                        <img
                          src={course.image || course.thumbnail || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Special Offer Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-secondary-300 text-secondary-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            Special Offer
                          </span>
                        </div>
                        {/* Countdown Timer */}
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{course.countdown || '25:00'} Hours</span>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-4">
                        {/* Course Title */}
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-secondary-200 transition-colors">
                          {course.title}
                        </h3>
                        
                        {/* Arabic Subtitle */}
                        {course.subtitle && (
                          <p className="text-xs text-gray-200 mb-3">
                            {course.subtitle}
                          </p>
                        )}

                        {/* Course Topics */}
                        {course.topics && course.topics.length > 0 && (
                          <ul className="mb-4 space-y-1">
                            {course.topics.slice(0, 2).map((topic, index) => (
                              <li key={index} className="flex items-center text-xs text-white">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Enroll Button */}
                        <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded-lg transition-colors text-xs font-medium shadow-sm group-hover:bg-secondary-600 group-hover:text-white">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            {cardsToShow < courses.length && (
              <div className="flex justify-center mt-6 sm:hidden">
                {Array.from({ length: Math.ceil(courses.length / cardsToShow) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                      index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked courses from our top instructors to help you advance your skills
            </p>
          </div>

          {/* Featured Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.tag && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {course.tag}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-700 mb-3 font-medium">
                    {course.subtitle}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary-600">
                        ${course.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${course.originalPrice}
                      </span>
                    </div>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
                      View Course
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Courses Button */}
          <div className="text-center">
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  )
} 