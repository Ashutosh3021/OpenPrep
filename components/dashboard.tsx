'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { mockUserStats, mockUserProfile, mockSubmissions, heatmapData } from '@/lib/mock-data'
import { TrendingUp, Award, Target, Zap } from 'lucide-react'

export function Dashboard() {
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserEmail(userData.email)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">{userEmail}</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
          Edit Profile
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Solved"
          value={mockUserStats.totalSolved}
          sublabel="problems"
          icon={Target}
          color="bg-blue-500/20 text-blue-500"
        />
        <StatCard
          label="Acceptance Rate"
          value={`${mockUserStats.acceptanceRate.toFixed(1)}%`}
          sublabel="of submissions"
          icon={TrendingUp}
          color="bg-green-500/20 text-green-500"
        />
        <StatCard
          label="Current Streak"
          value={mockUserStats.streak}
          sublabel="days"
          icon={Zap}
          color="bg-yellow-500/20 text-yellow-500"
        />
        <StatCard
          label="Longest Streak"
          value={mockUserStats.longestStreak}
          sublabel="days"
          icon={Award}
          color="bg-purple-500/20 text-purple-500"
        />
      </div>

      {/* Difficulty Stats */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Problem Solving Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DifficultyProgressCard
            difficulty="Easy"
            solved={mockUserStats.easySolved}
            color="bg-green-500/20 border-green-500/30 text-green-500"
          />
          <DifficultyProgressCard
            difficulty="Medium"
            solved={mockUserStats.mediumSolved}
            color="bg-yellow-500/20 border-yellow-500/30 text-yellow-500"
          />
          <DifficultyProgressCard
            difficulty="Hard"
            solved={mockUserStats.hardSolved}
            color="bg-red-500/20 border-red-500/30 text-red-500"
          />
        </div>
      </div>

      {/* Activity Heatmap */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Contribution Activity</h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <ActivityHeatmap />
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Submissions</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Problem</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Language</th>
                  <th className="hidden md:table-cell px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Runtime</th>
                </tr>
              </thead>
              <tbody>
                {mockSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-border hover:bg-card/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/problems/${submission.problemId}`} className="text-accent hover:underline font-medium">
                        Problem #{submission.problemId}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-sm text-muted-foreground">
                      {submission.language}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-right text-sm text-muted-foreground">
                      {submission.runtime}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AchievementBadge
            title="First Steps"
            description="Solve your first problem"
            unlocked
          />
          <AchievementBadge
            title="Century Club"
            description="Solve 100 problems"
            unlocked
          />
          <AchievementBadge
            title="Consistent"
            description="Maintain a 7-day streak"
            unlocked
          />
          <AchievementBadge
            title="Master"
            description="Solve 500 problems"
            unlocked={false}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  sublabel: string
  icon: React.ComponentType<{ className: string }>
  color: string
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
      </div>
    </div>
  )
}

function DifficultyProgressCard({
  difficulty,
  solved,
  color,
}: {
  difficulty: string
  solved: number
  color: string
}) {
  const total = difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 150 : 75
  const percentage = (solved / total) * 100

  return (
    <div className={`${color} border rounded-lg p-4 space-y-3`}>
      <p className="font-semibold">{difficulty}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{solved} solved</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-current transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function ActivityHeatmap() {
  const today = new Date()
  const startDate = new Date(today.getFullYear(), 0, 1)
  const weeks = []
  let week = []

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const day = date.getDay()

    const activity = heatmapData.find(d => 
      d.date.toDateString() === date.toDateString()
    )
    const count = activity?.count || 0

    week.push({ date, count })

    if (day === 6 || i === 364) {
      weeks.push(week)
      week = []
    }
  }

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted/30'
    if (count === 1) return 'bg-green-500/30'
    if (count === 2) return 'bg-green-500/50'
    if (count === 3) return 'bg-green-500/70'
    return 'bg-green-500'
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.slice(-26).map((week, weekIdx) => (
          <div key={`week-${weekIdx}`} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <div
                key={`${day.date.toISOString()}`}
                className={`w-3 h-3 rounded-sm ${getColor(day.count)} cursor-pointer hover:ring-2 hover:ring-foreground transition-all`}
                title={`${day.date.toDateString()}: ${day.count} submissions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={`legend-${i}`}
              className={`w-3 h-3 rounded-sm ${getColor(i)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    Accepted: 'bg-green-500/20 text-green-500 border-green-500/30',
    'Wrong Answer': 'bg-red-500/20 text-red-500 border-red-500/30',
    'Time Limit Exceeded': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    'Runtime Error': 'bg-red-600/20 text-red-600 border-red-600/30',
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  )
}

function AchievementBadge({
  title,
  description,
  unlocked,
}: {
  title: string
  description: string
  unlocked: boolean
}) {
  return (
    <div className={`p-4 rounded-lg border ${
      unlocked
        ? 'bg-accent/20 border-accent/30'
        : 'bg-muted/20 border-muted/30'
    }`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
        unlocked ? 'bg-accent/30' : 'bg-muted/30'
      }`}>
        <Award className={`w-6 h-6 ${unlocked ? 'text-accent' : 'text-muted-foreground'}`} />
      </div>
      <p className={`font-semibold text-sm ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
        {title}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
