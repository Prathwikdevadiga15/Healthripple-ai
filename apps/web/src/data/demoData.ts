import type { HealthSignal, TimelineEvent, CarePathwayStep, AgentTraceStep, DemoMetric, SafetyCheck, EvidenceItem } from "@/types";

// ─── DEMO LABEL ──────────────────────────────────────────────────────
// ALL DATA BELOW IS SIMULATED FOR PROTOTYPE DEMONSTRATION PURPOSES ONLY.
// No real patient data is used. No real clinical outcomes are represented.
// ─────────────────────────────────────────────────────────────────────

export const DEMO_HEALTH_SIGNALS: HealthSignal[] = [
  {
    id: "vs-bp",
    type: "vital",
    label: "Blood Pressure",
    currentValue: "148/92",
    previousValue: "128/82",
    unit: "mmHg",
    trend: "up",
    riskLevel: "elevated",
    timestamp: "2026-09-30T09:15:00",
    explanation: "Systolic pressure has increased by 20mmHg compared to the previous reading taken 2 weeks ago. This exceeds the baseline trend and may warrant clinical review.",
  },
  {
    id: "vs-hr",
    type: "vital",
    label: "Heart Rate",
    currentValue: "82",
    previousValue: "76",
    unit: "bpm",
    trend: "up",
    riskLevel: "watch",
    timestamp: "2026-09-30T09:15:00",
    explanation: "Heart rate is slightly above the patient's baseline average of 74 bpm. The increase correlates with the elevated blood pressure reading.",
  },
  {
    id: "vs-spo2",
    type: "vital",
    label: "SpO₂",
    currentValue: "97",
    previousValue: "98",
    unit: "%",
    trend: "stable",
    riskLevel: "normal",
    timestamp: "2026-09-30T09:15:00",
    explanation: "Oxygen saturation remains within normal range.",
  },
  {
    id: "lab-hba1c",
    type: "lab",
    label: "HbA1c",
    currentValue: "7.2",
    previousValue: "6.8",
    unit: "%",
    trend: "up",
    riskLevel: "watch",
    timestamp: "2026-09-28T14:30:00",
    explanation: "HbA1c has increased from 6.8% to 7.2% over the past 3 months, indicating a decline in glycemic control. The patient's medication adherence data shows missed doses on 8 of the last 30 days.",
  },
  {
    id: "med-adherence",
    type: "medication",
    label: "Medication Adherence",
    currentValue: "73",
    previousValue: "91",
    unit: "%",
    trend: "down",
    riskLevel: "elevated",
    timestamp: "2026-09-30T00:00:00",
    explanation: "Adherence has dropped from 91% to 73% over the last 30 days. Missed doses correlate with the rising HbA1c and blood pressure trends.",
  },
  {
    id: "act-sleep",
    type: "sleep",
    label: "Sleep Quality",
    currentValue: "5.2",
    previousValue: "7.1",
    unit: "hrs avg",
    trend: "down",
    riskLevel: "watch",
    timestamp: "2026-09-29T08:00:00",
    explanation: "Average sleep duration has decreased. Reduced sleep can affect blood pressure regulation and medication adherence.",
  },
  {
    id: "sym-fatigue",
    type: "symptom",
    label: "Reported Fatigue",
    currentValue: "Moderate",
    previousValue: "Mild",
    unit: "",
    trend: "up",
    riskLevel: "watch",
    timestamp: "2026-09-29T10:30:00",
    explanation: "Patient self-reported increased fatigue over the past week, consistent with declining sleep quality and potential glycemic fluctuations.",
  },
  {
    id: "act-steps",
    type: "activity",
    label: "Daily Steps",
    currentValue: "3,200",
    previousValue: "6,800",
    unit: "steps/day",
    trend: "down",
    riskLevel: "elevated",
    timestamp: "2026-09-30T00:00:00",
    explanation: "Physical activity has dropped significantly. This 53% decrease in average daily steps aligns with reported fatigue and may contribute to metabolic changes.",
  },
];

