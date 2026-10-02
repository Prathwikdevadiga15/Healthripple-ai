import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, Send, Mic, CheckCircle2, Clock, AlertTriangle, MapPin, Phone, Globe } from "lucide-react";
import SafetyBanner from "@/components/SafetyBanner";
import CarePathway from "@/components/CarePathway";
import AgentTrace from "@/components/AgentTrace";
import { DEMO_CARE_PATHWAY, SUPPORTED_LANGUAGES } from "@/data/demoData";
import type { AgentTraceStep } from "@/types";

const CAREACCESS_TRACE: AgentTraceStep[] = [
  { id: "ca-1", label: "Request Received", description: "\"I need to see a doctor about my diabetes management.\"", status: "completed", timestamp: "09:20:01" },
  { id: "ca-2", label: "Intent Understood", description: "Care navigation request — diabetes management follow-up", status: "completed", timestamp: "09:20:02" },
  { id: "ca-3", label: "Information Collected", description: "Patient history, current medications, recent lab results, and preferences gathered", status: "completed", timestamp: "09:20:03" },
  { id: "ca-4", label: "Urgency Category", description: "SOON — Requires timely follow-up within 1 week (not emergency)", status: "completed", timestamp: "09:20:04" },
  { id: "ca-5", label: "Care Type Identified", description: "Primary care consultation + diabetes educator review recommended", status: "completed", timestamp: "09:20:04" },
  { id: "ca-6", label: "Options Found", description: "3 available options matched to patient's location and preferences", status: "completed", timestamp: "09:20:05" },
  { id: "ca-7", label: "Pathway Created", description: "Complete care pathway with preparation steps and follow-up", status: "completed", timestamp: "09:20:06" },
];

const CARE_OPTIONS = [
  {
    name: "Dr. Ananya Rao",
    type: "Primary Care Physician",
    availability: "Available in 2 days",
    distance: "3.2 km",
    facility: "City Health Centre (simulated)",
    languages: ["English", "Kannada"],
  },
  {
    name: "City Health Centre Walk-in",
    type: "Walk-in Clinic",
    availability: "Available tomorrow, 9AM-5PM",
    distance: "3.2 km",
    facility: "City Health Centre (simulated)",
    languages: ["English", "Kannada", "Hindi"],
  },
  {
    name: "Teleconsultation",
    type: "Virtual Consultation",
    availability: "Available today, next slot: 4PM",
    distance: "Remote",
    facility: "Namma Saathi Telehealth (simulated)",
    languages: ["English", "Hindi", "Kannada", "Tamil"],
  },
];

export default function CareAccess() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [showPathway, setShowPathway] = useState(true);
  const [showTrace, setShowTrace] = useState(true);
  const [selectedLang, setSelectedLang] = useState("en");

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white">
            <Compass size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-head font-extrabold text-2xl text-navy-900">CareAccess</h1>
            <p className="text-xs text-slate-400">AI Care Pathway Agent · Coordinated Next Steps</p>
          </div>
        </div>
      </motion.div>

      <SafetyBanner />

      {/* Language Selector */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.05 }}
        className="card-premium p-4 flex items-center gap-4 flex-wrap"
      >
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-teal" />
          <span className="text-xs font-bold text-navy-900">Language:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`text-[11px] font-semibold rounded-xl px-3 py-1.5 transition-all duration-200 ${
                selectedLang === lang.code
                  ? "bg-teal text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {lang.nativeLabel} ({lang.label})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.1 }}
        className="card-premium p-6"
      >
        <h3 className="font-head font-bold text-base text-navy-900 mb-2">What care do you need?</h3>
        <p className="text-xs text-slate-400 mb-4">Describe your needs in any supported language. The agent will understand intent, assess urgency, and create a care pathway.</p>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., I need to see a doctor about my diabetes management..."
            className="input-premium !pr-24 !py-4"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-teal hover:bg-teal-50 transition" title="Voice input">
              <Mic size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white hover:shadow-lg transition" title="Send">
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {["Find a nearby doctor", "Book a teleconsultation", "Diabetes check-up", "Get a second opinion"].map((action) => (
            <button
              key={action}
              onClick={() => setQuery(action)}
              className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-teal-50 hover:text-teal rounded-xl px-3 py-2 transition"
            >
              {action}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Agent Trace */}
      {showTrace && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: 0.15 }}
        >
          <AgentTrace steps={CAREACCESS_TRACE} title="CareAccess Agent Trace" />
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Care Pathway */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: 0.2 }}
          className="card-premium p-6"
        >
          <h3 className="font-head font-bold text-base text-navy-900 mb-1">Care Pathway</h3>
          <p className="text-xs text-slate-400 mb-5">Step-by-step care coordination · Simulated</p>
          <CarePathway steps={DEMO_CARE_PATHWAY} />
        </motion.div>

        {/* Care Options */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: 0.25 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-head font-bold text-base text-navy-900 mb-1">Available Care Options</h3>
            <p className="text-xs text-slate-400 mb-4">Matched to your needs · All data simulated</p>
          </div>

          {CARE_OPTIONS.map((option, i) => (
            <motion.div
              key={option.name}
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.3 + i * 0.1 }}
              className="card-premium p-5 hover:shadow-premium-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-head font-bold text-sm text-navy-900">{option.name}</h4>
                  <p className="text-[10px] text-slate-400">{option.type}</p>
                </div>
                <span className="badge-info text-[9px]">{option.distance}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock size={12} className="text-teal shrink-0" />
                  <span>{option.availability}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin size={12} className="text-teal shrink-0" />
                  <span>{option.facility}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Globe size={12} className="text-teal shrink-0" />
                  <span>{option.languages.join(", ")}</span>
                </div>
              </div>

              <button className="w-full btn-secondary !text-xs !py-2.5 !rounded-xl">
                Select This Option (Demo)
              </button>
            </motion.div>
          ))}

          <div className="text-center">
            <span className="text-[9px] font-bold tracking-widest text-amber-600 bg-amber-50 rounded-full px-3 py-1 uppercase">
              Simulated Options · Not Real Bookings
            </span>
          </div>
        </motion.div>
      </div>

      {/* Emergency Notice */}
      <div className="card-premium p-5 bg-red-50 border-red-200/50">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-head font-bold text-sm text-red-700 mb-1">Emergency Guidance</h4>
            <p className="text-xs text-red-600 leading-relaxed">
              If you are experiencing a medical emergency — such as chest pain, difficulty breathing, severe bleeding, loss of consciousness, or stroke symptoms — <strong>call emergency services immediately (112 in India)</strong>. Do not use this platform for emergency medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
