import { Navbar } from '@/components/navbar'
import { ProblemList } from '@/components/problem-list'

export const metadata = {
  title: 'Problems - OpenPrep',
  description: 'Browse and solve coding problems',
}

export default function ProblemsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProblemList />
      </main>
    </>
  )
}