'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, Clock, Cpu, ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SubmitResponse } from '@/types'

interface SubmissionPanelProps {
  isOpen: boolean
  onClose: () => void
  submissionResults: SubmitResponse | null
  isSubmitting: boolean
}

export function SubmissionPanel({ isOpen, onClose, submissionResults, isSubmitting }: SubmissionPanelProps) {
  const [expandedTestCases, setExpandedTestCases] = useState<Set<number>>(new Set())

  if (!isOpen) return null

  const toggleTestCase = (index: number) => {
    const newExpanded = new Set(expandedTestCases)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedTestCases(newExpanded)
  }

  const getVerdictStyles = (statusId: number) => {
    switch (statusId) {
      case 3: // Accepted
        return {
          text: 'text-green-500',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: <CheckCircle className="w-6 h-6 text-green-500" />
        }
      case 4: // Wrong Answer
        return {
          text: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: <XCircle className="w-6 h-6 text-yellow-500" />
        }
      case 5: // TLE
      case 7: // MLE
        return {
          text: 'text-orange-500',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          icon: <Clock className="w-6 h-6 text-orange-500" />
        }
      case 6: // Runtime Error
      case 11: // Compilation Error
        return {
          text: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: <XCircle className="w-6 h-6 text-red-500" />
        }
      default:
        return {
          text: 'text-muted-foreground',
          bg: 'bg-muted/10',
          border: 'border-border',
          icon: <Clock className="w-6 h-6 text-muted-foreground" />
        }
    }
  }

  // Loading state
  if (isSubmitting) {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-card border-l border-border shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Running Test Cases...</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Executing your code against all test cases</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few seconds...</p>
          </div>
        </div>
      </div>
    )
  }

  // No results yet
  if (!submissionResults) {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-card border-l border-border shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Submission Results</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No results available</p>
        </div>
      </div>
    )
  }

  const verdictStyles = getVerdictStyles(submissionResults.status.id)
  const passedCount = submissionResults.testResults.filter(t => t.passed).length
  const totalCount = submissionResults.testResults.length

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-card border-l border-border shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${verdictStyles.border} ${verdictStyles.bg}`}>
        <div className="flex items-center gap-3">
          {verdictStyles.icon}
          <h2 className="text-lg font-semibold text-foreground">{submissionResults.status.description}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Execution Stats */}
        <div className="px-4 py-3 border-b border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="text-sm font-medium text-foreground ml-auto">{submissionResults.time}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Memory</span>
              <span className="text-sm font-medium text-foreground ml-auto">{submissionResults.memory}MB</span>
            </div>
          </div>
        </div>

        {/* Test Case Summary */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Test Cases</span>
            <span className={`text-sm font-medium ${passedCount === totalCount ? 'text-green-500' : 'text-yellow-500'}`}>
              {passedCount}/{totalCount} Passed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${passedCount === totalCount ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${(passedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Test Case List */}
        <div className="p-4 space-y-2">
          {submissionResults.testResults.map((testResult, index) => (
            <div 
              key={index}
              className={`border border-border rounded-lg overflow-hidden ${testResult.passed ? 'border-green-500/30' : 'border-red-500/30'}`}
            >
              {/* Test Case Header */}
              <button
                onClick={() => toggleTestCase(index)}
                className="w-full flex items-center gap-3 px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {testResult.passed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium text-foreground">Test Case {index + 1}</span>
                <span className={`text-xs ml-auto ${testResult.passed ? 'text-green-500' : 'text-red-500'}`}>
                  {testResult.passed ? 'Passed' : 'Failed'}
                </span>
                {expandedTestCases.has(index) ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Expanded Test Case Details */}
              {expandedTestCases.has(index) && (
                <div className="px-3 py-3 space-y-3 bg-card">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Input</p>
                    <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                      {testResult.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Expected Output</p>
                    <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                      {testResult.expectedOutput}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Actual Output</p>
                    <pre className={`text-xs font-mono p-2 rounded overflow-x-auto ${testResult.passed ? 'bg-muted' : 'bg-red-500/10'}`}>
                      {testResult.actualOutput}
                    </pre>
                  </div>
                  {!testResult.passed && testResult.status.id === 6 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Error</p>
                      <pre className="text-xs font-mono bg-red-500/10 text-red-400 p-2 rounded overflow-x-auto">
                        {testResult.status.description}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-card" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
