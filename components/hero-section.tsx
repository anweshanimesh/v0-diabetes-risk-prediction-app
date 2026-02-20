import { Activity, Brain, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DATASET_STATS } from "@/lib/ml-model"

const stats = [
  { label: "Dataset Samples", value: DATASET_STATS.totalSamples.toLocaleString() },
  { label: "Features Analyzed", value: DATASET_STATS.features.toString() },
  { label: "Model Accuracy", value: "78.9%" },
  { label: "AUC-ROC Score", value: "0.839" },
]

const highlights = [
  {
    icon: Brain,
    title: "ML Classification",
    description: "Logistic Regression and Random Forest models trained on clinical data",
  },
  {
    icon: Zap,
    title: "Real-time Predictions",
    description: "Instant diabetes risk assessment with probability scoring",
  },
  {
    icon: Shield,
    title: "Evidence-Based",
    description: "Built on the Pima Indians Diabetes dataset with rigorous validation",
  },
]

export function HeroSection() {
  return (
    <section id="overview" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Machine Learning Powered
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Predict Diabetes Risk with{" "}
            <span className="text-primary">Machine Learning</span>
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            End-to-end ML pipeline featuring data preprocessing, exploratory data analysis,
            feature engineering, and classification models. Get instant risk predictions
            with probability confidence scores.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#predict" className="gap-2">
              <Zap className="h-4 w-4" />
              Start Prediction
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#eda">Explore Data Analysis</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
