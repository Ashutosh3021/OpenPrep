'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type RecencyOption = 'all' | '30d' | '3mo' | '6mo' | '6mo+'

interface RecencyFilterProps {
  value: RecencyOption
  onChange: (value: RecencyOption) => void
}

const recencyOptions: { value: RecencyOption; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: '30d', label: 'Past Month' },
  { value: '3mo', label: 'Past 3 Months' },
  { value: '6mo', label: 'Past 6 Months' },
  { value: '6mo+', label: '6 Months+' },
]

export function RecencyFilter({ value, onChange }: RecencyFilterProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as RecencyOption)}>
      <SelectTrigger className="w-full bg-background border-border">
        <SelectValue placeholder="Filter by recency" />
      </SelectTrigger>
      <SelectContent>
        {recencyOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Helper function to convert recency option to days for Supabase query
export function recencyToDays(option: RecencyOption): number | null {
  switch (option) {
    case '30d':
      return 30
    case '3mo':
      return 90
    case '6mo':
      return 180
    case '6mo+':
      return null // Handle specially in query
    case 'all':
    default:
      return null
  }
}
