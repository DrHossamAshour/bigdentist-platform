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
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1)
      } else if (window.innerWidth < 768) {
        setCardsToShow(2)
      } else if (window.innerWidth < 1024) {
        setCardsToShow(3)
      } else if (window.innerWidth < 1280) {
        setCardsToShow(4)
      } else {
        setCardsToShow(5) // Show 5 cards on large screens
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
    if (!isAutoPlaying || courses.length <= cardsToShow || isDragging) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, courses.length - cardsToShow + 1))
    }, 4000) // Faster auto-sliding for more active feel

    return () => clearInterval(interval)
  }, [courses.length, cardsToShow, isAutoPlaying, isDragging])

  // Progress indicator for auto-sliding
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (!isAutoPlaying || courses.length <= cardsToShow || isDragging) {
      setProgress(0)
      return
    }

    const duration = 4000 // 4 seconds
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
  }, [isAutoPlaying, currentIndex, courses.length, cardsToShow, isDragging])

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

  // Touch/Drag handlers for mobile swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragOffset(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const currentX = e.clientX
    const diff = currentX - dragStartX
    setDragOffset(diff)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
    
    setIsDragging(false)
    setDragOffset(0)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragOffset(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const diff = currentX - dragStartX
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
    
    setIsDragging(false)
    setDragOffset(0)
  }

  const getCardStyle = (index: number) => {
    const position = index - currentIndex
    const baseStyle = `flex-shrink-0 transition-all duration-700 ease-out`
    
    if (position < 0 || position >= cardsToShow) {
      return `${baseStyle} opacity-0 scale-75 pointer-events-none`
    }
    
    if (cardsToShow === 1) {
      // Single card - full width with 3D effect
      return `${baseStyle} w-full transform scale-100 opacity-100 hover:scale-105`
    } else if (cardsToShow === 2) {
      // Two cards with dramatic 3D effect
      if (position === 0) {
        return `${baseStyle} w-1/2 transform -rotate-y-12 scale-90 opacity-80 -translate-x-4 hover:scale-95 hover:-rotate-y-8`
      } else {
        return `${baseStyle} w-1/2 transform rotate-y-12 scale-90 opacity-80 translate-x-4 hover:scale-95 hover:rotate-y-8`
      }
    } else if (cardsToShow === 3) {
      // Three cards with enhanced 3D effect
      if (position === 0) {
        return `${baseStyle} w-1/3 transform -rotate-y-15 scale-85 opacity-70 -translate-x-6 hover:scale-90 hover:-rotate-y-10`
      } else if (position === 1) {
        return `${baseStyle} w-1/3 transform scale-100 opacity-100 z-10 hover:scale-105`
      } else {
        return `${baseStyle} w-1/3 transform rotate-y-15 scale-85 opacity-70 translate-x-6 hover:scale-90 hover:rotate-y-10`
      }
    } else {
      // 4+ cards with progressive 3D effect
      if (position === 0) {
        return `${baseStyle} w-1/${cardsToShow} transform -rotate-y-15 scale-80 opacity-60 -translate-x-8 hover:scale-85 hover:-rotate-y-10`
      } else if (position === 1) {
        return `${baseStyle} w-1/${cardsToShow} transform -rotate-y-8 scale-90 opacity-80 -translate-x-4 hover:scale-95 hover:-rotate-y-5`
      } else if (position === Math.floor(cardsToShow / 2)) {
        return `${baseStyle} w-1/${cardsToShow} transform scale-100 opacity-100 z-20 hover:scale-105`
      } else if (position === cardsToShow - 2) {
        return `${baseStyle} w-1/${cardsToShow} transform rotate-y-8 scale-90 opacity-80 translate-x-4 hover:scale-95 hover:rotate-y-5`
      } else if (position === cardsToShow - 1) {
        return `${baseStyle} w-1/${cardsToShow} transform rotate-y-15 scale-80 opacity-60 translate-x-8 hover:scale-85 hover:rotate-y-10`
      } else {
        return `${baseStyle} w-1/${cardsToShow} transform scale-95 opacity-90 hover:scale-100`
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

          {/* Course Carousel - Modern Card Swipe */}
          <div className="relative max-w-7xl mx-auto">
            {/* Navigation Arrows - Always visible when there are multiple slides */}
            {courses.length > cardsToShow && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group hover:-translate-x-1"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group hover:translate-x-1"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                </button>

                {/* Auto-play toggle button */}
                <button
                  onClick={toggleAutoPlay}
                  className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 rounded-full p-3 shadow-lg transition-all duration-300 hover:shadow-xl group hover:scale-110"
                  aria-label={isAutoPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
                >
                  {isAutoPlaying ? (
                    <div className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors">
                      <div className="w-1 h-5 bg-current rounded-sm mx-0.5 inline-block"></div>
                      <div className="w-1 h-5 bg-current rounded-sm mx-0.5 inline-block"></div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors">
                      <div className="w-0 h-0 border-l-5 border-l-current border-t-3 border-t-transparent border-b-3 border-b-transparent ml-1"></div>
                    </div>
                  )}
                </button>

                {/* Slide counter */}
                <div className="absolute bottom-4 left-4 z-30 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentIndex + 1} / {Math.ceil(courses.length / cardsToShow)}
                </div>
              </>
            )}

            {/* Modern Card Swipe Container */}
            <div 
              className="relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Progress indicator */}
              {isAutoPlaying && courses.length > cardsToShow && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-50 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Card Swipe Container */}
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(calc(-${currentIndex * (100 / cardsToShow)}% + ${dragOffset}px))`,
                  width: `${(courses.length + cardsToShow) * (100 / cardsToShow)}%`
                }}
              >
                {/* Duplicate first cards at the end for infinite effect */}
                {courses.slice(-cardsToShow).map((course, index) => (
                  <div key={`end-${course.id}`} className={getCardStyle(index - cardsToShow)}>
                    <div className="relative group cursor-pointer mx-2">
                      {/* Modern Card Container */}
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transform">
                        {/* Card Image */}
                        <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                          <img
                            src={course.image || course.thumbnail || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
                            }}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute bottom-4 right-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse">
                                <ArrowRight className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Floating Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                              Special Offer
                            </span>
                          </div>

                          {/* Duration Badge */}
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-medium">{course.countdown || '25:00'}h</span>
                          </div>

                          {/* Hover Action Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                              View Course
                            </button>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          {/* Course Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                            {course.title}
                          </h3>
                          
                          {/* Arabic Subtitle */}
                          {course.subtitle && (
                            <p className="text-sm text-gray-600 mb-3 font-medium line-clamp-1">
                              {course.subtitle}
                            </p>
                          )}

                          {/* Course Topics */}
                          {course.topics && course.topics.length > 0 && (
                            <ul className="mb-4 space-y-1">
                              {course.topics.slice(0, 2).map((topic, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-700">
                                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                                  <span className="line-clamp-1">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Enroll Button */}
                          <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-2 px-3 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:shadow-2xl">
                            Enroll Now
                          </button>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Main course cards */}
                {courses.map((course, index) => (
                  <div key={course.id} className={getCardStyle(index)}>
                    <div className="relative group cursor-pointer mx-2">
                      {/* Modern Card Container */}
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transform">
                        {/* Card Image */}
                        <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                          <img
                            src={course.image || course.thumbnail || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
                            }}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute bottom-4 right-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse">
                                <ArrowRight className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Floating Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                              Special Offer
                            </span>
                          </div>

                          {/* Duration Badge */}
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-medium">{course.countdown || '25:00'}h</span>
                          </div>

                          {/* Hover Action Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                              View Course
                            </button>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          {/* Course Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                            {course.title}
                          </h3>
                          
                          {/* Arabic Subtitle */}
                          {course.subtitle && (
                            <p className="text-sm text-gray-600 mb-3 font-medium line-clamp-1">
                              {course.subtitle}
                            </p>
                          )}

                          {/* Course Topics */}
                          {course.topics && course.topics.length > 0 && (
                            <ul className="mb-4 space-y-1">
                              {course.topics.slice(0, 2).map((topic, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-700">
                                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                                  <span className="line-clamp-1">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Enroll Button */}
                          <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-2 px-3 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:shadow-2xl">
                            Enroll Now
                          </button>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Duplicate last cards at the beginning for infinite effect */}
                {courses.slice(0, cardsToShow).map((course, index) => (
                  <div key={`start-${course.id}`} className={getCardStyle(index + courses.length)}>
                    <div className="relative group cursor-pointer mx-2">
                      {/* Modern Card Container */}
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transform">
                        {/* Card Image */}
                        <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                          <img
                            src={course.image || course.thumbnail || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
                            }}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute bottom-4 right-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse">
                                <ArrowRight className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Floating Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                              Special Offer
                            </span>
                          </div>

                          {/* Duration Badge */}
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-medium">{course.countdown || '25:00'}h</span>
                          </div>

                          {/* Hover Action Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                              View Course
                            </button>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          {/* Course Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                            {course.title}
                          </h3>
                          
                          {/* Arabic Subtitle */}
                          {course.subtitle && (
                            <p className="text-sm text-gray-600 mb-3 font-medium line-clamp-1">
                              {course.subtitle}
                            </p>
                          )}

                          {/* Course Topics */}
                          {course.topics && course.topics.length > 0 && (
                            <ul className="mb-4 space-y-1">
                              {course.topics.slice(0, 2).map((topic, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-700">
                                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                                  <span className="line-clamp-1">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Enroll Button */}
                          <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-2 px-3 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:shadow-2xl">
                            Enroll Now
                          </button>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Navigation Dots */}
            {courses.length > cardsToShow && (
              <div className="flex justify-center mt-8 hidden sm:flex">
                {Array.from({ length: Math.ceil(courses.length / cardsToShow) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full mx-2 transition-all duration-300 hover:scale-125 hover:shadow-lg ${
                      index === currentIndex 
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-400'
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
                    className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
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