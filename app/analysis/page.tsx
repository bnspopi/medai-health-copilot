'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { analyzeSymptomsWithAI } from '@/lib/openai'
import { saveDiagnosis } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Loader } from 'lucide-react'

export default function SymptomAnalysis() {
  const router = useRouter()
  const { user } = useAuth()
  const [symptoms, setSymptoms] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Please enter your symptoms')
      return
    }

    setError('')
    setLoading(true)

    try {
      const analysis = await analyzeSymptomsWithAI(symptoms)
      setResult(analysis)

      if (user?.id) {
        await saveDiagnosis(user.id, symptoms, analysis)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze symptoms')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-healthcare-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-healthcare-600 hover:underline">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          AI Symptom Analysis
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="card space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Describe Your Symptoms
            </h2>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., I have a persistent dry cough for 3 days, mild fever around 100°F, and fatigue. No chest pain or shortness of breath."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-500 resize-none"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="animate-spin" size={20} />}
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-2xl font-bold text-healthcare-600 mb-4">
                  Differential Diagnosis
                </h3>

                <div className="space-y-3 mb-6">
                  {result.differential_diagnosis?.map(
                    (item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-gradient-to-r from-healthcare-50 to-blue-50 border border-healthcare-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800">
                            {item.condition}
                          </h4>
                          <span className="px-3 py-1 bg-healthcare-600 text-white rounded-full text-sm font-bold">
                            {item.confidence}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Severity: {item.severity}
                        </p>
                        {item.icd_code && (
                          <p className="text-xs text-gray-500 mt-1">
                            ICD-10: {item.icd_code}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>

                {result.red_flags && result.red_flags.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <h4 className="font-bold text-red-700 mb-2">⚠️ Red Flags</h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      {result.red_flags.map((flag: string, idx: number) => (
                        <li key={idx}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.next_steps && result.next_steps.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-bold text-green-700 mb-2">
                      ✅ Recommended Next Steps
                    </h4>
                    <ol className="text-sm text-green-600 space-y-1 list-decimal list-inside">
                      {result.next_steps.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!result && (
          <div className="mt-12 card text-center">
            <p className="text-gray-600 text-lg">
              Enter your symptoms to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
