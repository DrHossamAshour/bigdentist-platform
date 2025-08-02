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
    const userData = localStorage.getItem('userData')
    const hasUserData = userData !== null && userData !== 'null' && userData !== 'undefined' && userData !== ''
    
    // Check cookies - be more specific about auth token
    const hasAuthToken = document.cookie.includes('auth-token=') && document.cookie.includes('auth-token=eyJ')
    
    console.log('Login check:', { localStorageLogin, hasAuthToken, hasUserData, userData })
    
    // Only return true if we have BOTH localStorage login flag AND valid userData AND valid auth token
    if (localStorageLogin && hasUserData && hasAuthToken) {
      return true
    }
    
    // If any part is missing, clear the invalid state
    if (localStorageLogin && (!hasUserData || !hasAuthToken)) {
      console.log('Clearing invalid login state')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userData')
      return false
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
    // Clear all possible auth tokens from cookies with multiple methods
    document.cookie = "auth-token=; Max-Age=0; path=/; domain=; secure; samesite=strict";
    document.cookie = "auth-token=; Max-Age=0; path=/";
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=";
    
    // Clear ALL cookies completely
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear all localStorage auth data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    localStorage.removeItem('auth');
    localStorage.removeItem('login');
    
    // Clear sessionStorage as well
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('session');
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('login');
    
    // NUCLEAR OPTION: Clear everything
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('Auth data cleared. Current state:')
    console.log('- localStorage isLoggedIn:', localStorage.getItem('isLoggedIn'))
    console.log('- localStorage userData:', localStorage.getItem('userData'))
    console.log('- cookies:', document.cookie)
    
    // Force a complete page reload to clear any cached state
    window.location.replace("/login");
    
    // If that doesn't work, force a hard reload
    setTimeout(() => {
      window.location.href = "/login";
      window.location.reload();
    }, 100);
    
  } catch (error) {
    console.error('Error during logout:', error)
    // Fallback: force redirect to login with page reload
    window.location.replace("/login");
    window.location.reload();
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
  
  // Only check on dashboard/admin pages, not on public pages like homepage
  const currentPath = window.location.pathname
  const isPublicPage = currentPath === '/' || currentPath === '/login' || currentPath === '/register' || currentPath === '/about' || currentPath === '/courses'
  
  if (isPublicPage) {
    // Don't force logout on public pages - let people browse freely
    return
  }
  
  const isUserLoggedIn = isLoggedIn()
  console.log('Force logout check - isLoggedIn:', isUserLoggedIn, 'on path:', currentPath)
  
  if (!isUserLoggedIn) {
    console.log('User not logged in on protected page, clearing any remaining auth data...')
    // Clear any remaining auth data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user');
    
    // Only redirect to login if on a protected page
    if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin') || currentPath.startsWith('/instructor')) {
      window.location.href = "/login";
    }
  }
} 

// Function to manually clear all auth data (for debugging)
export function manualClearAuth(): void {
  console.log('Manual auth clear - clearing all auth data...')
  
  try {
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear all localStorage
    localStorage.clear();
    
    // Clear all sessionStorage
    sessionStorage.clear();
    
    console.log('Manual auth clear completed')
    console.log('- localStorage:', localStorage)
    console.log('- sessionStorage:', sessionStorage)
    console.log('- cookies:', document.cookie)
    
    // Force page reload
    window.location.reload();
  } catch (error) {
    console.error('Error during manual auth clear:', error)
    window.location.reload();
  }
} 