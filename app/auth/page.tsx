'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSignUp = searchParams.get('mode') === 'signup'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        await signUpWithEmail(email, password)
        setError('Sign up successful! Check your email for confirmation.')
      } else {
        await signInWithEmail(email, password)
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-healthcare-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-healthcare-600 mb-2">
              MedAI
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                placeholder="••••••••"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading
                ? 'Loading...'
                : isSignUp
                  ? 'Sign Up'
                  : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link href="/auth" className="text-healthcare-600 hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link
                  href="/auth?mode=signup"
                  className="text-healthcare-600 hover:underline"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Demo Account:</p>
            <p>Email: demo@medai.health</p>
            <p>Password: demo1234</p>
          </div>
        </div>
      </div>
    </div>
  )
}
