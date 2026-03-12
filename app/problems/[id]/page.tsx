import { Navbar } from '@/components/navbar'
import { ProblemDetail } from '@/components/problem-detail'
import { notFound } from 'next/navigation'
// TODO: Import Supabase client and fetchProblemById when database is ready
// import { createClient } from '@/lib/supabase/client'
// import { fetchProblemById } from '@/lib/supabase/problems'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProblemPage({ params }: Props) {
  const { id } = await params
  const problemId = parseInt(id)
  
  // Validate ID is a number
  if (isNaN(problemId)) {
    notFound()
  }

  // TODO: Replace with Supabase query when database is ready
  // const supabase = createClient()
  // const problem = await fetchProblemById(supabase, problemId)
  // if (!problem) {
  //   notFound()
  // }
  
  // For now, pass problemId to client component which uses mock data
  // The ProblemDetail component handles invalid IDs with "Problem not found"
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProblemDetail problemId={problemId} />
      </main>
    </>
  )
}
