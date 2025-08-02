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
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(4)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1)
      } else if (window.innerWidth < 768) {
        setCardsToShow(2)
      } else if (window.innerWidth < 1024) {
        setCardsToShow(3)
      } else {
        setCardsToShow(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch courses from API
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses?published=true')
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
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
          setCourses(mockCourses) // Fallback to mockCourses if API returns empty
        }
      } else {
        setCourses(mockCourses) // Fallback to mockCourses if API response is not ok
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses(mockCourses) // Fallback to mockCourses on fetch error
    } finally {
      setLoading(false)
    }
  }

  // Auto-slide functionality with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || courses.length <= cardsToShow) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, courses.length - cardsToShow + 1))
    }, 5000) // Changed from 6000 to 5000 for faster auto-sliding

    return () => clearInterval(interval)
  }, [courses.length, cardsToShow, isAutoPlaying])

  // Progress indicator for auto-sliding
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (!isAutoPlaying || courses.length <= cardsToShow) {
      setProgress(0)
      return
    }

    const duration = 5000 // 5 seconds
    const interval = 50 // Update every 50ms
    const steps = duration / interval
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      setProgress((currentStep / steps) * 100)
      
      if (currentStep >= steps) {
        currentStep = 0
        setProgress(0)
      }
    }, interval)

    return () => clearInterval(progressInterval)
  }, [isAutoPlaying, currentIndex, courses.length, cardsToShow])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsAutoPlaying(!isAutoPlaying)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, courses.length - cardsToShow + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, courses.length - cardsToShow + 1)) % Math.max(1, courses.length - cardsToShow + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
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
            {/* Navigation Arrows - Always visible when there are multiple slides */}
            {courses.length > cardsToShow && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-110 group"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-110 group"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                </button>

                {/* Auto-play toggle button */}
                <button
                  onClick={toggleAutoPlay}
                  className="absolute top-4 right-4 z-30 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl group"
                  aria-label={isAutoPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
                >
                  {isAutoPlaying ? (
                    <div className="w-4 h-4 text-gray-600 group-hover:text-primary-600">
                      <div className="w-1 h-4 bg-current rounded-sm mx-0.5 inline-block"></div>
                      <div className="w-1 h-4 bg-current rounded-sm mx-0.5 inline-block"></div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 text-gray-600 group-hover:text-primary-600">
                      <div className="w-0 h-0 border-l-4 border-l-current border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                    </div>
                  )}
                </button>
              </>
            )}

            {/* Carousel Container with hover pause */}
            <div 
              className="relative overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Progress indicator */}
              {isAutoPlaying && courses.length > cardsToShow && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-50 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

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
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
                          }}
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

            {/* Desktop Navigation Dots */}
            {courses.length > cardsToShow && (
              <div className="flex justify-center mt-6 hidden sm:flex">
                {Array.from({ length: Math.ceil(courses.length / cardsToShow) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full mx-1 transition-all duration-200 hover:scale-125 ${
                      index === currentIndex ? 'bg-primary-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Mobile Navigation Dots */}
            {courses.length > cardsToShow && (
              <div className="flex justify-center mt-6 sm:hidden">
                {Array.from({ length: Math.ceil(courses.length / cardsToShow) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                      index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Keyboard navigation hint */}
            <div className="text-center mt-4 text-xs text-gray-500">
              <p>Use arrow keys to navigate • Spacebar to pause/resume</p>
            </div>
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