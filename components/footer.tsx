import { Activity } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">DiabetesML</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="text-xs text-muted-foreground">Pima Indians Diabetes Dataset</span>
            <span className="text-xs text-muted-foreground">Logistic Regression</span>
            <span className="text-xs text-muted-foreground">Random Forest</span>
            <span className="text-xs text-muted-foreground">Pickle Serialization</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Educational purposes only
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Built with Next.js, TypeScript, and Recharts. Model weights derived from scikit-learn training pipeline.
          </p>
        </div>
      </div>
    </footer>
  )
}
