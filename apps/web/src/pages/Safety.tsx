import { motion, useReducedMotion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck, Brain, Globe, HelpCircle, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { DEMO_SAFETY_CHECKS } from "@/data/demoData";

const SECTIONS = [
  {
    title: "Privacy",
    icon: Lock,
    description: "Patient data is treated with the highest sensitivity. In the prototype, all data is synthetic. In a production system, data would be encrypted at rest and in transit, with strict access controls.",
    items: ["No real patient data is used in this prototype", "Designed for HIPAA-compatible workflows", "Data minimization principles applied", "No data shared with third parties"],
  },
  {
    title: "Safety",
    icon: Shield,
    description: "The system implements deterministic safety rules that operate independently of the AI model. These rules ensure that no high-impact clinical decision can be made autonomously.",
    items: ["Deterministic safety rules for emergency detection", "Evidence grounding requirement for all outputs", "Confidence thresholds for recommendations", "Automatic escalation for high-risk indicators"],
  },
  {
    title: "Human Oversight",
    icon: Eye,
    description: "Every care pathway and clinical recommendation is designed to be reviewed by a qualified healthcare professional before any action is taken.",
    items: ["Clinician review gate for all care actions", "Patient approval required for data sharing", "Human-in-the-loop for medication-related suggestions", "Override capabilities for healthcare providers"],
  },
  {
    title: "Evidence Grounding",
    icon: FileCheck,
    description: "All AI-generated insights reference specific patient data, clinical guidelines, or documented medical information. No medical facts are fabricated.",
    items: ["Source attribution for all extracted information", "Confidence levels on every AI interpretation", "Clear distinction between facts and AI analysis", "No fabrication of medical information"],
  },
  {
    title: "Explainability",
    icon: Brain,
    description: "The 'Why This Answer?' feature provides transparent reasoning for every AI output, including evidence used, missing information, and safety constraints applied.",
    items: ["\"Why This Answer?\" available on all responses", "Evidence trail visible to users", "Reasoning summary in plain language", "Agent trace showing the complete workflow"],
  },
  {
    title: "Interoperability",
    icon: Globe,
    description: "Data models are designed to be FHIR-compatible, supporting future integration with healthcare systems. No real hospital integration is claimed in this prototype.",
    items: ["FHIR-compatible data model design", "Standard medical coding where applicable", "API-first architecture for integration", "Designed for healthcare ecosystem compatibility"],
  },
  {
    title: "Uncertainty",
    icon: HelpCircle,
    description: "The system explicitly communicates what it knows, what it doesn't know, and where information is missing or uncertain.",
    items: ["Clear uncertainty statements on all outputs", "Missing information explicitly flagged", "Confidence levels: High / Medium / Low", "\"Cannot determine\" responses when appropriate"],
  },
  {
    title: "Auditability",
    icon: ClipboardCheck,
    description: "Every agent interaction, tool call, decision, and safety check is logged with timestamps, creating a complete audit trail.",
    items: ["Timestamped audit log for all interactions", "Agent trace records for every workflow", "Safety check results logged", "Tool usage and evidence retrieval tracked"],
  },
];

export default function Safety() {
  const reduce = useReducedMotion();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal flex items-center justify-center text-white">
            <Shield size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-head font-extrabold text-2xl text-navy-900">Safety & Responsible AI</h1>
            <p className="text-xs text-slate-400">How we design for trust, safety, and transparency</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
          Namma Saathi Health is decision-support software — not an autonomous medical diagnosis system. Every component is designed with deterministic safety rules, evidence grounding, and human oversight to ensure that an LLM alone never makes high-impact clinical decisions.
        </p>
      </motion.div>

      {/* Safety Checklist */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.05 }}
        className="card-premium p-6"
      >
        <h2 className="font-head font-bold text-base text-navy-900 mb-4">Safety Checklist</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {DEMO_SAFETY_CHECKS.map((check) => (
            <div key={check.label} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-navy-900 mb-0.5">{check.label}</div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {SECTIONS.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.05 }}
              className="card-premium p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Icon size={16} className="text-teal" />
                </div>
                <h3 className="font-head font-bold text-base text-navy-900">{section.title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{section.description}</p>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={10} className="text-teal mt-1 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Permanent Disclaimer */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-3xl p-8 text-center"
      >
        <Shield size={32} className="text-amber-600 mx-auto mb-4" />
        <h3 className="font-head font-bold text-xl text-amber-800 mb-2">Important Disclaimer</h3>
        <p className="text-sm text-amber-700 leading-relaxed max-w-2xl mx-auto">
          Prototype for decision support and education. Not a substitute for professional medical diagnosis or treatment. All data shown is simulated for demonstration purposes. No real patient outcomes are claimed. Always consult qualified healthcare professionals for medical decisions.
        </p>
      </motion.div>
    </div>
  );
}
