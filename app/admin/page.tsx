'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, BookOpen, DollarSign, TrendingUp, BarChart3, Settings,
  Search, Filter, LayoutDashboard, Users2, Book, UserCheck, Briefcase, 
  Image, Bot, Rss, Ticket, Home, ShoppingCart, Shield, FileText,
  Plus, Star, Eye, Edit, Trash2, Calendar, MessageSquare, Globe, Palette, Bell
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalRevenue: number
  totalEnrollments: number
  activeSubscriptions: number
  monthlyGrowth: number
}

interface RecentCourse {
  id: string
  title: string
  instructor: {
    firstName: string
    lastName: string
  }
  price: number
  enrollmentCount: number
  rating: number
  status: string
  createdAt: string
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: string
  joinedDate: string
  status: string
}

const sidebarMenu = [
  { label: 'Dashboard', icon: Home, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Courses', icon: BookOpen, href: '/admin/courses' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
  { label: 'Manage Organization', icon: Users, href: '/admin/organizations' },
  { label: 'Staff', icon: Users, href: '/admin/staff' },
  { label: 'Media Library', icon: Image, href: '/admin/media' },
  { label: 'AI Assistant', icon: Bot, href: '/admin/ai' },
  { label: 'Blog', icon: Rss, href: '/admin/blog' },
]

function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen max-h-screen bg-gray-900 text-white fixed top-0 left-0 z-30 border-r border-gray-800 overflow-y-auto">
      <div className="flex items-center h-20 px-6 border-b border-gray-800">
        <span className="text-2xl font-bold tracking-tight text-primary-400">BigDentist</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarMenu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-base font-medium"
          >
            <item.icon className="w-5 h-5 text-primary-400" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
  })
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalUsers: 15420,
      totalCourses: 89,
      totalRevenue: 125430,
      totalEnrollments: 45678,
      activeSubscriptions: 8920,
      monthlyGrowth: 12.5,
    })

    setRecentCourses([
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        instructor: { firstName: 'David', lastName: 'Wilson' },
        price: 89.99,
        enrollmentCount: 15420,
        rating: 4.8,
        status: 'active',
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Advanced JavaScript Mastery',
        instructor: { firstName: 'Sarah', lastName: 'Chen' },
        price: 69.99,
        enrollmentCount: 8920,
        rating: 4.9,
        status: 'active',
        createdAt: '2024-01-14',
      },
      {
        id: '3',
        title: 'UI/UX Design Fundamentals',
        instructor: { firstName: 'Emily', lastName: 'Rodriguez' },
        price: 79.99,
        enrollmentCount: 12350,
        rating: 4.7,
        status: 'active',
        createdAt: '2024-01-13',
      },
    ])

    setRecentUsers([
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'Student',
        joinedDate: '2024-01-15',
        status: 'active',
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Instructor',
        joinedDate: '2024-01-14',
        status: 'active',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'Student',
        joinedDate: '2024-01-13',
        status: 'pending',
      },
    ])
    setLoading(false)
  }, [])

  const quickActions = [
    {
      title: 'Create New Course',
      icon: Plus,
      href: '/admin/courses/new',
      color: 'bg-yellow-600',
      description: 'Add a new course to the platform'
    },
    {
      title: 'Manage Students',
      icon: Users,
      href: '/admin/students',
      color: 'bg-blue-600',
      description: 'View and manage student accounts'
    },
    {
      title: 'View Analytics',
      icon: BarChart3,
      href: '/admin',
      color: 'bg-green-600',
      description: 'Platform performance metrics'
    },
    {
      title: 'Site Settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-purple-600',
      description: 'Configure platform settings'
    },
  ]

  const adminModules = [
    {
      title: 'Course Management',
      icon: BookOpen,
      href: '/admin/courses',
      color: 'bg-yellow-600',
      description: 'Manage all courses, content, and instructors',
      stats: `${stats.totalCourses} courses`
    },
    {
      title: 'Student Management',
      icon: Users,
      href: '/admin/students',
      color: 'bg-blue-600',
      description: 'Manage students, instructors, and admins',
      stats: `${stats.totalUsers.toLocaleString()} users`
    },
    {
      title: 'Enrollment Management',
      icon: Users2,
      href: '/admin/enrollments',
      color: 'bg-green-600',
      description: 'Track and manage student enrollments',
      stats: `${stats.totalEnrollments.toLocaleString()} enrollments`
    },
    {
      title: 'Quiz & Assignments',
      icon: FileText,
      href: '/admin/quizzes',
      color: 'bg-purple-600',
      description: 'Create and manage quizzes and assignments',
      stats: '3 quizzes'
    },
    {
      title: 'Instructor Management',
      icon: Briefcase,
      href: '/admin/instructors',
      color: 'bg-orange-600',
      description: 'Manage instructors and their courses',
      stats: '12 instructors'
    },
    {
      title: 'Organization Management',
      icon: Users,
      href: '/admin/organizations',
      color: 'bg-indigo-600',
      description: 'Manage organizations and subscriptions',
      stats: '25 organizations'
    },
    {
      title: 'Staff Management',
      icon: Shield,
      href: '/admin/staff',
      color: 'bg-red-600',
      description: 'Manage staff members and permissions',
      stats: '8 staff members'
    },
    {
      title: 'Media Library',
      icon: Image,
      href: '/admin/media',
      color: 'bg-pink-600',
      description: 'Manage media files and assets',
      stats: '156 files'
    },
    {
      title: 'AI Assistant',
      icon: Bot,
      href: '/admin/ai',
      color: 'bg-teal-600',
      description: 'AI-powered platform management',
      stats: 'Online'
    },
    {
      title: 'Blog Management',
      icon: Rss,
      href: '/admin/blog',
      color: 'bg-gray-600',
      description: 'Manage blog posts and content',
      stats: '3 posts'
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
          <div className="bg-white rounded-lg shadow p-6 w-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{stats.monthlyGrowth}% this month</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 w-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-yellow-600">Active courses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 w-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% this month</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 w-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments.toLocaleString()}</p>
                <p className="text-xs text-purple-600">Total enrollments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Modules */}
        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {adminModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 w-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {module.stats}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Courses & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
              <Link
                href="/admin/courses"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">
                        by {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          {course.enrollmentCount.toLocaleString()} students
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <span className="text-lg font-bold text-blue-600">${course.price}</span>
                      <span className="text-xs text-gray-500">{course.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
              <Link
                href="/admin/students"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-medium ${user.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{user.status}</span>
                      <span className="text-xs text-gray-500">Joined {user.joinedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 