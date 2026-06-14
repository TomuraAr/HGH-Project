export interface AssessmentRequest {
  location: string;
  depth: string;
  age: string;
  diameter: string;
  wellType: string;
  knownTemp: string;
  geoGradient: string;
  formationRock: string;
  solarIrradiance: string;
  gridDistance: string;
  integrity: string;
  nanofluidConcentration: string;
  troughEfficiency: string;
  operationalDays: string;
}

export interface SubScores {
  thermalScore: number;
  integrityScore: number;
  solarScore: number;
  deploymentScore: number;
}

export interface AssessmentMetrics {
  estSurfaceTemp: number;
  estPowerOutput: string;
  paybackPeriod: string;
}

export interface AssessmentResult {
  overallScore: number;
  verdict: string;
  subScores: SubScores;
  metrics: AssessmentMetrics;
  strengths: string[];
  risks: string[];
  materialNotes: string;
}

export interface BasinPreset {
  id: string;
  name: string;
  description: string;
  values: AssessmentRequest;
}
