import { supabase } from '@/lib/supabase'
import type { ProblemWithRelations, FetchProblemsOptions, Company, TestCase } from '@/types'

interface ProblemRow {
  id: number
  title: string
  slug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  acceptance: number
  submissions: number
  solved: boolean
  likes: number
  description: string
  constraints: string[]
  company_ids: number[]
  tags: string[]
  frequency: number
  last_asked: string | null
  test_cases: TestCase[]
  companies: Array<{ company: Company }>
}

export async function fetchProblems(
  options: FetchProblemsOptions = {}
): Promise<ProblemWithRelations[]> {
  const {
    difficulty,
    searchQuery,
    tags,
    companyIds,
    recency,
    limit = 50,
    offset = 0,
  } = options

  let query = supabase
    .from('problems')
    .select(`
      *,
      companies:problem_companies(
        company:companies(
          id,
          name,
          logo,
          slug
        )
      ),
      test_cases(*)
    `)
    .range(offset, offset + limit - 1)

  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`)
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  if (companyIds && companyIds.length > 0) {
    query = query.overlaps('company_ids', companyIds)
  }

  if (recency) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - recency)
    query = query.gte('last_asked', cutoffDate.toISOString())
  }

  query = query.order('frequency', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching problems:', error)
    throw new Error(`Failed to fetch problems: ${error.message}`)
  }

  // Transform the data to flatten companies
  return (data as unknown as ProblemRow[] || []).map((problem) => ({
    ...problem,
    companies: problem.companies?.map((c) => c.company) || [],
  }))
}

export async function fetchProblemById(id: number): Promise<ProblemWithRelations | null> {
  const { data, error } = await supabase
    .from('problems')
    .select(`
      *,
      companies:problem_companies(
        company:companies(
          id,
          name,
          logo,
          slug
        )
      ),
      test_cases(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching problem:', error)
    throw new Error(`Failed to fetch problem: ${error.message}`)
  }

  const problem = data as unknown as ProblemRow
  return {
    ...problem,
    companies: problem.companies?.map((c) => c.company) || [],
  }
}
