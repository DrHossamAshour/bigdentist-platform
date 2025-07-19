'use client'

import { useState } from 'react'
import { Globe, Palette, Mail, Eye, Save } from 'lucide-react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  primaryColor: string
  secondaryColor: string
  logo: string
  favicon: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
  seoSettings: {
    title: string
    description: string
    keywords: string
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'easyT.online',
    siteDescription: 'Modern e-learning platform',
    primaryColor: '#0EA5E9',
    secondaryColor: '#D946EF',
    logo: '',
    favicon: '',
    contactEmail: 'info@easyt.online',
    contactPhone: '+1 (555) 123-4567',
    address: 'New York, NY, USA',
    socialLinks: {
      facebook: 'https://facebook.com/easyt',
      twitter: 'https://twitter.com/easyt',
      instagram: 'https://instagram.com/easyt',
      youtube: 'https://youtube.com/easyt',
    },
    seoSettings: {
      title: 'easyT.online - Online Learning Platform',
      description: 'Learn programming, design, and marketing with the best instructors',
      keywords: 'education, programming, design, courses, online',
    },
  })

  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Settings saved successfully!')
  }

  const updateSettings = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateSocialLinks = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const updateSeoSettings = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      seoSettings: {
        ...prev.seoSettings,
        [field]: value,
      },
    }))
  }

  const tabs = [
    { id: 'general', name: 'General Settings', icon: Globe },
    { id: 'appearance', name: 'Appearance & Colors', icon: Palette },
    { id: 'contact', name: 'Contact Information', icon: Mail },
    { id: 'seo', name: 'SEO Settings', icon: Eye },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
              <p className="text-gray-600">Customize the appearance and content of your site</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              </div>
              <div className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
              </div>
              <div className="p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => updateSettings('siteName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => updateSettings('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => updateSettings('primaryColor', e.target.value)}
                          className="h-10 w-20 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => updateSettings('primaryColor', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => updateSettings('secondaryColor', e.target.value)}
                          className="h-10 w-20 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => updateSettings('secondaryColor', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => updateSettings('contactEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => updateSettings('contactPhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Homepage Title
                      </label>
                      <input
                        type="text"
                        value={settings.seoSettings.title}
                        onChange={(e) => updateSeoSettings('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Homepage Description
                      </label>
                      <textarea
                        value={settings.seoSettings.description}
                        onChange={(e) => updateSeoSettings('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 