'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const courses = [
  {
    id: '1',
    title: 'MODERN ORTHODONTIC TECHNIQUES',
    subtitle: 'Complete Orthodontic Training',
    description: 'Learn modern orthodontic methods and treatment planning',
    price: 199,
    tag: 'POPULAR'
  },
  {
    id: '2',
    title: 'COSMETIC DENTISTRY MASTERCLASS',
    subtitle: 'Aesthetic Dentistry Excellence',
    description: 'Master cosmetic dental procedures and smile design',
    price: 249,
    tag: 'NEW'
  },
  {
    id: '3',
    title: 'ENDODONTIC EXCELLENCE',
    subtitle: 'Root Canal Mastery',
    description: 'Advanced endodontic techniques and treatment protocols',
    price: 179,
    tag: 'TRENDING'
  },
  {
    id: '4',
    title: 'PERIODONTAL SURGERY',
    subtitle: 'Gum Disease Treatment',
    description: 'Comprehensive periodontal treatment methods',
    price: 199
  },
  {
    id: '5',
    title: 'DENTAL IMPLANTOLOGY',
    subtitle: 'Advanced Implant Techniques',
    description: 'Master the latest dental implant procedures',
    price: 299,
    tag: 'FEATURED'
  },
  {
    id: '6',
    title: 'PEDIATRIC DENTISTRY',
    subtitle: 'Child Dental Care Excellence',
    description: 'Specialized techniques for treating young patients',
    price: 159
  }
]

export default function CourseSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (courses.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (courses.length - 2)) % (courses.length - 2))
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular dental education courses
          </p>
        </div>

        {/* Course Slider */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Course Cards Container */}
          <div className="flex gap-6 overflow-hidden px-4">
            {courses.slice(currentIndex, currentIndex + 3).map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-300"
              >
                <div className="p-6 relative">
                  {/* Tag */}
                  {course.tag && (
                    <div className="flex justify-end mb-4">
                      <span className="bg-yellow-300 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {course.tag}
                      </span>
                    </div>
                  )}

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {course.title}
                  </h3>

                  {/* Course Subtitle */}
                  <p className="text-sm text-gray-700 mb-3 font-medium">
                    {course.subtitle}
                  </p>

                  {/* Course Description */}
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${course.price}
                      </span>
                    </div>
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 