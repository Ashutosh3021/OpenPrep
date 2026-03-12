'use client'

import { useState } from 'react'
import { Copy, Check, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface TestCase {
  id: string
  input: string
  output: string
  explanation?: string
}

interface TestCaseListProps {
  testCases: TestCase[]
}

export function TestCaseList({ testCases }: TestCaseListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleOutputs, setVisibleOutputs] = useState<Set<string>>(new Set())

  const displayedTestCases = testCases.slice(0, 3)

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleOutput = (id: string) => {
    setVisibleOutputs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      {displayedTestCases.map((testCase, index) => (
        <div
          key={testCase.id}
          className="bg-card border border-border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Example {index + 1}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(testCase.input, testCase.id)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              {copiedId === testCase.id ? (
                <Check className="w-4 h-4 mr-1" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copiedId === testCase.id ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Input:</p>
              <pre className="bg-background p-3 rounded-md font-mono text-sm text-foreground overflow-x-auto">
                {testCase.input}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-muted-foreground">Output:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleOutput(testCase.id)}
                  className="h-6 px-1 text-muted-foreground hover:text-foreground"
                >
                  {visibleOutputs.has(testCase.id) ? (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Show
                    </>
                  )}
                </Button>
              </div>
              {visibleOutputs.has(testCase.id) ? (
                <pre className="bg-background p-3 rounded-md font-mono text-sm text-foreground overflow-x-auto">
                  {testCase.output}
                </pre>
              ) : (
                <div className="bg-background p-3 rounded-md text-sm text-muted-foreground italic">
                  Click "Show" to reveal output
                </div>
              )}
            </div>

            {testCase.explanation && visibleOutputs.has(testCase.id) && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Explanation:</p>
                <p className="text-sm text-muted-foreground">{testCase.explanation}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
