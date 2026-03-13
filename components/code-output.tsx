'use client'

import { Play, CheckCircle, XCircle, Clock, Cpu } from 'lucide-react'
import type { ExecuteResponse } from '@/types'

interface CodeOutputProps {
  stdout: string
  stderr: string
  time: string
  memory: number
  status: {
    id: number
    description: string
  }
  isLoading: boolean
}

export function CodeOutput({
  stdout,
  stderr,
  time,
  memory,
  status,
  isLoading,
}: CodeOutputProps) {
  // Status: 2 = In Queue, 3 = Processing, 4 = Accepted, 5 = Wrong Answer, 6 = Time Limit Exceeded, 7 = Runtime Error
  const isAccepted = status.id === 4
  const isError = status.id >= 5 || status.id === 6 || status.id === 7 || stderr

  if (isLoading) {
    return (
      <div className="border-t border-border bg-card/50">
        <div className="px-4 py-3 flex items-center gap-2 border-b border-border">
          <Play className="w-4 h-4 animate-spin text-accent" />
          <span className="text-sm text-muted-foreground">Running...</span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Executing your code...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-border bg-card/50">
      {/* Header with status icon */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-border">
        {isAccepted ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : isError ? (
          <XCircle className="w-4 h-4 text-red-500" />
        ) : (
          <Play className="w-4 h-4 text-muted-foreground" />
        )}
        <span className={`text-sm font-medium ${isAccepted ? 'text-green-500' : isError ? 'text-red-500' : 'text-muted-foreground'}`}>
          {status.description}
        </span>
      </div>

      {/* Output area */}
      <div className="max-h-[200px] overflow-y-auto">
        {(stdout || stderr) && (
          <div className="p-4">
            {/* Stdout */}
            {stdout && (
              <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all bg-slate-900/50 p-3 rounded">
                {stdout}
              </pre>
            )}

            {/* Stderr */}
            {stderr && (
              <pre className="font-mono text-sm text-red-400 whitespace-pre-wrap break-all mt-2 bg-red-950/30 p-3 rounded border border-red-900/30">
                {stderr}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Footer with execution info */}
      {(time || memory) && (
        <div className="px-4 py-2 flex items-center gap-4 border-t border-border text-xs text-muted-foreground">
          {time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
          )}
          {memory && (
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>{memory} KB</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
