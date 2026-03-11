import { Navbar } from '@/components/navbar'
import { ProblemList } from '@/components/problem-list'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProblemList />
      </main>
    </>
  )
}
