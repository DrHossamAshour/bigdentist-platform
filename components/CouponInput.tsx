'use client'

import { useState } from 'react'
import { Ticket, Check, X, Loader2 } from 'lucide-react'

interface CouponInputProps {
  onCouponApplied: (couponData: {
    code: string
    discountAmount: number
    finalAmount: number
  }) => void
  onCouponRemoved: () => void
  originalAmount: number
  disabled?: boolean
}

export default function CouponInput({ 
  onCouponApplied, 
  onCouponRemoved, 
  originalAmount, 
  disabled = false 
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discountAmount: number
    finalAmount: number
  } | null>(null)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          amount: originalAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid coupon code')
        return
      }

      const couponData = {
        code: data.coupon.code,
        discountAmount: data.discountAmount,
        finalAmount: data.finalAmount,
      }

      setAppliedCoupon(couponData)
      onCouponApplied(couponData)
      setCouponCode('')
    } catch (error) {
      setError('Error applying coupon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    onCouponRemoved()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApplyCoupon()
    }
  }

  return (
    <div className="space-y-4">
      {appliedCoupon ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Coupon applied: {appliedCoupon.code}
                </p>
                <p className="text-sm text-green-600">
                  You saved ${appliedCoupon.discountAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              disabled={disabled}
              className="text-green-600 hover:text-green-800 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Have a coupon code?
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={disabled || loading}
                placeholder="Enter coupon code"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={disabled || loading || !couponCode.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  )
} 