export const DEMO_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "te-1",
    date: "2026-09-30",
    type: "visit",
    title: "Routine check-up",
    description: "BP recorded 148/92 mmHg, HR 82 bpm. Patient reports increased fatigue.",
    source: "Clinic visit note (simulated)",
    sourceType: "extracted",
    details: { "Provider": "Dr. Ananya Rao (simulated)", "Facility": "City Health Centre" },
  },
  {
    id: "te-2",
    date: "2026-09-28",
    type: "lab",
    title: "HbA1c Test Result",
    description: "HbA1c: 7.2% (previously 6.8%). Fasting glucose: 142 mg/dL.",
    source: "Lab report PDF (simulated)",
    sourceType: "extracted",
    details: { "Lab": "Central Diagnostics (simulated)", "Report ID": "LAB-2026-09281" },
  },
  {
    id: "te-3",
    date: "2026-09-15",
    type: "medication",
    title: "Prescription Renewal",
    description: "Metformin 500mg BD, Amlodipine 5mg OD renewed. No dosage change.",
    source: "Prescription (simulated)",
    sourceType: "extracted",
  },
  {
    id: "te-4",
    date: "2026-08-20",
    type: "diagnosis",
    title: "Annual Health Review",
    description: "Type 2 Diabetes — well-controlled. Mild hypertension — managed with current medication. No new diagnoses.",
    source: "Annual review summary (simulated)",
    sourceType: "extracted",
  },
  {
    id: "te-5",
    date: "2026-07-10",
    type: "lab",
    title: "Lipid Panel",
    description: "Total cholesterol 210 mg/dL, LDL 130 mg/dL, HDL 48 mg/dL. Borderline high.",
    source: "Lab report (simulated)",
    sourceType: "extracted",
  },
  {
    id: "te-6",
    date: "2026-06-01",
    type: "visit",
    title: "Follow-up Consultation",
    description: "BP 128/82 mmHg, well-controlled. Patient reported good energy levels and regular exercise.",
    source: "Visit note (simulated)",
    sourceType: "extracted",
  },
  {
    id: "te-7",
    date: "2026-04-15",
    type: "symptom",
    title: "Mild headaches reported",
    description: "Patient reported occasional mild headaches over past 2 weeks. Attributed to work stress. No intervention recommended.",
    source: "Patient self-report (simulated)",
    sourceType: "user_reported",
  },
  {
    id: "te-8",
    date: "2026-03-01",
    type: "lab",
    title: "HbA1c Baseline",
    description: "HbA1c: 6.8%. Fasting glucose: 118 mg/dL. Glycemic control satisfactory.",
    source: "Lab report (simulated)",
    sourceType: "extracted",
  },
];

export const DEMO_CARE_PATHWAY: CarePathwayStep[] = [
  { id: "cp-1", step: 1, title: "Intent Understood", description: "Patient needs review of rising blood pressure and declining medication adherence.", status: "completed" },
  { id: "cp-2", step: 2, title: "Urgency Assessed", description: "Category: SOON — Not an emergency, but requires timely follow-up within 1 week.", status: "completed" },
  { id: "cp-3", step: 3, title: "Care Type Identified", description: "Primary care consultation recommended. May also benefit from a diabetes educator review.", status: "completed" },
  { id: "cp-4", step: 4, title: "Options Found", description: "Available: Dr. Ananya Rao (2 days), City Health Centre walk-in (tomorrow). Teleconsultation available.", status: "current" },
  { id: "cp-5", step: 5, title: "Patient Summary Prepared", description: "Compiled health timeline, current vitals, medication history and recent lab results for clinician review.", status: "upcoming" },
  { id: "cp-6", step: 6, title: "Follow-up Scheduled", description: "Reminder to be set for 7 days post-consultation to check updated vitals and adherence.", status: "upcoming" },
];

