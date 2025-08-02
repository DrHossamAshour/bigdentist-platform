import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import { jwtDecode } from 'jwt-decode'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d',
  })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload
  } catch (error) {
    return null
  }
}

export const createUser = async (userData: {
  email: string
  firstName: string
  lastName: string
  password: string
  phone?: string
  role?: string
}) => {
  const hashedPassword = await hashPassword(userData.password)
  
  return await prisma.user.create({
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashedPassword,
      phone: userData.phone,
      role: userData.role as any || 'STUDENT',
    },
  })
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }

  return user
} 

export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    // First try to get role from localStorage (more reliable)
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsed = JSON.parse(userData)
      console.log('User data from localStorage:', parsed)
      if (parsed && parsed.role) {
        console.log('User role from localStorage:', parsed.role)
        return parsed.role
      }
    }
    
    // Fallback to JWT token from cookies
    const match = document.cookie.match(/auth-token=([^;]+)/)
    if (match) {
      const token = match[1]
      console.log('Found auth token, decoding...')
      const decoded = jwtDecode(token) as { role?: string }
      console.log('Decoded token:', decoded)
      if (decoded && decoded.role) {
        console.log('User role from JWT:', decoded.role)
        return decoded.role
      }
    } else {
      console.log('No auth token found in cookies')
    }
    
    // Check if user is logged in but no role found
    const isLoggedInFlag = localStorage.getItem('isLoggedIn') === 'true'
    if (isLoggedInFlag) {
      console.log('User is logged in but no role found, defaulting to STUDENT')
      return 'STUDENT'
    }
  } catch (e) {
    console.error('Error getting user role:', e)
  }
  
  console.log('No user role found, returning null')
  return null
}

export function getDashboardUrl(): string {
  const role = getUserRole()
  console.log('Getting dashboard URL for role:', role)
  
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    console.log('Returning admin dashboard URL')
    return '/admin'
  } else if (role === 'INSTRUCTOR') {
    console.log('Returning instructor dashboard URL')
    return '/instructor/dashboard'
  } else {
    console.log('Returning student dashboard URL')
    return '/dashboard'
  }
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    // Check localStorage first
    const localStorageLogin = localStorage.getItem('isLoggedIn') === 'true'
    const hasUserData = localStorage.getItem('userData') !== null
    
    // Check cookies
    const hasAuthToken = document.cookie.includes('auth-token=')
    
    console.log('Login check:', { localStorageLogin, hasAuthToken, hasUserData })
    
    // If any of these indicate login, return true
    if (localStorageLogin || hasAuthToken || hasUserData) {
      return true
    }
    
    return false
  } catch (e) {
    console.error('Error checking login status:', e)
    return false
  }
}

export function handleLogout(): void {
  console.log('Logging out - clearing all auth data...')
  
  try {
    // Clear all possible auth tokens from cookies
    document.cookie = "auth-token=; Max-Age=0; path=/; domain=; secure; samesite=strict";
    document.cookie = "auth-token=; Max-Age=0; path=/";
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    
    // Clear all localStorage auth data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    
    // Clear sessionStorage as well
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user');
    
    console.log('Auth data cleared. Current state:')
    console.log('- localStorage isLoggedIn:', localStorage.getItem('isLoggedIn'))
    console.log('- localStorage userData:', localStorage.getItem('userData'))
    console.log('- cookies:', document.cookie)
    
    // Force a page reload to clear any cached state
    window.location.href = "/login";
  } catch (error) {
    console.error('Error during logout:', error)
    // Fallback: force redirect to login
    window.location.href = "/login";
  }
}

// New function to set user data after login
export function setUserData(userData: { id: string; email: string; role: string; firstName: string; lastName: string }) {
  if (typeof window === "undefined") return;
  
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('userData', JSON.stringify(userData))
  console.log('User data set:', userData)
}

// Function to force logout check and redirect if needed
export function forceLogoutCheck(): void {
  if (typeof window === "undefined") return;
  
  const isUserLoggedIn = isLoggedIn()
  console.log('Force logout check - isLoggedIn:', isUserLoggedIn)
  
  if (!isUserLoggedIn) {
    console.log('User not logged in, clearing any remaining auth data...')
    // Clear any remaining auth data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user');
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = "/login";
    }
  }
} 