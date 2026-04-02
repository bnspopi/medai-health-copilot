'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { getDiagnoses } from '@/lib/supabase'
import { generateHealthTrends } from '@/lib/openai'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function HealthTrends() {
  const { user } = useAuth()
  const [diagnoses, setDiagnoses] = useState<any[]>([])
  const [trends, setTrends] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchTrends = async () => {
      try {
        const { data } = await getDiagnoses(user.id)
        setDiagnoses(data || [])

        if (data && data.length > 0) {
          const trendData = await generateHealthTrends(data)
          setTrends(trendData)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load trends')
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [user])

  // Calculate statistics
  const calculateStats = () => {
    const conditionCounts: { [key: string]: number } = {}
    const monthCounts: { [key: string]: number } = {}
    const severityCounts: { [key: string]: number } = {
      mild: 0,
      moderate: 0,
      severe: 0,
    }

    diagnoses.forEach((diagnosis) => {
      const month = new Date(diagnosis.created_at).toLocaleString('default', {
        month: 'short',
      })
      monthCounts[month] = (monthCounts[month] || 0) + 1

      diagnosis.diagnosis_data?.differential_diagnosis?.forEach(
        (item: any) => {
          conditionCounts[item.condition] =
            (conditionCounts[item.condition] || 0) + 1
          const severity = item.severity?.toLowerCase() || 'moderate'
          if (severity in severityCounts) {
            severityCounts[severity]++
          }
        }
      )
    })

    return { conditionCounts, monthCounts, severityCounts }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-healthcare-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
          <p className="mt-4 text-healthcare-600">Loading trends...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-healthcare-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full card border-l-4 border-red-600">
          <div className="flex gap-3">
            <div className="text-red-600">⚠️</div>
            <div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
              <p className="text-gray-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = calculateStats()
  const conditionData = Object.entries(stats.conditionCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 10)

  const monthData = Object.entries(stats.monthCounts).map(([month, count]) => ({
    month,
    count,
  }))

  const severityData = Object.entries(stats.severityCounts).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })
  )

  const accuracyData = (trends?.diagnostic_accuracy_trend || []).map(
    (value: any, idx: number) => ({
      period: `T${idx + 1}`,
      accuracy: Number(value) || 0,
    })
  )

  const averageAccuracy =
    accuracyData.length > 0
      ? Number(
          accuracyData.reduce((sum: number, cur: any) => sum + cur.accuracy, 0) /
            accuracyData.length
        ).toFixed(1)
      : null

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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          📊 Health Trends & Analytics
        </h1>
        <p className="text-gray-600 mb-8">
          Analyze your disease patterns, trends, and diagnostic history
        </p>

        {diagnoses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No diagnoses yet. Start by analyzing your symptoms to see trends!
            </p>
            <Link href="/analysis" className="btn-primary">
              Go to Symptom Analysis
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-gray-600 text-sm">Total Diagnoses</p>
                <p className="text-4xl font-bold text-healthcare-600">
                  {diagnoses.length}
                </p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm">Unique Conditions</p>
                <p className="text-4xl font-bold text-blue-600">
                  {Object.keys(stats.conditionCounts).length}
                </p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm">Mild Cases</p>
                <p className="text-4xl font-bold text-green-600">
                  {stats.severityCounts.mild}
                </p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm">Severe Cases</p>
                <p className="text-4xl font-bold text-red-600">
                  {stats.severityCounts.severe}
                </p>
              </div>
            </div>

            {/* Monthly Analysis Volume */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                📅 Monthly Analysis Volume
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" name="Number of Analyses" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {accuracyData.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    📈 Diagnostic Accuracy Trend
                  </h2>
                  {averageAccuracy && (
                    <span className="text-sm text-gray-500">
                      Average: {averageAccuracy}%
                    </span>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Most Diagnosed Conditions */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  🏥 Most Diagnosed Conditions
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={conditionData}
                    layout="vertical"
                    margin={{ left: 150 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Severity Distribution */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  ⚠️ Severity Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={['#22c55e', '#eab308', '#ef4444'][index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Conditions Table */}
            {conditionData.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  📋 Top Diagnosed Conditions
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left font-bold">
                          Condition
                        </th>
                        <th className="px-4 py-3 text-left font-bold">
                          Count
                        </th>
                        <th className="px-4 py-3 text-left font-bold">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {conditionData.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-healthcare-50">
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">
                            <span className="bg-healthcare-100 text-healthcare-700 px-3 py-1 rounded-full text-sm font-bold">
                              {item.value}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {(
                              ((item.value as number) / diagnoses.length) *
                              100
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Insights from AI */}
            {trends && trends.seasonal_patterns && (
              <div className="card bg-blue-50 border-l-4 border-healthcare-600">
                <h2 className="text-2xl font-bold text-healthcare-600 mb-4">
                  💡 AI Insights
                </h2>
                <p className="text-gray-700">{trends.seasonal_patterns}</p>
                {trends.recommendations && trends.recommendations.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="font-bold text-healthcare-600">
                      Recommendations:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {trends.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
