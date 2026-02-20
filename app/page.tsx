import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PipelineSection } from "@/components/pipeline-section"
import { EDASection } from "@/components/eda-section"
import { ModelMetrics } from "@/components/model-metrics"
import { PredictionForm } from "@/components/prediction-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <PipelineSection />
      <EDASection />
      <ModelMetrics />
      <PredictionForm />
      <Footer />
    </main>
  )
}
