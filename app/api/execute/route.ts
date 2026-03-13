import { NextRequest, NextResponse } from 'next/server'
import { executeCode, LANGUAGE_IDS, STATUS_DESCRIPTIONS } from '@/lib/judge0'
import type { ExecuteRequest, ExecuteResponse, Language } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<ExecuteResponse | { error: string }>> {
  try {
    const body = await request.json() as ExecuteRequest

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

    const language = body.language.toLowerCase() as Language

    // Check if language is supported
    if (!LANGUAGE_IDS[language]) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_IDS).join(', ')}` },
        { status: 400 }
      )
    }

    // Execute the code
    const result = await executeCode({
      source: body.source,
      language,
      stdin: body.stdin,
    })

    // Map to response format
    const response: ExecuteResponse = {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      status: {
        id: result.status.id,
        description: result.status.description || STATUS_DESCRIPTIONS[result.status.id] || 'Unknown',
      },
      time: result.time,
      memory: result.memory,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Execute error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { error: `Execution failed: ${message}` },
      { status: 500 }
    )
  }
}
