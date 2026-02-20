"use client"

import { useState, useCallback } from "react"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Heart,
  Droplets,
  Scale,
  Baby,
  Syringe,
  Clock,
  Dna,
  Gauge,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ModelResults } from "@/lib/ml-model"

interface FormValues {
  pregnancies: number
  glucose: number
  bloodPressure: number
  skinThickness: number
  insulin: number
  bmi: number
  diabetesPedigree: number
  age: number
}

const DEFAULT_VALUES: FormValues = {
  pregnancies: 1,
  glucose: 110,
  bloodPressure: 72,
  skinThickness: 25,
  insulin: 80,
  bmi: 28,
  diabetesPedigree: 0.35,
  age: 33,
}

const FIELD_CONFIG = [
  { key: "pregnancies" as const, label: "Pregnancies", min: 0, max: 17, step: 1, unit: "", icon: Baby, description: "Number of times pregnant" },
  { key: "glucose" as const, label: "Glucose", min: 0, max: 200, step: 1, unit: "mg/dL", icon: Droplets, description: "Plasma glucose concentration (2hr oral glucose tolerance test)" },
  { key: "bloodPressure" as const, label: "Blood Pressure", min: 0, max: 140, step: 1, unit: "mm Hg", icon: Heart, description: "Diastolic blood pressure" },
  { key: "skinThickness" as const, label: "Skin Thickness", min: 0, max: 100, step: 1, unit: "mm", icon: Gauge, description: "Triceps skin fold thickness" },
  { key: "insulin" as const, label: "Insulin", min: 0, max: 850, step: 1, unit: "mu U/ml", icon: Syringe, description: "2-hour serum insulin" },
  { key: "bmi" as const, label: "BMI", min: 0, max: 70, step: 0.1, unit: "kg/m\u00B2", icon: Scale, description: "Body mass index (weight/height^2)" },
  { key: "diabetesPedigree" as const, label: "Diabetes Pedigree", min: 0.05, max: 2.5, step: 0.01, unit: "", icon: Dna, description: "Diabetes pedigree function (genetic influence score)" },
  { key: "age" as const, label: "Age", min: 21, max: 81, step: 1, unit: "years", icon: Clock, description: "Age in years" },
]

function ProbabilityGauge({ probability, label }: { probability: number; label: string }) {
  const percentage = Math.round(probability * 100)
  const isHighRisk = probability >= 0.5
  const circumference = 2 * Math.PI * 60
  const strokeDashoffset = circumference - (probability * circumference)

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r="60"
            stroke="oklch(0.22 0.015 250)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="70"
            cy="70"
            r="60"
            stroke={isHighRisk ? "oklch(0.65 0.2 30)" : "oklch(0.65 0.2 160)"}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{percentage}%</span>
          <span className="text-[10px] text-muted-foreground">probability</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {isHighRisk ? (
          <AlertTriangle className="h-4 w-4 text-chart-5" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        )}
        <span
          className={`text-sm font-semibold ${isHighRisk ? "text-chart-5" : "text-primary"}`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

function ResultCard({
  title,
  result,
}: {
  title: string
  result: { prediction: number; probability: number; label: string; confidence: number }
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProbabilityGauge probability={result.probability} label={result.label} />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Prediction</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {result.prediction === 1 ? "Positive" : "Negative"}
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {(result.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PredictionForm() {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES)
  const [results, setResults] = useState<ModelResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((key: keyof FormValues, val: number[]) => {
    setValues((prev) => ({ ...prev, [key]: val[0] }))
  }, [])

  const handleReset = useCallback(() => {
    setValues(DEFAULT_VALUES)
    setResults(null)
    setError(null)
  }, [])

  const handlePredict = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Prediction failed.")
        return
      }
      setResults(data.results)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [values])

  return (
    <section id="predict" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Real-time Prediction
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Diabetes Risk Assessment
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Enter your health parameters below and receive instant predictions from
            both Logistic Regression and Random Forest models with probability scores.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Input Form */}
          <div className="lg:col-span-3">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Activity className="h-4 w-4 text-primary" />
                    Health Parameters
                  </CardTitle>
                  <button
                    onClick={handleReset}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reset to defaults
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {FIELD_CONFIG.map((field) => {
                    const Icon = field.icon
                    return (
                      <div key={field.key} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm text-foreground">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            {field.label}
                          </label>
                          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-mono font-medium text-foreground">
                            {field.key === "diabetesPedigree"
                              ? values[field.key].toFixed(2)
                              : field.key === "bmi"
                                ? values[field.key].toFixed(1)
                                : values[field.key]}
                            {field.unit && (
                              <span className="ml-1 text-muted-foreground">{field.unit}</span>
                            )}
                          </span>
                        </div>
                        <Slider
                          value={[values[field.key]]}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          onValueChange={(val) => handleChange(field.key, val)}
                          className="cursor-pointer"
                        />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {field.description}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-4 w-4" />
                        Run Prediction
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset} size="lg">
                    Reset
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {results ? (
              <Tabs defaultValue="ensemble" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="ensemble" className="flex-1 text-xs">Ensemble</TabsTrigger>
                  <TabsTrigger value="lr" className="flex-1 text-xs">Logistic Reg.</TabsTrigger>
                  <TabsTrigger value="rf" className="flex-1 text-xs">Random Forest</TabsTrigger>
                </TabsList>
                <TabsContent value="ensemble" className="mt-4">
                  <ResultCard title="Ensemble Model (Weighted)" result={results.ensemble} />
                </TabsContent>
                <TabsContent value="lr" className="mt-4">
                  <ResultCard title="Logistic Regression" result={results.logisticRegression} />
                </TabsContent>
                <TabsContent value="rf" className="mt-4">
                  <ResultCard title="Random Forest" result={results.randomForest} />
                </TabsContent>

                {/* Risk Breakdown */}
                <Card className="mt-4 border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Model Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Logistic Regression", prob: results.logisticRegression.probability },
                        { name: "Random Forest", prob: results.randomForest.probability },
                        { name: "Ensemble", prob: results.ensemble.probability },
                      ].map((model) => (
                        <div key={model.name}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{model.name}</span>
                            <span className="font-mono text-foreground">
                              {(model.prob * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: `${model.prob * 100}%`,
                                backgroundColor:
                                  model.prob >= 0.5
                                    ? "oklch(0.65 0.2 30)"
                                    : "oklch(0.65 0.2 160)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Tabs>
            ) : (
              <Card className="flex h-full min-h-[400px] items-center justify-center border-border bg-card">
                <div className="text-center px-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                    <Activity className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-foreground">
                    No Prediction Yet
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Adjust the health parameters on the left and click
                    &quot;Run Prediction&quot; to get your diabetes risk
                    assessment from multiple ML models.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card p-4">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> This tool is for educational and
            research purposes only. It is not a substitute for professional medical advice,
            diagnosis, or treatment. Always seek the advice of your physician or other qualified
            health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </section>
  )
}
