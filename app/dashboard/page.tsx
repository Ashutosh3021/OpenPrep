import { Navbar } from '@/components/navbar'
import { Dashboard } from '@/components/dashboard'

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <Dashboard />
      </main>
    </>
  )
}
