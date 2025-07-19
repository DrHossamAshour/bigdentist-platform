'use client'

import { Users, Target, Award, Heart, BookOpen, Globe, Star, Clock } from 'lucide-react'
import Link from 'next/link'

const team = [
  {
    name: 'John Smith',
    role: 'Founder & CEO',
    image: '👨‍💼',
    description: '15 years of experience in e-learning and educational platform development.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Educational Content',
    image: '👩‍🎓',
    description: 'Specialist in curriculum development with 10 years of teaching experience.',
  },
  {
    name: 'Michael Lee',
    role: 'Chief Technology Officer',
    image: '👨‍💻',
    description: 'Professional software developer with expertise in building e-learning platforms.',
  },
  {
    name: 'Emily Brown',
    role: 'Marketing Director',
    image: '👩‍💼',
    description: 'Expert in digital marketing and growth strategy.',
  },
]

const stats = [
  { label: 'Active Students', value: '50,000+', icon: Users },
  { label: 'Available Courses', value: '200+', icon: BookOpen },
  { label: 'Expert Instructors', value: '100+', icon: Star },
  { label: 'Learning Hours', value: '1000+', icon: Clock },
  { label: 'Countries', value: '25+', icon: Globe },
  { label: 'Positive Reviews', value: '98%', icon: Award },
]

const values = [
  {
    title: 'High Quality',
    description: 'We are committed to delivering high-quality educational content that meets the highest global standards.',
    icon: Award,
  },
  {
    title: 'Innovation',
    description: 'We continuously develop innovative teaching methods to enhance the learning experience.',
    icon: Target,
  },
  {
    title: 'Inclusivity',
    description: 'We believe education should be accessible to everyone, regardless of location or circumstances.',
    icon: Globe,
  },
  {
    title: 'Student Focus',
    description: 'We put student needs first and provide personalized support for every learner.',
    icon: Heart,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
              <p className="text-gray-600 mt-2">Learn about the BigDentist story and our mission</p>
            </div>
            <Link 
              href="/"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We Believe in the Power of Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              BigDentist is a leading online learning platform dedicated to making high-quality education accessible to everyone. Since our founding in 2020, we have helped over 50,000 students achieve their educational and professional goals.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <stat.icon className="w-8 h-8 text-primary-600 mb-2" />
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-gray-600 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We strive to democratize education by providing high-quality learning content in English, enabling students worldwide to gain the knowledge and skills they need to succeed in their careers and personal lives.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe education should be interactive, enjoyable, and accessible to all, regardless of geography or financial situation.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our vision is to be the leading educational platform in the world, aiming to help one million students achieve their learning goals by 2030.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are building a strong learning community that connects students with expert instructors and provides a supportive, motivating environment for continuous learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-lg text-gray-600">
              The values that guide our journey in advancing education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="flex justify-center mb-4">
                  <value.icon className="w-12 h-12 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h3>
            <p className="text-lg text-gray-600">
              Meet the talented team behind BigDentist's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h3>
          </div>

          <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
            <p>
              The BigDentist journey began in 2020 when our founder, John Smith, noticed a significant gap in high-quality online educational content. Students were forced to rely on either foreign content or low-quality local resources.
            </p>
            <p>
              We started with a small team of three and a group of passionate instructors. Today, we are a leading educational platform with over 100 expert instructors and more than 200 courses in various fields.
            </p>
            <p>
              What sets BigDentist apart is our commitment to quality and innovation. We constantly develop new teaching methods and improve the user experience. We believe learning should be interactive and enjoyable, so we use the latest technologies to ensure an exceptional learning journey.
            </p>
            <p>
              We are proud of what we have achieved so far, but our journey is not over. We aim to help even more students achieve their dreams and continue to develop our platform to be the best in the world.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Join Our Learning Journey
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            Start your learning journey today and discover a world of knowledge and skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              href="/subscriptions"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 