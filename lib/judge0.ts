// Judge0 API client for code execution
// Documentation: https://judge0.com/

export type LanguageId = 71 | 63 | 62 | 54 | 60 // python, javascript, java, cpp, go
export type StatusId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14

// Language name to Judge0 ID mapping
export const LANGUAGE_IDS: Record<string, LanguageId> = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  golang: 60,
}

// Status code to description mapping
export const STATUS_DESCRIPTIONS: Record<StatusId, string> = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Runtime Error',
  7: 'Memory Limit Exceeded',
  8: 'Output Limit Exceeded',
  9: 'Compilation Error',
  10: 'Internal Error',
  11: 'Submitting',
  12: 'Submitted',
  13: 'Compiling',
  14: 'Running',
}

export interface Judge0Submission {
  id: number
  language_id: LanguageId
  source: string
  stdin?: string
  expected_output?: string
  stdout?: string
  stderr?: string
  status: {
    id: StatusId
    description: string
  }
  time: string
  memory: number
  created_at: string
  finished_at: string
}

export interface ExecuteOptions {
  source: string
  language: string
  stdin?: string
  expectedOutput?: string
  wait?: boolean // true for sync execution, false for async (returns token)
}

export interface SubmitOptions {
  source: string
  language: string
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

/**
 * Get the Judge0 API base URL
 */
function getApiUrl(): string {
  return process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
}

/**
 * Get the Judge0 API key if using RapidAPI
 */
function getApiKey(): string | undefined {
  return process.env.JUDGE0_API_KEY
}

/**
 * Get the Judge0 API host header
 */
function getApiHost(): string | undefined {
  return process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com'
}

/**
 * Execute code synchronously (waits for result)
 * POST /submissions?wait=true
 */
export async function executeCode(options: ExecuteOptions): Promise<Judge0Submission> {
  const { source, language, stdin, expectedOutput, wait = true } = options

  const languageId = LANGUAGE_IDS[language.toLowerCase()]
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_IDS).join(', ')}`)
  }

  const baseUrl = getApiUrl()
  const apiKey = getApiKey()
  const apiHost = getApiHost()

  // Build query params
  const params = new URLSearchParams({
    base64_encoded: 'false',
    wait: String(wait),
    fields: '*',
  })

  // Build request body
  const body: Record<string, unknown> = {
    language_id: languageId,
    source_code: source,
  }

  if (stdin) {
    body.stdin = stdin
  }

  if (expectedOutput) {
    body.expected_output = expectedOutput
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey
  }

  if (apiHost) {
    headers['X-RapidAPI-Host'] = apiHost
  }

  const url = `${baseUrl}/submissions?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Judge0 API error (${response.status}): ${errorText}`)
    }

    const result = await response.json() as Judge0Submission
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to execute code: ${error.message}`)
    }
    throw new Error('Failed to execute code: Unknown error')
  }
}

/**
 * Submit code against multiple test cases
 * Executes each test case sequentially and aggregates results
 */
export async function submitCode(options: SubmitOptions): Promise<{
  status: { id: StatusId; description: string }
  time: string
  memory: number
  testResults: Array<{
    passed: boolean
    input: string
    expectedOutput: string
    actualOutput: string
    status: { id: StatusId; description: string }
    time: string
    memory: number
  }>
}> {
  const { source, language, testCases } = options

  const testResults: Array<{
    passed: boolean
    input: string
    expectedOutput: string
    actualOutput: string
    status: { id: StatusId; description: string }
    time: string
    memory: number
  }> = []

  let overallStatusId: StatusId = 3 // Default to Accepted
  let maxTime = '0.0'
  let maxMemory = 0

  // Execute each test case
  for (const testCase of testCases) {
    try {
      const result = await executeCode({
        source,
        language,
        stdin: testCase.input,
        expectedOutput: testCase.expectedOutput,
      })

      const passed = result.status.id === 3 // Accepted

      testResults.push({
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.stdout || '',
        status: {
          id: result.status.id,
          description: result.status.description || STATUS_DESCRIPTIONS[result.status.id] || 'Unknown',
        },
        time: result.time,
        memory: result.memory,
      })

      // Track worst-case status
      if (!passed && overallStatusId === 3) {
        overallStatusId = result.status.id === 5 ? 5 : 4 // TLE or Wrong Answer
      }

      // Track max time and memory
      const timeNum = parseFloat(result.time)
      if (!isNaN(timeNum) && timeNum > parseFloat(maxTime)) {
        maxTime = result.time
      }
      if (result.memory > maxMemory) {
        maxMemory = result.memory
      }
    } catch (error) {
      // If execution fails, mark as failed test case
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      testResults.push({
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        status: {
          id: 6, // Runtime Error
          description: errorMessage,
        },
        time: '0.0',
        memory: 0,
      })

      if (overallStatusId === 3) {
        overallStatusId = 6 // Runtime Error
      }
    }
  }

  return {
    status: {
      id: overallStatusId,
      description: STATUS_DESCRIPTIONS[overallStatusId] || 'Unknown',
    },
    time: maxTime,
    memory: maxMemory,
    testResults,
  }
}

/**
 * Poll for submission result (for async submissions)
 * GET /submissions/{token}
 */
export async function getSubmission(token: string): Promise<Judge0Submission> {
  const baseUrl = getApiUrl()
  const apiKey = getApiKey()
  const apiHost = getApiHost()

  const params = new URLSearchParams({
    base64_encoded: 'false',
    fields: '*',
  })

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey
  }

  if (apiHost) {
    headers['X-RapidAPI-Host'] = apiHost
  }

  const url = `${baseUrl}/submissions/${token}?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Judge0 API error (${response.status}): ${errorText}`)
    }

    const result = await response.json() as Judge0Submission
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get submission: ${error.message}`)
    }
    throw new Error('Failed to get submission: Unknown error')
  }
}
