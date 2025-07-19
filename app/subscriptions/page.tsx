'use client'

import { Check, Crown, Star, Users, Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    period: 'month',
    description: 'Perfect for beginners starting their learning journey',
    features: [
      'Access to 50+ courses',
      'HD video quality',
      'Mobile and desktop access',
      'Certificate of completion',
      '30-day money-back guarantee',
    ],
    icon: BookOpen,
    popular: false,
  },
  {
    id: 'premium',
    name: 'Pro Plan',
    price: 19.99,
    period: 'month',
    description: 'Ideal for serious learners and professionals',
    features: [
      'Access to all 200+ courses',
      '4K video quality',
      'Download for offline viewing',
      'Priority customer support',
      'Live Q&A sessions',
      'Exclusive content',
      'Certificate of completion',
      '30-day money-back guarantee',
    ],
    icon: Crown,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 49.99,
    period: 'month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro Plan',
      'Team management dashboard',
      'Custom learning paths',
      'Analytics and reporting',
      'Dedicated account manager',
      'API access',
      'White-label options',
      '30-day money-back guarantee',
    ],
    icon: Users,
    popular: false,
  },
]

const stats = [
  { label: 'Course Available', value: '200+', icon: BookOpen },
  { label: 'Active Learner', value: '50K+', icon: Users },
  { label: 'Professional Lecturer', value: '100+', icon: Star },
  { label: 'Educational Hour', value: '1000+', icon: Clock },
]

const faq = [
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with our service, you can request a full refund within 30 days of your purchase.',
  },
  {
    question: 'Can I access courses offline?',
    answer: 'Yes, Pro and Enterprise plan subscribers can download courses for offline viewing on mobile devices.',
  },
  {
    question: 'Are the certificates recognized?',
    answer: 'Yes, our certificates are recognized by many employers and educational institutions worldwide.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'Do you offer team discounts?',
    answer: 'Yes, we offer special pricing for teams and organizations. Contact our sales team for more information.',
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Developer',
    content: 'BigDentist has transformed my career. The quality of courses and the support from instructors is exceptional.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Manager',
    content: 'I\'ve tried many learning platforms, but BigDentist stands out for its practical, real-world content.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    content: 'The Pro plan is worth every penny. The offline access and exclusive content have been game-changers for me.',
    rating: 5,
  },
]

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
              <p className="text-gray-600 mt-2">Choose the perfect plan for your learning journey</p>
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

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Unlock Your Full Learning Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our flexible subscription plans and get unlimited access to high-quality courses, 
              expert instructors, and a supportive learning community.
            </p>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose the Perfect Plan for You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a variety of plans to suit your learning needs, from beginners to large organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-primary-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <plan.icon className={`w-12 h-12 ${plan.popular ? 'text-primary-600' : 'text-gray-600'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500 mr-2">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h3>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who are already advancing their careers with BigDentist
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors">
              View All Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 