export const DEMO_AGENT_TRACE: AgentTraceStep[] = [
  { id: "at-1", label: "User Request", description: "\"My blood pressure seems high and I've been feeling tired lately.\"", status: "completed", timestamp: "09:15:02" },
  { id: "at-2", label: "Intent Detected", description: "Health concern — elevated vitals + fatigue symptom. Multi-signal pattern.", status: "completed", timestamp: "09:15:03" },
  { id: "at-3", label: "Agent Selected", description: "CarePulse (early warning) — significant change detected across BP, adherence, and activity signals.", status: "completed", timestamp: "09:15:03" },
  { id: "at-4", label: "Tools Used", description: "Vital trend analysis, medication adherence tracker, sleep/activity correlation, lab history comparison.", status: "completed", timestamp: "09:15:04" },
  { id: "at-5", label: "Evidence Retrieved", description: "3 recent lab reports, 30-day adherence log, 14-day vital trend, patient baseline from August review.", status: "completed", timestamp: "09:15:05" },
  { id: "at-6", label: "Safety Checks", description: "✓ No emergency indicators. ✓ All signals within watchable range. ✓ Evidence grounded. ✓ Uncertainty flagged for sleep correlation.", status: "completed", timestamp: "09:15:06" },
  { id: "at-7", label: "Response Generated", description: "Explainable summary with trend analysis, risk signals, and follow-up recommendation.", status: "completed", timestamp: "09:15:07" },
];

export const DEMO_METRICS: DemoMetric[] = [
  { label: "Documents Processed", value: 47, description: "Simulated health documents parsed and structured" },
  { label: "Care Pathways Generated", value: 12, description: "Demo care navigation workflows completed" },
  { label: "Signals Detected", value: 23, description: "Health change indicators identified in demo data" },
  { label: "Agent Workflows", value: 31, description: "Agentic AI workflows executed across all agents" },
];

export const DEMO_SAFETY_CHECKS: SafetyCheck[] = [
  { label: "No autonomous diagnosis claims", status: "passed", detail: "System provides decision-support only, clearly labeling all outputs as AI-generated interpretations." },
  { label: "Emergency escalation guidance", status: "passed", detail: "Emergency indicators trigger immediate guidance to seek professional help. No treatment recommendations are made." },
  { label: "Evidence grounding", status: "passed", detail: "All conclusions reference specific patient data or clinical guidelines. No fabricated medical facts." },
  { label: "Confidence indicators", status: "passed", detail: "Every signal and recommendation includes a confidence level and explanation of uncertainty." },
  { label: "Human approval for high-impact actions", status: "passed", detail: "Care pathway steps requiring action are presented for human review before execution." },
  { label: "Audit logging", status: "passed", detail: "All agent interactions, tool calls, and decisions are logged with timestamps for review." },
  { label: "Clear uncertainty statements", status: "passed", detail: "Where data is incomplete or correlations are uncertain, the system explicitly states limitations." },
  { label: "Simulated data labeling", status: "passed", detail: "All demo data is prominently labeled as synthetic. No real patient data is used." },
];

export const DEMO_EVIDENCE: EvidenceItem[] = [
  { source: "Patient vital log (simulated)", excerpt: "BP readings: 128/82 → 135/87 → 148/92 over 6 weeks", confidence: "high", type: "patient_data" },
  { source: "Medication adherence tracker (simulated)", excerpt: "Adherence declined from 91% to 73% in the last 30 days, with 8 missed doses", confidence: "high", type: "patient_data" },
  { source: "Lab report — HbA1c (simulated)", excerpt: "HbA1c increased from 6.8% to 7.2% over 3 months", confidence: "high", type: "document" },
  { source: "Clinical guideline reference", excerpt: "Sustained systolic BP >140 mmHg warrants clinical reassessment within 1-2 weeks", confidence: "medium", type: "guideline" },
];

export const DEMO_WHY_THIS_ANSWER = {
  evidenceUsed: DEMO_EVIDENCE,
  reasoningSummary: "Multiple correlated signals indicate a decline in health stability: rising blood pressure (20mmHg increase), declining medication adherence (73%), rising HbA1c (7.2%), reduced activity, and patient-reported fatigue. These signals form a coherent pattern suggesting the need for timely clinical review rather than emergency intervention.",
  confidence: "medium" as const,
  missingInformation: [
    "Recent dietary changes not recorded",
    "Stress levels not formally assessed",
    "Sleep quality data limited to duration only",
    "No recent ECG or cardiac assessment on file",
  ],
  safetyConstraints: [
    "This analysis is for decision-support only, not a clinical diagnosis",
    "Emergency indicators were checked and not triggered",
    "Clinician review is recommended before any medication changes",
    "Patient should seek immediate help if experiencing chest pain, severe headache, or vision changes",
  ],
};

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "tcy", label: "Tulu", nativeLabel: "ತುಳು" },
];
