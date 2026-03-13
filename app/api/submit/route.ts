import { NextRequest, NextResponse } from 'next/server'
import { submitCode, LANGUAGE_IDS, STATUS_DESCRIPTIONS } from '@/lib/judge0'
import type { SubmitRequest, SubmitResponse, Language } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<SubmitResponse | { error: string }>> {
  try {
    const body = await request.json() as SubmitRequest

    // Validate request
    if (!body.source || typeof body.source !== 'string') {
      return NextResponse.json(
        { error: 'Source code is required' },
        { status: 400 }
      )
    }

    if (!body.language || typeof body.language !== 'string') {
      return NextResponse.json(
        { error: 'Language is required' },
        { status: 400 }
      )
    }

    if (!body.testCases || !Array.isArray(body.testCases) || body.testCases.length === 0) {
      return NextResponse.json(
        { error: 'Test cases are required' },
        { status: 400 }
      )
    }

    const language = body.language.toLowerCase() as Language

    // Check if language is supported
    if (!LANGUAGE_IDS[language]) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_IDS).join(', ')}` },
        { status: 400 }
      )
    }

    // Submit the code against test cases
    const result = await submitCode({
      source: body.source,
      language,
      testCases: body.testCases,
    })

    // Map to response format
    const response: SubmitResponse = {
      status: result.status,
      time: result.time,
      memory: result.memory,
      testResults: result.testResults.map((tr) => ({
        passed: tr.passed,
        input: tr.input,
        expectedOutput: tr.expectedOutput,
        actualOutput: tr.actualOutput,
        status: tr.status,
        time: tr.time,
        memory: tr.memory,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Submit error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { error: `Submission failed: ${message}` },
      { status: 500 }
    )
  }
}
