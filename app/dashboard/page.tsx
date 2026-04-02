'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
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
      <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          <p className="mt-4 text-neon-cyan neon-text">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800">
      <nav className="bg-dark-800/80 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-neon-cyan neon-text">🏥 MedAI</h1>
          <div className="flex items-center gap-4">
            <span className="text-dark-300">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 btn-secondary hover:bg-dark-600"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-dark-100 mb-4 neon-text">
            Welcome to MedAI Health Copilot
          </h2>
          <p className="text-xl text-dark-400">
            Your AI-powered multimodal healthcare assistant
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Symptom Analysis Card */}
          <Link href="/analysis">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full pulse-glow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-cyan-500/20 rounded-lg medical-glow">
                  <Activity className="text-neon-cyan" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-100">
                    Symptom Analysis
                  </h3>
                  <p className="text-dark-400">
                    Analyze symptoms with AI
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Skin Analysis Card */}
          <Link href="/skin-analysis">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full pulse-glow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-500/20 rounded-lg medical-glow">
                  <Image className="text-neon-blue" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-100">
                    Skin Analysis
                  </h3>
                  <p className="text-dark-400">
                    Vision AI image analysis
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Health History Card */}
          <Link href="/health-history">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full pulse-glow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-500/20 rounded-lg medical-glow">
                  <History className="text-neon-green" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-100">
                    Health History
                  </h3>
                  <p className="text-dark-400">
                    View past diagnoses
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Health Trends Card */}
          <Link href="/health-trends">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full pulse-glow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-500/20 rounded-lg medical-glow">
                  <TrendingUp className="text-neon-purple" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-100">
                    Health Trends
                  </h3>
                  <p className="text-dark-400">
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
