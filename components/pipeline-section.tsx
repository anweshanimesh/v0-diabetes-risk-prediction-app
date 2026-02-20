import { Database, BarChart3, BrainCircuit, Rocket, FileCode, GitBranch } from "lucide-react"

const steps = [
  {
    icon: Database,
    title: "Data Collection",
    description: "Pima Indians Diabetes dataset with 768 clinical records and 8 diagnostic features.",
  },
  {
    icon: FileCode,
    title: "Preprocessing",
    description: "Missing value imputation, outlier detection, feature scaling with StandardScaler.",
  },
  {
    icon: BarChart3,
    title: "Exploratory Analysis",
    description: "Distribution analysis, correlation heatmaps, scatter plots, and statistical tests.",
  },
  {
    icon: BrainCircuit,
    title: "Model Training",
    description: "Logistic Regression and Random Forest classifiers with hyperparameter tuning.",
  },
  {
    icon: Rocket,
    title: "Model Serialization",
    description: "Pickle-based model serialization for efficient deployment and inference.",
  },
  {
    icon: GitBranch,
    title: "Deployment",
    description: "Interactive web interface with real-time predictions, hosted on GitHub with CI/CD.",
  },
]

export function PipelineSection() {
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            End-to-End Pipeline
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            ML Pipeline Architecture
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From raw clinical data to production-ready predictions, following best practices
            in data science and machine learning engineering.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* Connecting line */}
          <div className="absolute left-6 top-0 bottom-0 hidden w-px bg-border md:block md:left-1/2" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={step.title}
                  className={`relative flex items-start gap-4 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
                      <div className={`flex items-center gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <step.icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Step {i + 1}
                          </span>
                          <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 md:top-6">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                  </div>

                  {/* Empty spacer */}
                  <div className="hidden flex-1 md:block" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
