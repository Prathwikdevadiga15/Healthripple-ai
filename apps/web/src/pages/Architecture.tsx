import { motion, useReducedMotion } from "framer-motion";
import { Server, Database, Brain, Activity, Shield, Link, ArrowDown, User, Layers } from "lucide-react";

const SYSTEM_LAYERS = [
  {
    title: "1. Multimodal Input Layer",
    icon: User,
    color: "from-blue-500 to-indigo-600",
    description: "Accepts diverse patient data inputs including text, voice, PDF documents, lab reports, and medical images.",
    components: ["Voice Processing", "Document OCR", "FHIR Data Ingestion"],
  },
  {
    title: "2. HealthRipple Care Orchestrator · Demo",
    icon: Brain,
    color: "from-teal-500 to-emerald-600",
    description: "Prototype workflows illustrate request routing and agent selection. A Gemini model is not currently connected.",
    components: ["Simulated Intent Routing", "Demo Agent Selection", "Gemini Integration: Planned"],
  },
  {
    title: "3. Seven-Agent Care Layer",
    icon: Layers,
    color: "from-primary to-primary-700",
    description: "One connected experience routes between three flagship care agents and four focused support agents. Patient-care journeys use synthetic data and predefined demo responses.",
    components: ["CarePulse · CareBridge · CareAccess", "MedGuide · CareLocate", "ReportLens · HealthLearn"],
  },
  {
    title: "4. Knowledge & Data Layer",
    icon: Database,
    color: "from-amber-500 to-orange-600",
    description: "The current prototype uses synthetic platform data. Clinical RAG, patient-record storage and interoperability connections remain future work.",
    components: ["Synthetic Demo Data", "Clinical RAG: Planned", "FHIR Integration: Planned"],
  },
  {
    title: "5. Safety & Oversight Engine",
    icon: Shield,
    color: "from-red-500 to-rose-600",
    description: "Safety guidance is shown in the demo experience; this prototype is not a clinical decision system and does not perform real-world approvals or audit logging.",
    components: ["Safety Guidance (Demo)", "Human Review Required", "Audit Logging: Planned"],
  },
];

export default function Architecture() {
  const reduce = useReducedMotion();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-navy-900 flex items-center justify-center text-white mx-auto mb-4">
          <Server size={24} strokeWidth={1.8} />
        </div>
        <h1 className="font-head font-extrabold text-3xl text-navy-900 mb-3">Technical Architecture</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          HealthRipple AI combines implemented medicine-supply analytics with a simulated Namma Saathi patient-care experience. The diagram distinguishes prototype workflows from integrations that are not yet built.
        </p>
      </motion.div>

      {/* Architecture Diagram */}
      <div className="relative">
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 md:-translate-x-1/2" />

        {SYSTEM_LAYERS.map((layer, i) => {
          const Icon = layer.icon;
          const isEven = i % 2 === 0;

          return (
            <motion.div
              key={layer.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 mb-12 last:mb-0 ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Node */}
              <div className="absolute left-0 md:left-1/2 w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center md:-translate-x-1/2 z-10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center text-white`}>
                  <Icon size={18} />
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block flex-1" />

              {/* Content Card */}
              <div className="flex-1 ml-20 md:ml-0 card-premium p-6 w-full md:w-[calc(50%-3rem)]">
                <h3 className="font-head font-bold text-base text-navy-900 mb-2">{layer.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{layer.description}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.components.map((comp) => (
                    <span key={comp} className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
