import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export interface AdminAuthResult {
  success: boolean
  error?: NextResponse
  userId?: string
  email?: string
  role?: string
}

/**
 * Centralized authentication and authorization check for admin/debug endpoints
 * Validates token and ensures user has admin or super admin role
 */
export function verifyAdminAuth(request: NextRequest): AdminAuthResult {
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Authentication required', details: 'No authentication token provided' },
        { status: 401 }
      )
    }
  }

  // Verify the token and get user info
  const decoded = verifyToken(token)
  if (!decoded) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid token', details: 'Authentication token is invalid or expired' },
        { status: 401 }
      )
    }
  }

  // Check if user has admin or super admin role
  if (!['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Access denied', details: 'Insufficient privileges for this operation' },
        { status: 403 }
      )
    }
  }

  return {
    success: true,
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role
  }
}

/**
 * Validate route parameters to prevent injection attacks
 */
export function validateRouteParam(param: string | undefined, paramName: string): { isValid: boolean; error?: NextResponse } {
  if (!param) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Invalid parameter', details: `Missing required parameter: ${paramName}` },
        { status: 400 }
      )
    }
  }

  // Basic validation - alphanumeric, hyphens, underscores only
  const validParamPattern = /^[a-zA-Z0-9_-]+$/
  if (!validParamPattern.test(param)) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Invalid parameter', details: `Parameter ${paramName} contains invalid characters` },
        { status: 400 }
      )
    }
  }

  return { isValid: true }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(error: string, details: string = '', status: number = 500): NextResponse {
  return NextResponse.json(
    { error, details },
    { status }
  )
}