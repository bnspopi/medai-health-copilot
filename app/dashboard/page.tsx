'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Home,
  Activity,
  TrendingUp,
  Image,
  History,
  LogOut,
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, mounted, router])

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-healthcare-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
          <p className="mt-4 text-healthcare-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-healthcare-100">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-healthcare-600">🏥 MedAI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 btn-secondary hover:bg-gray-300"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to MedAI Health Copilot
          </h2>
          <p className="text-xl text-gray-600">
            Your AI-powered multimodal healthcare assistant
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Symptom Analysis Card */}
          <Link href="/analysis">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-healthcare-100 rounded-lg">
                  <Activity className="text-healthcare-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Symptom Analysis
                  </h3>
                  <p className="text-gray-600">
                    Analyze symptoms with AI
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Skin Analysis Card */}
          <Link href="/skin-analysis">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <Image className="text-blue-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Skin Analysis
                  </h3>
                  <p className="text-gray-600">
                    Vision AI image analysis
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Health History Card */}
          <Link href="/health-history">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-100 rounded-lg">
                  <History className="text-green-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Health History
                  </h3>
                  <p className="text-gray-600">
                    View past diagnoses
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Health Trends Card */}
          <Link href="/health-trends">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-100 rounded-lg">
                  <TrendingUp className="text-purple-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Health Trends
                  </h3>
                  <p className="text-gray-600">
                    Disease patterns & analytics
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 card bg-blue-50 border-l-4 border-healthcare-600">
          <h3 className="text-lg font-bold text-healthcare-600 mb-2">
            💡 Quick Tips
          </h3>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• Provide detailed symptoms for better diagnosis accuracy</li>
            <li>• Upload clear skin images for accurate skin analysis</li>
            <li>• Check your Health Trends to understand disease patterns</li>
            <li>• Share health reports with your doctor using shareable links</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
