'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Command } from 'lucide-react'

interface NavbarProps {
  showAuth?: boolean
}

export function Navbar({ showAuth = true }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [streak, setStreak] = useState(7)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setIsAuthenticated(true)
      setUserEmail(userData.email)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    router.push('/login')
  }

  // Don't show navbar on auth pages
  if (pathname?.includes('/auth') || pathname?.includes('/login') || pathname?.includes('/signup')) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">OpenPrep</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" label="Problems" active={pathname === '/'} />
            <NavLink href="/daily" label="Daily Challenge" active={pathname === '/daily'} />
            <NavLink href="/discuss" label="Discuss" active={pathname === '/discuss'} />
          </div>

          {/* Right Side - Streak + Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border">
                <span className="text-xs font-medium text-muted-foreground">Streak:</span>
                <span className="font-bold text-accent">{streak}</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
                  onClick={() => router.push('/dashboard')}
                >
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-card"
                  onClick={() => router.push('/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => router.push('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ 
  href, 
  label, 
  active 
}: { 
  href: string
  label: string
  active: boolean 
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'text-accent bg-accent/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-card'
      }`}
    >
      {label}
    </Link>
  )
}
