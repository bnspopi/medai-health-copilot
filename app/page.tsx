'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type PathKey = 'startup' | 'corporate' | 'creator'

type QuizState = {
  path: PathKey | null
  risk: 'low' | 'medium' | 'high' | null
  effort: 'balanced' | 'intense' | null
}

const careerDetails: Record<PathKey, {
  title: string
  tagline: string
  success: string
  income: string
  stress: string
  breakthrough: string
  lifeScore: number
  usersToday: number
  timeline: string[]
}> = {
  startup: {
    title: '🚀 Startup Founder',
    tagline: 'High risk. High reward. No safety net.',
    success: '75%',
    income: '₹20–50 LPA',
    stress: 'Very High',
    breakthrough: 'Year 4',
    lifeScore: 82,
    usersToday: 68,
    timeline: [
      'Year 1 → Struggle & learning',
      'Year 2 → First wins',
      'Year 3 → Growth phase',
      'Year 5 → Breakthrough 🚀',
    ],
  },
  corporate: {
    title: '🏢 Corporate Leader',
    tagline: 'Stable growth with structured progression.',
    success: '79%',
    income: '₹18–40 LPA',
    stress: 'Moderate to High',
    breakthrough: 'Year 5',
    lifeScore: 78,
    usersToday: 21,
    timeline: [
      'Year 1 → Build credibility',
      'Year 2 → Promotions begin',
      'Year 3 → Team leadership',
      'Year 5 → Strategic role achieved',
    ],
  },
  creator: {
    title: '🎥 Creator Economy Pro',
    tagline: 'Creative freedom with compounding audience growth.',
    success: '71%',
    income: '₹10–45 LPA',
    stress: 'High but flexible',
    breakthrough: 'Year 3',
    lifeScore: 80,
    usersToday: 11,
    timeline: [
      'Year 1 → Experiment & consistency',
      'Year 2 → Audience trust builds',
      'Year 3 → Monetization takes off',
      'Year 5 → Brand-level opportunities',
    ],
  },
}

export default function HomePage() {
  const [step, setStep] = useState(0)
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [quiz, setQuiz] = useState<QuizState>({ path: null, risk: null, effort: null })

  const result = useMemo(() => {
    if (!quiz.path) return null
    const profile = careerDetails[quiz.path]

    const riskText = quiz.risk === 'high' ? 'You thrive under uncertainty but need strong routines.' : quiz.risk === 'medium' ? 'You can balance ambition and stability effectively.' : 'You value safety, so build optionality before major bets.'
    const effortText = quiz.effort === 'intense' ? 'Sprint mindset can accelerate outcomes if recovery is planned.' : 'Steady consistency will outperform random bursts of effort.'

    return {
      ...profile,
      insight: {
        reality: `${riskText} ${effortText}`,
        risk: quiz.path === 'startup' ? 'Burnout from long cycles and uncertainty.' : quiz.path === 'creator' ? 'Inconsistent output can stall momentum.' : 'Comfort zone can slow your long-term upside.',
        advice: quiz.path === 'startup' ? 'Ship fast, validate weekly, and protect your energy.' : quiz.path === 'creator' ? 'Treat content like a product: publish, learn, refine.' : 'Stack compounding skills and own high-visibility projects.',
      },
    }
  }, [quiz])

  const selectPath = (path: PathKey) => {
    setQuiz((prev) => ({ ...prev, path }))
    setStep(1)
  }

  const selectRisk = (risk: 'low' | 'medium' | 'high') => {
    setQuiz((prev) => ({ ...prev, risk }))
    setStep(2)
  }

  const selectEffort = (effort: 'balanced' | 'intense') => {
    setQuiz((prev) => ({ ...prev, effort }))
    setLoadingInsight(true)
    setTimeout(() => {
      setStep(3)
      setLoadingInsight(false)
    }, 1200)
  }

  const restart = () => {
    setQuiz({ path: null, risk: null, effort: null })
    setStep(0)
    setLoadingInsight(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#111827] text-white p-6">
      <div className="mx-auto max-w-3xl py-8">
        <section className="text-center mb-8 animate-pulse">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Simulate Your Future 🚀
          </h1>
          <p className="mt-2 opacity-70">One decision can change everything.</p>
          <p className="mt-3 text-sm opacity-60">Clickable in under 2 seconds — pick your path now.</p>
        </section>

        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl transition-all duration-300">
          {step === 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Pick your core path</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { key: 'startup', label: '🚀 Startup', sub: 'Build fast, own outcomes' },
                  { key: 'corporate', label: '🏢 Corporate', sub: 'Scale inside big systems' },
                  { key: 'creator', label: '🎥 Creator', sub: 'Build audience-driven income' },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => selectPath(option.key as PathKey)}
                    className="p-4 bg-white/10 rounded-xl cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300 text-left"
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-sm opacity-70">{option.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">How much risk can you handle?</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { key: 'low', label: '🛟 Low risk' },
                  { key: 'medium', label: '⚖️ Medium risk' },
                  { key: 'high', label: '🔥 High risk' },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => selectRisk(option.key as 'low' | 'medium' | 'high')}
                    className="p-4 bg-white/10 rounded-xl hover:scale-105 hover:brightness-110 transition-all duration-300 text-left"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Work style</h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => selectEffort('balanced')}
                  className="p-4 bg-white/10 rounded-xl hover:scale-105 hover:brightness-110 transition-all duration-300 text-left"
                >
                  🧭 Balanced consistency
                </button>
                <button
                  onClick={() => selectEffort('intense')}
                  className="p-4 bg-white/10 rounded-xl hover:scale-105 hover:brightness-110 transition-all duration-300 text-left"
                >
                  ⚡ Intense sprint mode
                </button>
              </div>
            </div>
          )}

          {loadingInsight && (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-300" />
              <p className="mt-4 text-purple-200">Analyzing your future...</p>
            </div>
          )}

          {step === 3 && result && !loadingInsight && (
            <div className="text-center">
              <h2 className="text-2xl font-bold">{result.title}</h2>
              <p className="mt-2 text-purple-300 italic">{result.tagline}</p>

              <div className="mt-4 space-y-2 text-left">
                <p>📈 Success: {result.success}</p>
                <p>💰 Income: {result.income}</p>
                <p>😵 Stress: {result.stress}</p>
                <p>⏳ Breakthrough: {result.breakthrough}</p>
              </div>

              <p className="text-lg font-bold mt-3">🎯 Life Score: {result.lifeScore}/100</p>
              <p className="mt-4 text-sm opacity-70">🔥 {result.usersToday}% users chose this path today</p>

              <div className="mt-6 bg-white/10 p-4 rounded-xl text-left">
                <h3 className="font-bold">📅 Your Life Timeline</h3>
                <div className="mt-2 space-y-2 text-sm">
                  {result.timeline.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-white/10 p-4 rounded-xl text-left">
                <h3 className="font-bold">🤖 AI Insight</h3>
                <p><b>Reality:</b> {result.insight.reality}</p>
                <p><b>Biggest Risk:</b> {result.insight.risk}</p>
                <p><b>Advice:</b> {result.insight.advice}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={restart}
                  className="px-5 py-2 rounded-xl bg-purple-500/80 hover:scale-105 hover:brightness-110 transition-all duration-300"
                >
                  🌍 Try Alternate Life
                </button>
                <Link
                  href="/auth"
                  className="px-5 py-2 rounded-xl bg-white/20 hover:scale-105 hover:brightness-110 transition-all duration-300"
                >
                  Continue to MedAI
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
