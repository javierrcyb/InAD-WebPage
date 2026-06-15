import NavBar from '@/components/layout/NavBar'
import InfoBlock from '@/components/layout/InfoBlock'
import EvaluationFlow from '@/components/forms/EvaluationFlow'

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <InfoBlock />
      <EvaluationFlow />
    </main>
  )
}