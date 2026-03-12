'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { mockProblems } from '@/lib/mock-data'
import { CodeEditor } from '@/components/code-editor'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { TestCaseList } from '@/components/test-case-list'
import { ThumbsUp, Share2, Flag } from 'lucide-react'

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
  const [selectedLanguage, setSelectedLanguage] = useState('python')
  const [code, setCode] = useState('')

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-muted-foreground">Problem not found</p>
      </div>
    )
  }

  const languages = ['python', 'javascript', 'java', 'cpp', 'golang']

  // Mock test cases for demonstration
  const mockTestCases = [
    { id: '1', input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    { id: '2', input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    { id: '3', input: 'nums = [3,3], target = 6', output: '[0,1]' }
  ]

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

          {/* Submit Button */}
          <div className="border-t border-border bg-card/50 p-4 flex gap-2">
            <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Submit
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-card">
              Run Code
            </Button>
          </div>
        </div>
      </div>
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
