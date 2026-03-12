export interface Problem {
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
  test_cases: TestCase[]
  company_ids: number[]
  tags: string[]
  frequency: number
  last_asked: string | null
}

export interface TestCase {
  id: string
  input: string
  output: string
  explanation?: string
}

export interface Company {
  id: number
  name: string
  logo: string | null
  slug: string
}

export interface ProblemCompany {
  problem_id: number
  company_id: number
}

export interface ProblemWithRelations extends Problem {
  companies: Company[]
  test_cases: TestCase[]
}

export interface FetchProblemsOptions {
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  searchQuery?: string
  tags?: string[]
  companyIds?: number[]
  recency?: number // days
  limit?: number
  offset?: number
}
