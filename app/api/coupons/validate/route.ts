import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/coupons/validate - Validate coupon code and calculate discount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, amount, courseId, appliedCoupons = [] } = body

    if (!code || !amount) {
      return NextResponse.json(
        { error: 'Coupon code and amount are required' },
        { status: 400 }
      )
    }

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      )
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Coupon is inactive' },
        { status: 400 }
      )
    }

    // Check if coupon has expired
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      )
    }

    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'Coupon usage limit reached' },
        { status: 400 }
      )
    }

    // Check minimum amount requirement
    if (coupon.minAmount && amount < coupon.minAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of $${coupon.minAmount} required` },
        { status: 400 }
      )
    }

    // Check course-specific restrictions
    if (!coupon.appliesToAllCourses && courseId) {
      const allowedCourseIds = coupon.allowedCourseIds?.split(',').map(id => id.trim()) || []
      if (!allowedCourseIds.includes(courseId)) {
        return NextResponse.json(
          { error: 'This coupon is not valid for this course' },
          { status: 400 }
        )
      }
    }

    // Check stacking restrictions
    if (!coupon.canStackWithOtherCoupons && appliedCoupons.length > 0) {
      return NextResponse.json(
        { error: 'This coupon cannot be combined with other coupons' },
        { status: 400 }
      )
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (amount * coupon.discountValue) / 100
      // Apply maximum discount limit if set
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount
      }
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discountAmount = coupon.discountValue
    }

    const finalAmount = Math.max(0, amount - discountAmount)

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        canStackWithOtherCoupons: coupon.canStackWithOtherCoupons
      },
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      originalAmount: amount
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 