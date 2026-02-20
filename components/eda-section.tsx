"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DATASET_STATS,
  FEATURE_DISTRIBUTIONS,
  FEATURE_IMPORTANCE,
  CORRELATION_MATRIX,
} from "@/lib/ml-model"

const PIE_COLORS = ["oklch(0.65 0.2 160)", "oklch(0.55 0.18 200)"]

const outcomeData = [
  { name: "Non-Diabetic", value: DATASET_STATS.nonDiabeticCount, pct: DATASET_STATS.nonDiabeticPercentage },
  { name: "Diabetic", value: DATASET_STATS.diabeticCount, pct: DATASET_STATS.diabeticPercentage },
]

const radarData = FEATURE_IMPORTANCE.map((f) => ({
  feature: f.feature.length > 10 ? f.feature.slice(0, 10) + "." : f.feature,
  importance: Math.round(f.importance * 100),
}))

const correlationFeatures = ["pregnancies", "glucose", "bp", "skin", "insulin", "bmi", "pedigree", "age"] as const

function CorrelationHeatmap() {
  const getColor = (val: number) => {
    if (val >= 0.4) return "bg-primary text-primary-foreground"
    if (val >= 0.2) return "bg-primary/60 text-foreground"
    if (val >= 0.1) return "bg-primary/30 text-foreground"
    if (val >= -0.05) return "bg-secondary text-muted-foreground"
    return "bg-chart-5/30 text-foreground"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="p-2 text-left text-muted-foreground font-medium" />
            {correlationFeatures.map((f) => (
              <th key={f} className="p-2 text-center text-muted-foreground font-medium capitalize">
                {f === "bp" ? "BP" : f.slice(0, 5)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CORRELATION_MATRIX.map((row) => (
            <tr key={row.feature}>
              <td className="p-2 text-left text-muted-foreground font-medium whitespace-nowrap">
                {row.feature.length > 12 ? row.feature.slice(0, 12) + "." : row.feature}
              </td>
              {correlationFeatures.map((f) => {
                const val = row[f] as number
                return (
                  <td key={f} className="p-1">
                    <div
                      className={`flex items-center justify-center rounded-md p-2 text-xs font-mono ${getColor(val)}`}
                    >
                      {val.toFixed(2)}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const scatterData = [
  { glucose: 85, bmi: 26.6, outcome: 0 },
  { glucose: 183, bmi: 23.3, outcome: 1 },
  { glucose: 89, bmi: 28.1, outcome: 0 },
  { glucose: 137, bmi: 43.1, outcome: 1 },
  { glucose: 116, bmi: 25.6, outcome: 0 },
  { glucose: 78, bmi: 31, outcome: 0 },
  { glucose: 115, bmi: 35.3, outcome: 0 },
  { glucose: 197, bmi: 30.5, outcome: 1 },
  { glucose: 125, bmi: 0, outcome: 1 },
  { glucose: 110, bmi: 37.6, outcome: 0 },
  { glucose: 168, bmi: 38.2, outcome: 1 },
  { glucose: 139, bmi: 27.1, outcome: 0 },
  { glucose: 189, bmi: 31.1, outcome: 1 },
  { glucose: 166, bmi: 25.8, outcome: 1 },
  { glucose: 100, bmi: 30, outcome: 0 },
  { glucose: 118, bmi: 33.3, outcome: 0 },
  { glucose: 107, bmi: 36.6, outcome: 0 },
  { glucose: 103, bmi: 19.6, outcome: 0 },
  { glucose: 126, bmi: 39.3, outcome: 1 },
  { glucose: 99, bmi: 27.2, outcome: 0 },
  { glucose: 196, bmi: 36.5, outcome: 1 },
  { glucose: 119, bmi: 32.4, outcome: 0 },
  { glucose: 143, bmi: 36.6, outcome: 1 },
  { glucose: 147, bmi: 49.3, outcome: 1 },
  { glucose: 97, bmi: 35.6, outcome: 0 },
  { glucose: 145, bmi: 44.2, outcome: 1 },
  { glucose: 117, bmi: 34.1, outcome: 0 },
  { glucose: 109, bmi: 36, outcome: 0 },
  { glucose: 158, bmi: 31.6, outcome: 1 },
  { glucose: 88, bmi: 27.1, outcome: 0 },
  { glucose: 92, bmi: 24.2, outcome: 0 },
  { glucose: 122, bmi: 36.8, outcome: 0 },
  { glucose: 103, bmi: 43.3, outcome: 0 },
  { glucose: 138, bmi: 40.6, outcome: 1 },
  { glucose: 102, bmi: 34.4, outcome: 0 },
  { glucose: 90, bmi: 39.8, outcome: 0 },
  { glucose: 111, bmi: 30.1, outcome: 0 },
  { glucose: 180, bmi: 34.5, outcome: 1 },
  { glucose: 133, bmi: 33.2, outcome: 1 },
  { glucose: 106, bmi: 29, outcome: 0 },
]

const diabeticScatter = scatterData.filter((d) => d.outcome === 1)
const nonDiabeticScatter = scatterData.filter((d) => d.outcome === 0)

function CustomTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export function EDASection() {
  const [selectedDist, setSelectedDist] = useState(0)

  return (
    <section id="eda" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Exploratory Data Analysis
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Understanding the Dataset
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Comprehensive analysis of the Pima Indians Diabetes dataset with {DATASET_STATS.totalSamples} clinical
            records and {DATASET_STATS.features} health features.
          </p>
        </div>

        <Tabs defaultValue="distribution" className="mt-12">
          <TabsList className="mx-auto flex w-fit flex-wrap">
            <TabsTrigger value="distribution">Distributions</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
            <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
            <TabsTrigger value="importance">Feature Importance</TabsTrigger>
          </TabsList>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="mt-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Class Distribution Pie */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-foreground">
                    Target Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={outcomeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {outcomeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                              <p className="text-xs font-medium text-foreground">{data.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Count: {data.value} ({data.pct}%)
                              </p>
                            </div>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex justify-center gap-6">
                    {outcomeData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[i] }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.name} ({item.pct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feature Distribution Bar Chart */}
              <Card className="border-border bg-card lg:col-span-2">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Feature Distributions by Outcome
                    </CardTitle>
                    <div className="flex gap-1.5">
                      {FEATURE_DISTRIBUTIONS.map((f, i) => (
                        <button
                          key={f.name}
                          onClick={() => setSelectedDist(i)}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedDist === i
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={FEATURE_DISTRIBUTIONS[selectedDist].bins}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                      <XAxis
                        dataKey="range"
                        tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                        axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                        axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltipContent />} />
                      <Legend
                        wrapperStyle={{ fontSize: 11 }}
                        formatter={(value: string) => (
                          <span className="text-muted-foreground">{value}</span>
                        )}
                      />
                      <Bar
                        dataKey="nonDiabetic"
                        name="Non-Diabetic"
                        fill="oklch(0.55 0.18 200)"
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        dataKey="diabetic"
                        name="Diabetic"
                        fill="oklch(0.65 0.2 160)"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Correlation Tab */}
          <TabsContent value="correlation" className="mt-8">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">
                  Feature Correlation Matrix
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Pairwise Pearson correlation coefficients between all features
                </p>
              </CardHeader>
              <CardContent>
                <CorrelationHeatmap />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scatter Plot Tab */}
          <TabsContent value="scatter" className="mt-8">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">
                  Glucose vs BMI Scatter Plot
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Visualizing the two most predictive features colored by diabetes outcome
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                    <XAxis
                      type="number"
                      dataKey="glucose"
                      name="Glucose"
                      tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                      axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                      tickLine={false}
                      label={{ value: "Glucose (mg/dL)", position: "bottom", fill: "oklch(0.65 0.01 250)", fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="bmi"
                      name="BMI"
                      tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                      axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                      tickLine={false}
                      label={{ value: "BMI", angle: -90, position: "insideLeft", fill: "oklch(0.65 0.01 250)", fontSize: 12 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                            <p className="text-xs font-medium text-foreground">
                              {data.outcome === 1 ? "Diabetic" : "Non-Diabetic"}
                            </p>
                            <p className="text-xs text-muted-foreground">Glucose: {data.glucose}</p>
                            <p className="text-xs text-muted-foreground">BMI: {data.bmi}</p>
                          </div>
                        )
                      }}
                    />
                    <Scatter
                      name="Non-Diabetic"
                      data={nonDiabeticScatter}
                      fill="oklch(0.55 0.18 200)"
                      opacity={0.7}
                    />
                    <Scatter
                      name="Diabetic"
                      data={diabeticScatter}
                      fill="oklch(0.65 0.2 160)"
                      opacity={0.7}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Importance Tab */}
          <TabsContent value="importance" className="mt-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-foreground">
                    Feature Importance (Random Forest)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={FEATURE_IMPORTANCE}
                      layout="vertical"
                      margin={{ left: 10, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                        axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="feature"
                        type="category"
                        width={100}
                        tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 11 }}
                        axisLine={{ stroke: "oklch(0.28 0.02 250)" }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                              <p className="text-xs font-medium text-foreground">
                                {payload[0].payload.feature}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Importance: {(payload[0].value as number * 100).toFixed(1)}%
                              </p>
                            </div>
                          )
                        }}
                      />
                      <Bar dataKey="importance" fill="oklch(0.65 0.2 160)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-foreground">
                    Feature Importance Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(0.28 0.02 250)" />
                      <PolarAngleAxis
                        dataKey="feature"
                        tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 10 }}
                      />
                      <PolarRadiusAxis
                        tick={{ fill: "oklch(0.65 0.01 250)", fontSize: 9 }}
                        axisLine={false}
                      />
                      <Radar
                        name="Importance"
                        dataKey="importance"
                        stroke="oklch(0.65 0.2 160)"
                        fill="oklch(0.65 0.2 160)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
