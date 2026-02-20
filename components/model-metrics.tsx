"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MODEL_METRICS } from "@/lib/ml-model"

const lr = MODEL_METRICS.logisticRegression
const rf = MODEL_METRICS.randomForest

const comparisonData = [
  { metric: "Accuracy", lr: lr.accuracy, rf: rf.accuracy },
  { metric: "Precision", lr: lr.precision, rf: rf.precision },
  { metric: "Recall", lr: lr.recall, rf: rf.recall },
  { metric: "F1 Score", lr: lr.f1Score, rf: rf.f1Score },
  { metric: "AUC-ROC", lr: lr.aucRoc, rf: rf.aucRoc },
  { metric: "Specificity", lr: lr.specificity, rf: rf.specificity },
]

function ConfusionMatrixCard({
  name,
  matrix,
}: {
  name: string
  matrix: { tp: number; fp: number; fn: number; tn: number }
}) {
  const total = matrix.tp + matrix.fp + matrix.fn + matrix.tn
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground">{name}</CardTitle>
        <p className="text-xs text-muted-foreground">Confusion Matrix (n={total})</p>
      </CardHeader>
      <CardContent>
        <div className="mx-auto max-w-xs">
          {/* Header */}
          <div className="mb-2 text-center">
            <span className="text-xs font-medium text-muted-foreground">Predicted</span>
          </div>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
            {/* Corner */}
            <div />
            <div className="text-center text-xs font-medium text-muted-foreground py-2">
              Negative
            </div>
            <div className="text-center text-xs font-medium text-muted-foreground py-2">
              Positive
            </div>

            {/* Row 1: Actual Negative */}
            <div className="flex items-center">
              <span className="text-xs font-medium text-muted-foreground -rotate-0 whitespace-nowrap">
                Actual Neg.
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-primary/15 p-4">
              <span className="text-xl font-bold text-foreground">{matrix.tn}</span>
              <span className="text-[10px] text-muted-foreground mt-1">TN</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-chart-5/15 p-4">
              <span className="text-xl font-bold text-foreground">{matrix.fp}</span>
              <span className="text-[10px] text-muted-foreground mt-1">FP</span>
            </div>

            {/* Row 2: Actual Positive */}
            <div className="flex items-center">
              <span className="text-xs font-medium text-muted-foreground -rotate-0 whitespace-nowrap">
                Actual Pos.
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-chart-5/15 p-4">
              <span className="text-xl font-bold text-foreground">{matrix.fn}</span>
              <span className="text-[10px] text-muted-foreground mt-1">FN</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-primary/15 p-4">
              <span className="text-xl font-bold text-foreground">{matrix.tp}</span>
              <span className="text-[10px] text-muted-foreground mt-1">TP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricRow({
  label,
  lrVal,
  rfVal,
}: {
  label: string
  lrVal: number
  rfVal: number
}) {
  const better = lrVal >= rfVal ? "lr" : "rf"
  return (
    <div className="grid grid-cols-3 items-center border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-center text-sm font-mono font-medium ${
          better === "lr" ? "text-primary" : "text-foreground"
        }`}
      >
        {(lrVal * 100).toFixed(1)}%
      </span>
      <span
        className={`text-center text-sm font-mono font-medium ${
          better === "rf" ? "text-primary" : "text-foreground"
        }`}
      >
        {(rfVal * 100).toFixed(1)}%
      </span>
    </div>
  )
}

export function ModelMetrics() {
  return (
    <section id="models" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Model Evaluation
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Classification Model Performance
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Comparing Logistic Regression and Random Forest classifiers with cross-validated
            metrics. Models serialized with Pickle for production deployment.
          </p>
        </div>

        {/* Metrics Table */}
        <div className="mx-auto mt-12 max-w-2xl">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">
                Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 border-b border-border pb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Metric
                </span>
                <span className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Logistic Reg.
                </span>
                <span className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Random Forest
                </span>
              </div>
              <MetricRow label="Accuracy" lrVal={lr.accuracy} rfVal={rf.accuracy} />
              <MetricRow label="Precision" lrVal={lr.precision} rfVal={rf.precision} />
              <MetricRow label="Recall" lrVal={lr.recall} rfVal={rf.recall} />
              <MetricRow label="F1 Score" lrVal={lr.f1Score} rfVal={rf.f1Score} />
              <MetricRow label="AUC-ROC" lrVal={lr.aucRoc} rfVal={rf.aucRoc} />
              <MetricRow label="Specificity" lrVal={lr.specificity} rfVal={rf.specificity} />
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart Comparison */}
        <div className="mt-8">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">
                Visual Metric Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={comparisonData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                  <XAxis
                    dataKey="metric"
                    tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                    axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0.5, 1]}
                    tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                    axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                          <p className="text-xs font-medium text-foreground mb-1">{label}</p>
                          {payload.map((entry) => (
                            <p key={entry.name} className="text-xs text-muted-foreground">
                              <span
                                className="inline-block h-2 w-2 rounded-full mr-1.5"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name}: {((entry.value as number) * 100).toFixed(1)}%
                            </p>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11 }}
                    formatter={(value: string) => (
                      <span className="text-muted-foreground">{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="lr"
                    name="Logistic Regression"
                    fill="oklch(0.55 0.18 200)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rf"
                    name="Random Forest"
                    fill="oklch(0.65 0.2 160)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Confusion Matrices */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ConfusionMatrixCard
            name="Logistic Regression"
            matrix={lr.confusionMatrix}
          />
          <ConfusionMatrixCard
            name="Random Forest"
            matrix={rf.confusionMatrix}
          />
        </div>
      </div>
    </section>
  )
}
