import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HelpCircle, X, CheckCircle2, AlertTriangle, Info, FileText, BookOpen, Database } from "lucide-react";
import type { WhyThisAnswer } from "@/types";

interface EvidenceCardProps {
  data: WhyThisAnswer;
}

const confidenceColors = {
  high: { bg: "bg-emerald-50", text: "text-emerald-700", label: "High Confidence" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", label: "Medium Confidence" },
  low: { bg: "bg-red-50", text: "text-red-700", label: "Low Confidence" },
};

const sourceTypeIcons = {
  document: FileText,
  guideline: BookOpen,
  patient_data: Database,
};

export default function EvidenceCard({ data }: EvidenceCardProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const conf = confidenceColors[data.confidence];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl px-3 py-2 transition-all duration-200"
      >
        <HelpCircle size={14} />
        Why this answer?
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close" />

            <motion.div
              className="relative bg-white rounded-3xl shadow-premium-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin"
              initial={reduce ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.95, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-3xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <HelpCircle size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-head font-bold text-base text-navy-900">Why This Answer?</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Explainable AI · Decision Support</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition" aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Confidence */}
                <div className={`rounded-2xl p-4 ${conf.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${conf.text}`}>Overall: {conf.label}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{data.reasoningSummary}</p>
                </div>

                {/* Evidence Used */}
                <div>
                  <h4 className="font-head font-bold text-sm text-navy-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Evidence Used
                  </h4>
                  <div className="space-y-2">
                    {data.evidenceUsed.map((ev, i) => {
                      const SourceIcon = sourceTypeIcons[ev.type];
                      const evConf = confidenceColors[ev.confidence];
                      return (
                        <div key={i} className="rounded-xl border border-slate-100 p-3 hover:bg-slate-50/50 transition">
                          <div className="flex items-center gap-2 mb-1.5">
                            <SourceIcon size={12} className="text-slate-400" />
                            <span className="text-[11px] font-semibold text-navy-900">{ev.source}</span>
                            <span className={`text-[9px] font-bold rounded-full px-2 py-0.5 ${evConf.bg} ${evConf.text}`}>
                              {ev.confidence}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed pl-5">"{ev.excerpt}"</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Missing Information */}
                <div>
                  <h4 className="font-head font-bold text-sm text-navy-900 mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" /> Missing Information
                  </h4>
                  <ul className="space-y-1.5">
                    {data.missingInformation.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safety Constraints */}
                <div>
                  <h4 className="font-head font-bold text-sm text-navy-900 mb-3 flex items-center gap-2">
                    <Info size={14} className="text-blue-500" /> Safety Constraints
                  </h4>
                  <ul className="space-y-1.5">
                    {data.safetyConstraints.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl bg-amber-50 border border-amber-200/50 p-3 text-[10px] text-amber-700 font-medium text-center">
                  This explanation is AI-generated for decision support. It does not constitute medical advice.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
