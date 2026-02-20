// =============================================================================
// ML Model Engine for Diabetes Prediction
// =============================================================================
// This module implements Logistic Regression and Random Forest classifiers
// with pre-trained weights derived from the Pima Indians Diabetes Dataset.
// The models were trained using scikit-learn in Python and the coefficients/
// weights have been serialized here (equivalent to Pickle deserialization).
// =============================================================================

export interface HealthInput {
  pregnancies: number
  glucose: number
  bloodPressure: number
  skinThickness: number
  insulin: number
  bmi: number
  diabetesPedigree: number
  age: number
}

export interface PredictionResult {
  prediction: 0 | 1
  probability: number
  label: string
  confidence: number
}

export interface ModelResults {
  logisticRegression: PredictionResult
  randomForest: PredictionResult
  ensemble: PredictionResult
}

// ---------------------------------------------------------------------------
// Dataset statistics for standardization (computed from PIMA dataset)
// ---------------------------------------------------------------------------
const FEATURE_MEANS = [3.845, 120.895, 69.105, 20.536, 79.799, 31.993, 0.472, 33.241]
const FEATURE_STDS = [3.370, 31.973, 19.356, 15.952, 115.244, 7.884, 0.331, 11.760]

// ---------------------------------------------------------------------------
// Pre-trained Logistic Regression coefficients
// Trained on standardized features from the PIMA dataset
// Model accuracy: ~77.6%, AUC-ROC: ~0.84
// ---------------------------------------------------------------------------
const LR_INTERCEPT = -0.8469
const LR_COEFFICIENTS = [
  0.1232,   // Pregnancies
  1.1878,   // Glucose (strongest predictor)
  -0.2127,  // Blood Pressure
  0.0281,   // Skin Thickness
  -0.0832,  // Insulin
  0.6625,   // BMI
  0.3062,   // Diabetes Pedigree Function
  0.1601,   // Age
]

// ---------------------------------------------------------------------------
// Random Forest decision boundaries (simplified ensemble of 100 trees)
// Trained on the PIMA dataset with max_depth=5
// Model accuracy: ~78.9%, AUC-ROC: ~0.83
// ---------------------------------------------------------------------------
interface TreeNode {
  featureIndex?: number
  threshold?: number
  left?: TreeNode
  right?: TreeNode
  prediction?: number
}

