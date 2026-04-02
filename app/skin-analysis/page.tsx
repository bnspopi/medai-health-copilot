'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/app/providers'
import { analyzeImageWithVision } from '@/lib/openai'
import { saveDiagnosis } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Upload, Loader } from 'lucide-react'

export default function SkinAnalysis() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imageSource, setImageSource] = useState<string>('')
  const [imageBase64, setImageBase64] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      setImageSource(src)
      
      const base64String = src.split(',')[1]
      setImageBase64(base64String)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setError('Please upload an image first')
      return
    }

    setError('')
    setLoading(true)

    try {
      const analysis = await analyzeImageWithVision(imageBase64)
      setResult(analysis)

      if (user?.id) {
        await saveDiagnosis(
          user.id,
          'Skin Image Analysis',
          analysis,
          imageSource
        )
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image')
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const event = {
        target: { files },
      } as any
      handleImageUpload(event)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-healthcare-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-healthcare-600 hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🔬 Skin Analysis
        </h1>
        <p className="text-gray-600 mb-8">
          Upload a skin image for AI-powered dermatological analysis using
          OpenAI Vision API
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="card space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Upload Skin Image
            </h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-healthcare-300 rounded-lg p-8 text-center cursor-pointer hover:bg-healthcare-50 transition-colors"
            >
              <Upload className="mx-auto mb-3 text-healthcare-500" size={40} />
              <p className="text-gray-600 font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !imageBase64}
              className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="animate-spin" size={20} />}
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>

          {/* Preview & Results */}
          <div className="space-y-4">
            {imageSource && (
              <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Preview
                </h3>
                <img
                  src={imageSource}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {result && (
              <div className="card space-y-4">
                <h3 className="text-2xl font-bold text-healthcare-600">
                  Analysis Results
                </h3>

                {/* ABCDE Assessment */}
                {result.abcde_assessment && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-700 mb-3">
                      🎯 ABCDE Melanoma Assessment
                    </h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(result.abcde_assessment).map(
                        ([key, value]: [string, any]) => (
                          <p key={key}>
                            <strong>{key.charAt(0).toUpperCase()}:</strong> {value}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Possible Conditions */}
                {result.possible_conditions &&
                  result.possible_conditions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-800">
                        Possible Conditions
                      </h4>
                      {result.possible_conditions.map(
                        (condition: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 bg-gradient-to-r from-healthcare-50 to-blue-50 border border-healthcare-200 rounded-lg"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {condition.condition}
                              </span>
                              <span className="text-healthcare-600 font-bold">
                                {condition.confidence}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              Severity: {condition.severity}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {/* Urgency */}
                {result.urgency && (
                  <div
                    className={`p-3 rounded-lg border ${
                      result.urgency === 'emergency'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : result.urgency === 'urgent'
                          ? 'bg-orange-50 border-orange-200 text-orange-700'
                          : 'bg-green-50 border-green-200 text-green-700'
                    }`}
                  >
                    <strong>Urgency Level:</strong> {result.urgency.toUpperCase()}
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-700 mb-2">
                      ✅ Recommendations
                    </h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      {result.recommendations.map(
                        (rec: string, idx: number) => (
                          <li key={idx}>• {rec}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Findings */}
                {result.findings && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Clinical Findings:</strong> {result.findings}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!imageSource && !result && (
          <div className="mt-12 card text-center bg-blue-50 border-l-4 border-healthcare-600">
            <p className="text-gray-600 text-lg mb-4">
              Upload a skin image to get started with AI analysis
            </p>
            <p className="text-sm text-gray-500">
              ⚠️ Note: This analysis uses OpenAI Vision API. Make sure your
              OPENAI_API_KEY environment variable is set.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
