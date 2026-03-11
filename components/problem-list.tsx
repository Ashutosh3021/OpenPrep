'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockProblems, type Problem } from '@/lib/mock-data'
import { Check, Search, ChevronDown } from 'lucide-react'

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard'
type CategoryFilter = string

export function ProblemList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Extract unique categories
  const categories = ['All', ...new Set(mockProblems.map(p => p.category))]

  // Filter problems
  const filteredProblems = useMemo(() => {
    return mockProblems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter
      const matchesCategory = categoryFilter === 'All' || problem.category === categoryFilter
      return matchesSearch && matchesDifficulty && matchesCategory
    })
  }, [searchQuery, difficultyFilter, categoryFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedProblems = filteredProblems.slice(startIdx, startIdx + itemsPerPage)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Daily Challenge Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-lg">
        <h2 className="text-xl font-semibold text-accent mb-2">Daily Challenge</h2>
        <p className="text-muted-foreground mb-4">Two Sum - Arrays & Hashing</p>
        <Link href="/problems/1">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Solve Today's Problem
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 bg-input border-border"
          />
        </div>

        {/* Difficulty and Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <FilterSelect
            label="Difficulty"
            value={difficultyFilter}
            options={['All', 'Easy', 'Medium', 'Hard'] as const}
            onChange={(value) => {
              setDifficultyFilter(value as DifficultyFilter)
              setCurrentPage(1)
            }}
          />
          <FilterSelect
            label="Category"
            value={categoryFilter}
            options={categories}
            onChange={(value) => {
              setCategoryFilter(value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredProblems.length} problems
      </div>

      {/* Problems Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category</th>
                <th className="hidden sm:table-cell px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => (
                  <ProblemRow key={problem.id} problem={problem} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No problems found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="border-border text-foreground hover:bg-card"
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="border-border text-foreground hover:bg-card"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

function ProblemRow({ problem }: { problem: Problem }) {
  const difficultyColors = {
    Easy: 'text-green-500 bg-green-500/10',
    Medium: 'text-yellow-500 bg-yellow-500/10',
    Hard: 'text-red-500 bg-red-500/10',
  }

  return (
    <tr className="border-b border-border hover:bg-card/50 transition-colors">
      <td className="px-4 py-3">
        {problem.solved ? (
          <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-green-500" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded border border-muted-foreground/30"></div>
        )}
      </td>
      <td className="px-4 py-3">
        <Link href={`/problems/${problem.id}`} className="font-medium text-accent hover:underline">
          {problem.title}
        </Link>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{problem.category}</td>
      <td className="hidden sm:table-cell px-4 py-3 text-right text-sm text-muted-foreground">
        {problem.acceptance.toFixed(1)}%
      </td>
    </tr>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border text-sm text-foreground hover:bg-card/80 transition-colors"
      >
        {label}: {value}
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div 
          role="listbox" 
          className="absolute top-full mt-2 left-0 w-full bg-card border border-border rounded-md shadow-lg z-10"
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option}
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onChange(option)
                  setIsOpen(false)
                }
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-card/80 transition-colors ${
                value === option ? 'text-accent font-medium' : 'text-muted-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