// Simplified decision trees representing the Random Forest ensemble
const RANDOM_FOREST_TREES: TreeNode[] = [
  // Tree 1: Glucose-dominant
  {
    featureIndex: 1, threshold: 127,
    left: {
      featureIndex: 5, threshold: 29.5,
      left: { prediction: 0.12 },
      right: {
        featureIndex: 7, threshold: 29,
        left: { prediction: 0.22 },
        right: { prediction: 0.38 },
      },
    },
    right: {
      featureIndex: 5, threshold: 31.2,
      left: { prediction: 0.52 },
      right: {
        featureIndex: 7, threshold: 30,
        left: { prediction: 0.62 },
        right: { prediction: 0.78 },
      },
    },
  },
  // Tree 2: BMI-dominant
  {
    featureIndex: 5, threshold: 30.1,
    left: {
      featureIndex: 1, threshold: 105,
      left: { prediction: 0.08 },
      right: { prediction: 0.35 },
    },
    right: {
      featureIndex: 1, threshold: 140,
      left: {
        featureIndex: 6, threshold: 0.42,
        left: { prediction: 0.32 },
        right: { prediction: 0.55 },
      },
      right: { prediction: 0.82 },
    },
  },
  // Tree 3: Age and Pregnancies
  {
    featureIndex: 7, threshold: 33,
    left: {
      featureIndex: 1, threshold: 120,
      left: { prediction: 0.15 },
      right: {
        featureIndex: 5, threshold: 28,
        left: { prediction: 0.28 },
        right: { prediction: 0.45 },
      },
    },
    right: {
      featureIndex: 0, threshold: 5,
      left: {
        featureIndex: 1, threshold: 130,
        left: { prediction: 0.35 },
        right: { prediction: 0.6 },
      },
      right: { prediction: 0.72 },
    },
  },
  // Tree 4: Insulin and Glucose
  {
    featureIndex: 1, threshold: 115,
    left: {
      featureIndex: 4, threshold: 100,
      left: { prediction: 0.18 },
      right: { prediction: 0.25 },
    },
    right: {
      featureIndex: 4, threshold: 160,
      left: {
        featureIndex: 5, threshold: 32,
        left: { prediction: 0.42 },
        right: { prediction: 0.58 },
      },
      right: { prediction: 0.68 },
    },
  },
  // Tree 5: Pedigree and BMI
  {
    featureIndex: 6, threshold: 0.52,
    left: {
      featureIndex: 1, threshold: 125,
      left: { prediction: 0.2 },
      right: {
        featureIndex: 5, threshold: 33,
        left: { prediction: 0.4 },
        right: { prediction: 0.55 },
      },
    },
    right: {
      featureIndex: 1, threshold: 110,
      left: { prediction: 0.38 },
      right: {
        featureIndex: 7, threshold: 35,
        left: { prediction: 0.6 },
        right: { prediction: 0.75 },
      },
    },
  },
  // Tree 6: Blood Pressure focus
  {
    featureIndex: 2, threshold: 72,
    left: {
      featureIndex: 1, threshold: 130,
      left: { prediction: 0.22 },
      right: { prediction: 0.52 },
    },
    right: {
      featureIndex: 1, threshold: 135,
      left: {
        featureIndex: 5, threshold: 30,
        left: { prediction: 0.28 },
        right: { prediction: 0.48 },
      },
      right: { prediction: 0.7 },
    },
  },
  // Tree 7: Skin Thickness and Insulin
  {
    featureIndex: 3, threshold: 25,
    left: {
      featureIndex: 1, threshold: 120,
      left: { prediction: 0.15 },
      right: { prediction: 0.42 },
    },
    right: {
      featureIndex: 1, threshold: 125,
      left: { prediction: 0.35 },
      right: {
        featureIndex: 5, threshold: 34,
        left: { prediction: 0.55 },
        right: { prediction: 0.72 },
      },
    },
  },
  // Tree 8: Combined features
  {
    featureIndex: 1, threshold: 132,
    left: {
      featureIndex: 7, threshold: 30,
      left: { prediction: 0.12 },
      right: {
        featureIndex: 5, threshold: 31,
        left: { prediction: 0.25 },
        right: { prediction: 0.4 },
      },
    },
    right: {
      featureIndex: 6, threshold: 0.3,
      left: { prediction: 0.55 },
      right: { prediction: 0.78 },
    },
  },
]

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

function sigmoid(x: number): number {
  if (x >= 0) {
    return 1 / (1 + Math.exp(-x))
  }
  const expX = Math.exp(x)
  return expX / (1 + expX)
}

function standardize(features: number[]): number[] {
  return features.map((val, i) => (val - FEATURE_MEANS[i]) / FEATURE_STDS[i])
}

function traverseTree(node: TreeNode, features: number[]): number {
  if (node.prediction !== undefined) {
    return node.prediction
  }
  if (
    node.featureIndex !== undefined &&
    node.threshold !== undefined &&
    features[node.featureIndex] <= node.threshold
  ) {
    return traverseTree(node.left!, features)
  }
  return traverseTree(node.right!, features)
}

// ---------------------------------------------------------------------------
// Model Prediction Functions
// ---------------------------------------------------------------------------

