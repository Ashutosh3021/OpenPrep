import { Navbar } from '@/components/navbar'
import { ProblemDetail } from '@/components/problem-detail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProblemPage({ params }: Props) {
  const { id } = await params
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProblemDetail problemId={parseInt(id)} />
      </main>
    </>
  )
}
