'use client'

import { Star, Clock, User, ArrowLeft } from 'lucide-react'

export default function Hero() {
  // You can change this URL to any YouTube embed link in the future
  const youtubeEmbedUrl = "https://www.youtube.com/embed/jVdxthrmmhs";
  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            New at BigDentist
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest courses and premium learning content
          </p>
        </div>

        {/* Featured Course Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="md:flex">
            <div className="md:w-1/2 flex items-center justify-center bg-black">
              <div className="w-full aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={youtubeEmbedUrl}
                  title="BigDentist Intro Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-64 md:h-80 rounded-none"
                  style={{ minHeight: '16rem', borderRadius: 0 }}
                ></iframe>
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  New
                </span>
                <span className="text-sm text-gray-500">Available until December 31</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Website Design with AI
              </h3>
              <p className="text-gray-600 mb-6">
                Impress your audience with a stunning, fast website that delivers an exceptional user experience.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">By Alex Carter</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.9 (175 reviews)</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">12 hours</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-600">$25</span>
                  <span className="text-sm text-gray-500 line-through mr-2">$50</span>
                </div>
              </div>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Start Learning Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 