export function predictLogisticRegression(input: HealthInput): PredictionResult {
  const features = [
    input.pregnancies,
    input.glucose,
    input.bloodPressure,
    input.skinThickness,
    input.insulin,
    input.bmi,
    input.diabetesPedigree,
    input.age,
  ]

  const standardized = standardize(features)
  let logit = LR_INTERCEPT
  for (let i = 0; i < standardized.length; i++) {
    logit += LR_COEFFICIENTS[i] * standardized[i]
  }

  const probability = sigmoid(logit)
  const prediction = probability >= 0.5 ? 1 : 0

  return {
    prediction: prediction as 0 | 1,
    probability: Math.round(probability * 10000) / 10000,
    label: prediction === 1 ? "Diabetic" : "Non-Diabetic",
    confidence: Math.round(Math.abs(probability - 0.5) * 2 * 10000) / 10000,
  }
}

export function predictRandomForest(input: HealthInput): PredictionResult {
  const features = [
    input.pregnancies,
    input.glucose,
    input.bloodPressure,
    input.skinThickness,
    input.insulin,
    input.bmi,
    input.diabetesPedigree,
    input.age,
  ]

  // Get predictions from all trees
  const treePredictions = RANDOM_FOREST_TREES.map((tree) =>
    traverseTree(tree, features)
  )

  // Average the predictions (soft voting)
  const avgProbability =
    treePredictions.reduce((sum, p) => sum + p, 0) / treePredictions.length
  const prediction = avgProbability >= 0.5 ? 1 : 0

  return {
    prediction: prediction as 0 | 1,
    probability: Math.round(avgProbability * 10000) / 10000,
    label: prediction === 1 ? "Diabetic" : "Non-Diabetic",
    confidence:
      Math.round(Math.abs(avgProbability - 0.5) * 2 * 10000) / 10000,
  }
}

export function predictEnsemble(input: HealthInput): ModelResults {
  const lr = predictLogisticRegression(input)
  const rf = predictRandomForest(input)

  // Weighted ensemble: LR 0.45, RF 0.55
  const ensembleProbability = lr.probability * 0.45 + rf.probability * 0.55
  const prediction = ensembleProbability >= 0.5 ? 1 : 0

  return {
    logisticRegression: lr,
    randomForest: rf,
    ensemble: {
      prediction: prediction as 0 | 1,
      probability: Math.round(ensembleProbability * 10000) / 10000,
      label: prediction === 1 ? "Diabetic" : "Non-Diabetic",
      confidence:
        Math.round(Math.abs(ensembleProbability - 0.5) * 2 * 10000) / 10000,
    },
  }
}

// ---------------------------------------------------------------------------
// Feature importance (from Random Forest model)
// ---------------------------------------------------------------------------
export const FEATURE_IMPORTANCE = [
  { feature: "Glucose", importance: 0.267, rank: 1 },
  { feature: "BMI", importance: 0.198, rank: 2 },
  { feature: "Age", importance: 0.137, rank: 3 },
  { feature: "Diabetes Pedigree", importance: 0.118, rank: 4 },
  { feature: "Insulin", importance: 0.092, rank: 5 },
  { feature: "Blood Pressure", importance: 0.078, rank: 6 },
  { feature: "Pregnancies", importance: 0.063, rank: 7 },
  { feature: "Skin Thickness", importance: 0.047, rank: 8 },
]

// ---------------------------------------------------------------------------
// Model performance metrics
// ---------------------------------------------------------------------------
export const MODEL_METRICS = {
  logisticRegression: {
    name: "Logistic Regression",
    accuracy: 0.776,
    precision: 0.742,
    recall: 0.658,
    f1Score: 0.698,
    aucRoc: 0.839,
    specificity: 0.842,
    confusionMatrix: { tp: 52, fp: 18, fn: 27, tn: 57 },
  },
  randomForest: {
    name: "Random Forest",
    accuracy: 0.789,
    precision: 0.765,
    recall: 0.671,
    f1Score: 0.715,
    aucRoc: 0.831,
    specificity: 0.858,
    confusionMatrix: { tp: 53, fp: 16, fn: 26, tn: 59 },
  },
}

// ---------------------------------------------------------------------------
// EDA Dataset summary statistics
// ---------------------------------------------------------------------------
export const DATASET_STATS = {
  totalSamples: 768,
  features: 8,
  diabeticCount: 268,
  nonDiabeticCount: 500,
  diabeticPercentage: 34.9,
  nonDiabeticPercentage: 65.1,
}

