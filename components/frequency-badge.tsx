'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

interface FrequencyBadgeProps {
  frequency: number
  maxFrequency?: number
}

export function FrequencyBadge({ frequency, maxFrequency = 100 }: FrequencyBadgeProps) {
  const percentage = maxFrequency > 0 ? (frequency / maxFrequency) * 100 : 0

  return (
    <div className="flex items-center gap-2">
      <ProgressPrimitive.Root
        className="relative overflow-hidden bg-secondary rounded-full w-16 h-2"
        value={percentage}
      >
        <ProgressPrimitive.Indicator
          className="bg-accent w-full h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
      <span className="text-xs text-muted-foreground">{frequency}</span>
    </div>
  )
}
