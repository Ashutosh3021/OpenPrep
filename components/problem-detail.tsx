'use client'

import { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { mockProblems } from '@/lib/mock-data'
import { CodeEditor } from '@/components/code-editor'
import { CodeOutput } from '@/components/code-output'
import { SubmissionPanel } from '@/components/submission-panel'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { TestCaseList } from '@/components/test-case-list'
import { ThumbsUp, Share2, Flag, Play, Loader2 } from 'lucide-react'
import type { Language, ExecuteResponse, SubmitResponse } from '@/types'

interface ProblemDetailProps {
  problemId: number
}

// Mock markdown description for problems
const mockDescription = `
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to the target.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Example 1:

\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

## Example 2:

\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Constraints:

- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.
`

export function ProblemDetail({ problemId }: ProblemDetailProps) {
  const problem = mockProblems.find(p => p.id === problemId)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python')
  const [code, setCode] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [output, setOutput] = useState<ExecuteResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  
  // Submission state
  const [submissionResults, setSubmissionResults] = useState<SubmitResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmissionPanel, setShowSubmissionPanel] = useState(false)

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-muted-foreground">Problem not found</p>
      </div>
    )
  }

  const languages: Language[] = ['python', 'javascript', 'java', 'cpp', 'golang']

  // Mock test cases for demonstration
  const mockTestCases = [
    { id: '1', input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    { id: '2', input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    { id: '3', input: 'nums = [3,3], target = 6', output: '[0,1]' }
  ]

  // Handle Run Code button click
  const handleRunCode = async () => {
    if (!code.trim()) {
      return
    }

    setIsRunning(true)
    setOutput(null)

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: code,
          language: selectedLanguage,
          stdin: customInput,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to execute code')
      }

      const data: ExecuteResponse = await response.json()
      setOutput(data)
    } catch (error) {
      console.error('Error running code:', error)
      setOutput({
        stdout: '',
        stderr: 'Failed to execute code. Please check your input and try again.',
        status: { id: 7, description: 'Runtime Error' },
        time: '0.00',
        memory: 0,
      })
    } finally {
      setIsRunning(false)
    }
  }

  // Handle keyboard shortcut (Ctrl+Enter / Cmd+Enter for Run)
  // Handle keyboard shortcut (Ctrl+Shift+Enter / Cmd+Shift+Enter for Submit)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit: Ctrl+Shift+Enter or Cmd+Shift+Enter
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      handleSubmitCode()
    }
    // Run: Ctrl+Enter or Cmd+Enter
    else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRunCode()
    }
    // Close submission panel on Escape
    if (e.key === 'Escape' && showSubmissionPanel) {
      setShowSubmissionPanel(false)
    }
  }

  // Handle Submit Code button click
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      return
    }

    setIsSubmitting(true)
    setSubmissionResults(null)
    setShowSubmissionPanel(true)

    try {
      // Convert mock test cases to the format expected by the API
      const testCasesForApi = mockTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.output
      }))

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: code,
          language: selectedLanguage,
          problemId: problemId,
          testCases: testCasesForApi,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit code')
      }

      const data: SubmitResponse = await response.json()
      setSubmissionResults(data)
    } catch (error) {
      console.error('Error submitting code:', error)
      setSubmissionResults({
        status: { id: 6, description: 'Runtime Error' },
        time: '0.00',
        memory: 0,
        testResults: [],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle closing submission panel
  const handleCloseSubmissionPanel = useCallback(() => {
    setShowSubmissionPanel(false)
  }, [])

  // Close submission panel on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSubmissionPanel) {
        setShowSubmissionPanel(false)
      }
    }

    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && showSubmissionPanel) {
        setShowSubmissionPanel(false)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [showSubmissionPanel])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/problems" className="text-sm text-accent hover:underline mb-4 inline-block">
            ← Back to Problems
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{problem.title}</h1>
              <div className="flex flex-wrap gap-3">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="text-xs bg-card border border-border px-2 py-1 rounded text-muted-foreground">
                  {problem.category}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="hidden lg:flex lg:flex-col lg:w-1/2 border-r border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Problem Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">Acceptance</p>
                <p className="text-lg font-semibold text-foreground">{problem.acceptance.toFixed(1)}%</p>
              </div>
              <div className="bg-card border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">Submissions</p>
                <p className="text-lg font-semibold text-foreground">{(problem.submissions / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-card border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">Likes</p>
                <p className="text-lg font-semibold text-foreground">{(problem.likes / 1000).toFixed(1)}K</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Description</h2>
              <div className="text-muted-foreground leading-relaxed">
                <MarkdownRenderer content={mockDescription} />
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Examples</h2>
              <TestCaseList testCases={mockTestCases} />
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 lg:w-1/2 flex flex-col overflow-hidden">
          {/* Language Selector */}
          <div className="border-b border-border bg-card/50 px-4 py-3 flex items-center gap-2 overflow-x-auto">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedLanguage === lang
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              language={selectedLanguage}
              code={code}
              onChange={setCode}
            />
          </div>

          {/* Custom Input */}
          <div className="border-t border-border">
            <div className="px-4 py-2 text-xs text-muted-foreground font-medium">
              Custom Input (stdin)
            </div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter custom input for your code..."
              className="w-full h-20 px-4 py-2 bg-card text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Run and Submit Buttons */}
          <div className="border-t border-border bg-card/50 p-4 flex gap-2">
            <Button 
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              onClick={handleSubmitCode}
              disabled={isSubmitting || isRunning || !code.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
            <Button 
              variant="outline" 
              className="border-border text-foreground hover:bg-card"
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting || !code.trim()}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
          </div>

          {/* Output Panel */}
          {(output || isRunning) && (
            <CodeOutput
              stdout={output?.stdout || ''}
              stderr={output?.stderr || ''}
              time={output?.time || '0.00'}
              memory={output?.memory || 0}
              status={output?.status || { id: 3, description: 'Processing' }}
              isLoading={isRunning}
            />
          )}
        </div>
      </div>

      {/* Submission Results Panel */}
      <SubmissionPanel
        isOpen={showSubmissionPanel}
        onClose={handleCloseSubmissionPanel}
        submissionResults={submissionResults}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    Easy: 'bg-green-500/20 text-green-500 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    Hard: 'bg-red-500/20 text-red-500 border-red-500/30',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded border font-medium ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </span>
  )
}