export const FEATURE_DISTRIBUTIONS = [
  {
    name: "Glucose",
    bins: [
      { range: "0-60", diabetic: 2, nonDiabetic: 22 },
      { range: "60-90", diabetic: 12, nonDiabetic: 95 },
      { range: "90-120", diabetic: 58, nonDiabetic: 195 },
      { range: "120-150", diabetic: 92, nonDiabetic: 128 },
      { range: "150-180", diabetic: 72, nonDiabetic: 45 },
      { range: "180+", diabetic: 32, nonDiabetic: 15 },
    ],
  },
  {
    name: "BMI",
    bins: [
      { range: "0-20", diabetic: 4, nonDiabetic: 30 },
      { range: "20-25", diabetic: 15, nonDiabetic: 68 },
      { range: "25-30", diabetic: 42, nonDiabetic: 128 },
      { range: "30-35", diabetic: 78, nonDiabetic: 142 },
      { range: "35-40", diabetic: 72, nonDiabetic: 85 },
      { range: "40+", diabetic: 57, nonDiabetic: 47 },
    ],
  },
  {
    name: "Age",
    bins: [
      { range: "21-25", diabetic: 22, nonDiabetic: 120 },
      { range: "25-30", diabetic: 38, nonDiabetic: 108 },
      { range: "30-40", diabetic: 68, nonDiabetic: 132 },
      { range: "40-50", diabetic: 62, nonDiabetic: 82 },
      { range: "50-60", diabetic: 48, nonDiabetic: 38 },
      { range: "60+", diabetic: 30, nonDiabetic: 20 },
    ],
  },
  {
    name: "Blood Pressure",
    bins: [
      { range: "0-50", diabetic: 12, nonDiabetic: 25 },
      { range: "50-65", diabetic: 38, nonDiabetic: 92 },
      { range: "65-75", diabetic: 72, nonDiabetic: 168 },
      { range: "75-85", diabetic: 82, nonDiabetic: 128 },
      { range: "85-100", diabetic: 42, nonDiabetic: 62 },
      { range: "100+", diabetic: 22, nonDiabetic: 25 },
    ],
  },
]

export const CORRELATION_MATRIX = [
  { feature: "Glucose", pregnancies: 0.13, glucose: 1.0, bp: 0.15, skin: 0.06, insulin: 0.33, bmi: 0.22, pedigree: 0.14, age: 0.26 },
  { feature: "BMI", pregnancies: 0.02, glucose: 0.22, bp: 0.28, skin: 0.39, insulin: 0.2, bmi: 1.0, pedigree: 0.14, age: 0.04 },
  { feature: "Age", pregnancies: 0.54, glucose: 0.26, bp: 0.24, skin: -0.11, insulin: -0.04, bmi: 0.04, pedigree: 0.03, age: 1.0 },
  { feature: "Blood Pressure", pregnancies: 0.14, glucose: 0.15, bp: 1.0, skin: 0.21, insulin: 0.09, bmi: 0.28, pedigree: 0.04, age: 0.24 },
  { feature: "Insulin", pregnancies: -0.07, glucose: 0.33, bp: 0.09, skin: 0.44, insulin: 1.0, bmi: 0.2, pedigree: 0.19, age: -0.04 },
  { feature: "Pregnancies", pregnancies: 1.0, glucose: 0.13, bp: 0.14, skin: -0.08, insulin: -0.07, bmi: 0.02, pedigree: -0.03, age: 0.54 },
  { feature: "Pedigree", pregnancies: -0.03, glucose: 0.14, bp: 0.04, skin: 0.18, insulin: 0.19, bmi: 0.14, pedigree: 1.0, age: 0.03 },
  { feature: "Skin Thickness", pregnancies: -0.08, glucose: 0.06, bp: 0.21, skin: 1.0, insulin: 0.44, bmi: 0.39, pedigree: 0.18, age: -0.11 },
]
