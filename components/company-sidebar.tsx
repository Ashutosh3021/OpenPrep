'use client'

import { useState, useMemo } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search, Check } from 'lucide-react'
import type { Company } from '@/types'
import { RecencyFilter, type RecencyOption } from './recency-filter'

interface CompanySidebarProps {
  companies: Company[]
  selectedCompanies: number[]
  onSelectionChange: (companyIds: number[]) => void
  recency: RecencyOption
  onRecencyChange: (recency: RecencyOption) => void
}

const MAX_INITIAL_COMPANIES = 20

export function CompanySidebar({
  companies,
  selectedCompanies,
  onSelectionChange,
  recency,
  onRecencyChange,
}: CompanySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter companies by search query
  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return companies
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [companies, searchQuery])

  // Show top N companies initially
  const displayedCompanies = filteredCompanies.slice(0, MAX_INITIAL_COMPANIES)

  const handleCompanyToggle = (companyId: number) => {
    if (selectedCompanies.includes(companyId)) {
      onSelectionChange(selectedCompanies.filter((id) => id !== companyId))
    } else {
      onSelectionChange([...selectedCompanies, companyId])
    }
  }

  return (
    <div className="w-72 border-r border-border h-[calc(100vh-64px)] flex flex-col bg-card">
      {/* Recency Filter */}
      <div className="p-4 border-b border-border">
        <RecencyFilter value={recency} onChange={onRecencyChange} />
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      {/* Company List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {displayedCompanies.length > 0 ? (
            displayedCompanies.map((company) => (
              <CompanyRow
                key={company.id}
                company={company}
                isSelected={selectedCompanies.includes(company.id)}
                onToggle={() => handleCompanyToggle(company.id)}
              />
            ))
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No companies found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface CompanyRowProps {
  company: Company
  isSelected: boolean
  onToggle: () => void
}

function CompanyRow({ company, isSelected, onToggle }: CompanyRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-background/50 transition-colors text-left"
    >
      <Checkbox.Root
        checked={isSelected}
        onCheckedChange={onToggle}
        className="w-5 h-5 rounded border border-muted-foreground/30 flex items-center justify-center data-[state=checked]:bg-accent data-[state=checked]:border-accent"
      >
        <Checkbox.Indicator>
          <Check className="w-3 h-3 text-accent-foreground" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {company.logo ? (
        <img
          src={company.logo}
          alt={company.name}
          className="w-6 h-6 rounded object-cover"
        />
      ) : (
        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
          {company.name.charAt(0)}
        </div>
      )}
      <span className="text-sm truncate flex-1">{company.name}</span>
    </button>
  )
}
