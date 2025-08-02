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
  if (typeof document === "undefined") return null;
  
  try {
    const match = document.cookie.match(/auth-token=([^;]+)/)
    if (match) {
      const token = match[1]
      const decoded = jwtDecode(token) as { role?: string }
      return decoded.role || null
    }
  } catch (e) {
    // ignore
  }
  return null
}

export function getDashboardUrl(): string {
  const role = getUserRole()
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return '/admin'
  } else if (role === 'INSTRUCTOR') {
    return '/instructor/dashboard'
  }
  return '/dashboard'
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem('isLoggedIn') === 'true';
}

export function handleLogout(): void {
  // Remove the auth-token cookie
  document.cookie = "auth-token=; Max-Age=0; path=/";
  localStorage.removeItem('isLoggedIn');
  window.location.href = "/login";
} 