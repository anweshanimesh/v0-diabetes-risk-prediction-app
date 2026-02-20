import { NextRequest, NextResponse } from "next/server"
import { predictEnsemble, type HealthInput } from "@/lib/ml-model"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const input: HealthInput = {
      pregnancies: Number(body.pregnancies) || 0,
      glucose: Number(body.glucose) || 0,
      bloodPressure: Number(body.bloodPressure) || 0,
      skinThickness: Number(body.skinThickness) || 0,
      insulin: Number(body.insulin) || 0,
      bmi: Number(body.bmi) || 0,
      diabetesPedigree: Number(body.diabetesPedigree) || 0,
      age: Number(body.age) || 0,
    }

    // Validate inputs
    if (input.glucose <= 0 || input.bmi <= 0 || input.age <= 0) {
      return NextResponse.json(
        { error: "Glucose, BMI, and Age must be positive values." },
        { status: 400 }
      )
    }

    const results = predictEnsemble(input)

    return NextResponse.json({
      success: true,
      results,
      input,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to process prediction request." },
      { status: 500 }
    )
  }
}
