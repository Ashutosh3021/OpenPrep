'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/navbar'
import { CompanySidebar } from '@/components/company-sidebar'
import { ProblemList } from '@/components/problem-list'
import { fetchCompanies } from '@/lib/supabase/companies'
import { fetchProblems } from '@/lib/supabase/problems'
import { mockProblems, type Problem } from '@/lib/mock-data'
import type { Company, FetchProblemsOptions } from '@/types'
import type { RecencyOption } from '@/components/recency-filter'

export default function ProblemsPage() {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [difficulty, setDifficulty] = useState<string>('All')
  const [category, setCategory] = useState<string>('All')
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([])
  const [recency, setRecency] = useState<RecencyOption>('all')

  // Data
  const [companies, setCompanies] = useState<Company[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch companies on mount
  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await fetchCompanies()
        setCompanies(data)
      } catch (error) {
        console.error('Error loading companies:', error)
        // Fallback: use empty array, will use mock data
        setCompanies([])
      }
    }
    loadCompanies()
  }, [])

  // Fetch problems when filters change
  useEffect(() => {
    async function loadProblems() {
      setIsLoading(true)
      try {
        // Build query options
        const options: FetchProblemsOptions = {}

        if (difficulty && difficulty !== 'All') {
          options.difficulty = difficulty as 'Easy' | 'Medium' | 'Hard'
        }

        if (searchQuery) {
          options.searchQuery = searchQuery
        }

        if (selectedCompanies.length > 0) {
          options.companyIds = selectedCompanies
        }

        // Convert recency to days
        if (recency && recency !== 'all') {
          switch (recency) {
            case '30d':
              options.recency = 30
              break
            case '3mo':
              options.recency = 90
              break
            case '6mo':
              options.recency = 180
              break
            case '6mo+':
              // For 6mo+, we need special handling - get problems from last 6mo+ (older than 6mo)
              options.recency = 180
              break
          }
        }

        const data = await fetchProblems(options)
        setProblems(data)
      } catch (error) {
        console.error('Error loading problems:', error)
        // Fallback to mock data with client-side filtering
        const filtered = mockProblems.filter((problem) => {
          const matchesSearch = !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesDifficulty = !difficulty || difficulty === 'All' || problem.difficulty === difficulty
          const matchesCategory = !category || category === 'All' || problem.category === category
          return matchesSearch && matchesDifficulty && matchesCategory
        })
        setProblems(filtered)
      } finally {
        setIsLoading(false)
      }
    }

    loadProblems()
  }, [searchQuery, difficulty, category, selectedCompanies, recency])

  // Callbacks for filter changes
  const handleSelectionChange = useCallback((companyIds: number[]) => {
    setSelectedCompanies(companyIds)
  }, [])

  const handleRecencyChange = useCallback((newRecency: RecencyOption) => {
    setRecency(newRecency)
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleDifficultyChange = useCallback((diff: string) => {
    setDifficulty(diff)
  }, [])

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat)
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Company Sidebar */}
          <CompanySidebar
            companies={companies}
            selectedCompanies={selectedCompanies}
            onSelectionChange={handleSelectionChange}
            recency={recency}
            onRecencyChange={handleRecencyChange}
          />

          {/* Problem List */}
          <div className="flex-1 overflow-auto">
            <ProblemList
              problems={problems}
              isLoading={isLoading}
              filters={{
                searchQuery,
                difficulty,
                category,
              }}
              onSearchChange={handleSearchChange}
              onDifficultyChange={handleDifficultyChange}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </main>
    </>
  )
}
