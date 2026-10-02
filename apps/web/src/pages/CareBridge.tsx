import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, FileUp, ArrowLeftRight, FileText, CheckCircle2, AlertTriangle, Sparkles, Info } from "lucide-react";
import SafetyBanner from "@/components/SafetyBanner";
import HealthTimeline from "@/components/HealthTimeline";
import EvidenceCard from "@/components/EvidenceCard";
import { DEMO_TIMELINE_EVENTS, DEMO_WHY_THIS_ANSWER } from "@/data/demoData";

const WHAT_CHANGED = [
  { metric: "Blood Pressure", previous: "128/82 mmHg", current: "148/92 mmHg", change: "+20/+10", status: "elevated" as const },
  { metric: "HbA1c", previous: "6.8%", current: "7.2%", change: "+0.4%", status: "watch" as const },
  { metric: "Medication Adherence", previous: "91%", current: "73%", change: "-18%", status: "elevated" as const },
  { metric: "Daily Steps", previous: "6,800", current: "3,200", change: "-53%", status: "elevated" as const },
  { metric: "Sleep Quality", previous: "7.1 hrs", current: "5.2 hrs", change: "-1.9 hrs", status: "watch" as const },
  { metric: "Fatigue Level", previous: "Mild", current: "Moderate", change: "Increased", status: "watch" as const },
];

const statusStyles = {
  normal: "bg-emerald-50 text-emerald-700",
  watch: "bg-amber-50 text-amber-700",
  elevated: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700",
};

export default function CareBridge() {
  const reduce = useReducedMotion();
  const [showTimeline, setShowTimeline] = useState(true);
  const [uploadState, setUploadState] = useState<"idle" | "processing" | "done">("idle");

  const handleUpload = () => {
    setUploadState("processing");
    setTimeout(() => setUploadState("done"), 2000);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal to-teal-700 flex items-center justify-center text-white">
            <BookOpen size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-head font-extrabold text-2xl text-navy-900">CareBridge</h1>
            <p className="text-xs text-slate-400">Longitudinal Patient Story Agent · Health Timeline</p>
          </div>
        </div>
      </motion.div>

      <SafetyBanner />

      {/* Upload Area */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.05 }}
        className="card-premium p-6"
      >
        <h3 className="font-head font-bold text-base text-navy-900 mb-2">Upload Health Documents</h3>
        <p className="text-xs text-slate-400 mb-4">Upload PDFs, prescriptions, lab reports, discharge summaries, or enter text. The system will extract and structure the information.</p>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleUpload}
            className="border-2 border-dashed border-slate-200 hover:border-teal-300 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all duration-300 hover:bg-teal-50/30 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
              <FileUp size={22} className="text-slate-400 group-hover:text-teal transition-colors" />
            </div>
            <span className="text-sm font-semibold text-navy-900">Drop files here or click to upload</span>
            <span className="text-[10px] text-slate-400">PDF, images, text files</span>
          </button>

          <div className="bg-slate-50 rounded-2xl p-6">
            <h4 className="font-head font-bold text-xs text-navy-900 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-teal" /> Accepted Inputs
            </h4>
            <div className="space-y-2">
              {["PDF reports & prescriptions", "Lab results & discharge summaries", "Medical images (where supported)", "Voice notes & structured health data", "Text descriptions of symptoms"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[11px] text-slate-600">
                  <CheckCircle2 size={10} className="text-teal shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing state */}
        {uploadState === "processing" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-teal-50 border border-teal-200/50 flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full border-2 border-teal border-t-transparent animate-spin" />
            <div>
              <span className="text-xs font-bold text-teal-700">Processing documents...</span>
              <p className="text-[10px] text-teal-600">Extracting dates, diagnoses, medications, and investigations</p>
            </div>
          </motion.div>
        )}
        {uploadState === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200/50 flex items-center gap-3"
          >
            <CheckCircle2 size={18} className="text-emerald-500" />
            <div>
              <span className="text-xs font-bold text-emerald-700">Documents processed successfully</span>
              <p className="text-[10px] text-emerald-600">{DEMO_TIMELINE_EVENTS.length} events extracted · Timeline updated (simulated)</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* What Changed? */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.1 }}
        className="card-premium overflow-hidden"
      >
        <div className="px-5 py-4 bg-gradient-to-r from-primary-50 to-teal-50 border-b border-slate-100 flex items-center gap-3">
          <ArrowLeftRight size={16} className="text-primary" />
          <h3 className="font-head font-bold text-sm text-navy-900">What Changed?</h3>
          <span className="text-[9px] font-bold bg-white/80 text-slate-500 rounded-full px-2 py-0.5">Previous vs Current</span>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Metric</th>
                  <th className="text-left py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Previous</th>
                  <th className="text-left py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Current</th>
                  <th className="text-left py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Change</th>
                  <th className="text-left py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {WHAT_CHANGED.map((row) => (
                  <tr key={row.metric} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-3 font-medium text-xs text-navy-900">{row.metric}</td>
                    <td className="py-3 text-xs text-slate-500">{row.previous}</td>
                    <td className="py-3 text-xs font-semibold text-navy-900">{row.current}</td>
                    <td className="py-3 text-xs font-bold text-orange-600">{row.change}</td>
                    <td className="py-3">
                      <span className={`text-[9px] font-bold rounded-full px-2 py-0.5 capitalize ${statusStyles[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Clinician Review */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.15 }}
        className="card-premium p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="font-head font-bold text-sm text-navy-900">What Should the Clinician Review?</h3>
        </div>
        <div className="space-y-3 mb-4">
          {[
            "Significant blood pressure increase (+20 mmHg systolic) — consider medication review or lifestyle factors",
            "Declining medication adherence (73%) — explore barriers and consider adherence support strategies",
            "Rising HbA1c (6.8% → 7.2%) — correlated with adherence drop; glycemic management may need adjustment",
            "Reduced physical activity and increased fatigue — assess for underlying causes",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100/50">
              <span className="text-xs font-bold text-amber-500 shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <EvidenceCard data={DEMO_WHY_THIS_ANSWER} />
          <span className="text-[9px] font-bold tracking-widest text-amber-600 bg-amber-50 rounded-full px-3 py-1 uppercase">
            AI-Generated Review Points · Not a Diagnosis
          </span>
        </div>
      </motion.div>

      {/* Patient Timeline */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-head font-bold text-lg text-navy-900">Patient Timeline</h2>
            <p className="text-xs text-slate-400">Chronological health events · All data simulated</p>
          </div>
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-xs font-semibold text-teal hover:text-teal-700 transition"
          >
            {showTimeline ? "Collapse" : "Expand"} Timeline
          </button>
        </div>

        {showTimeline && <HealthTimeline events={DEMO_TIMELINE_EVENTS} />}
      </motion.div>

      {/* Source Legend */}
      <div className="card-premium p-4 flex flex-wrap items-center gap-4 text-[10px]">
        <span className="font-bold text-slate-400 uppercase tracking-wider">Source Legend:</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Extracted from document</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> AI Interpreted</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Self-Reported</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Missing / Unavailable</span>
      </div>
    </div>
  );
}
