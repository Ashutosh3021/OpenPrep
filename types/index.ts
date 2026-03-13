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

// Code execution types for Judge0 integration

export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'golang'

export interface ExecuteRequest {
  source: string
  language: Language
  stdin?: string
}

export interface ExecuteResponse {
  stdout: string
  stderr: string
  status: {
    id: number
    description: string
  }
  time: string
  memory: number
}

export interface TestCaseInput {
  input: string
  expectedOutput: string
}

export interface SubmitRequest {
  source: string
  language: Language
  problemId: number
  testCases: TestCaseInput[]
}

export interface TestResult {
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  status: {
    id: number
    description: string
  }
  time: string
  memory: number
}

export interface SubmitResponse {
  status: {
    id: number
    description: string
  }
  time: string
  memory: number
  testResults: TestResult[]
}
