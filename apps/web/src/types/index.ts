// Shared types for Namma Saathi Health

export type RiskLevel = "normal" | "watch" | "elevated" | "critical";
export type AgentType = "carepulse" | "carebridge" | "careaccess" | "medguide" | "carelocate" | "reportlens" | "healthlearn";
export type UrgencyCategory = "routine" | "soon" | "urgent" | "emergency";

export interface HealthSignal {
  id: string;
  type: "vital" | "medication" | "symptom" | "lab" | "activity" | "sleep";
  label: string;
  currentValue: string;
  previousValue?: string;
  unit: string;
  trend: "up" | "down" | "stable";
  riskLevel: RiskLevel;
  timestamp: string;
  explanation?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "diagnosis" | "medication" | "lab" | "procedure" | "visit" | "symptom" | "discharge";
  title: string;
  description: string;
  source: string;
  sourceType: "extracted" | "ai_interpreted" | "user_reported";
  details?: Record<string, string>;
}

export interface CarePathwayStep {
  id: string;
  step: number;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  urgency?: UrgencyCategory;
}

export interface AgentTraceStep {
  id: string;
  label: string;
  description: string;
  status: "completed" | "active" | "pending";
  timestamp?: string;
  details?: string;
}

export interface DemoMetric {
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

export interface SafetyCheck {
  label: string;
  status: "passed" | "warning" | "flagged";
  detail: string;
}

export interface EvidenceItem {
  source: string;
  excerpt: string;
  confidence: "high" | "medium" | "low";
  type: "document" | "guideline" | "patient_data";
}

export interface WhyThisAnswer {
  evidenceUsed: EvidenceItem[];
  reasoningSummary: string;
  confidence: "high" | "medium" | "low";
  missingInformation: string[];
  safetyConstraints: string[];
}
