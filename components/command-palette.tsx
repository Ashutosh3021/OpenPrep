'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { mockProblems } from '@/lib/mock-data'
import { Search } from 'lucide-react'

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-items]]:px-2 [&_[cmdk-group-items]_[cmdk-item]]:py-2 [&_[cmdk-input]]:text-foreground">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Search problems, categories, help..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Problems Section */}
            <Command.Group heading="Problems" className="overflow-hidden p-1.5 text-foreground">
              {mockProblems.slice(0, 5).map((problem) => (
                <Command.Item
                  key={problem.id}
                  value={problem.title}
                  onSelect={() => {
                    router.push(`/problems/${problem.id}`)
                    setOpen(false)
                  }}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-card hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="flex-1">
                    <div className="font-medium">{problem.title}</div>
                    <div className="text-xs text-muted-foreground">{problem.category}</div>
                  </div>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Categories Section */}
            <Command.Group heading="Categories" className="overflow-hidden p-1.5 text-foreground">
              {['Array', 'String', 'Linked List', 'Dynamic Programming'].map((category) => (
                <Command.Item
                  key={category}
                  value={category}
                  onSelect={() => {
                    router.push(`/problems?category=${category}`)
                    setOpen(false)
                  }}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-card hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground"
                >
                  {category}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions Section */}
            <Command.Group heading="Actions" className="overflow-hidden p-1.5 text-foreground">
              <Command.Item
                value="Go to Dashboard"
                onSelect={() => {
                  router.push('/dashboard')
                  setOpen(false)
                }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-card hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground"
              >
                Go to Dashboard
              </Command.Item>
              <Command.Item
                value="Go to Problems"
                onSelect={() => {
                  router.push('/problems')
                  setOpen(false)
                }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-card hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground"
              >
                Go to Problems
              </Command.Item>
              <Command.Item
                value="Sign Out"
                onSelect={() => {
                  localStorage.removeItem('user')
                  router.push('/login')
                  setOpen(false)
                }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-card hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground"
              >
                Sign Out
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer hint */}
          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>Press ESC to close</span>
            <span className="text-right">⌘K or Ctrl+K</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    Easy: 'text-green-500 bg-green-500/10',
    Medium: 'text-yellow-500 bg-yellow-500/10',
    Hard: 'text-red-500 bg-red-500/10',
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </span>
  )
}
