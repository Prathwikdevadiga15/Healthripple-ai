import { motion, useReducedMotion } from "framer-motion";
import type { AgentTraceStep } from "@/types";
import { CheckCircle2, Loader2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface AgentTraceProps {
  steps: AgentTraceStep[];
  title?: string;
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", ring: "ring-emerald-200" },
  active: { icon: Loader2, color: "text-teal-500", bg: "bg-teal-50", ring: "ring-teal-200" },
  pending: { icon: Clock, color: "text-slate-300", bg: "bg-slate-50", ring: "ring-slate-200" },
};

export default function AgentTrace({ steps, title = "Agent Trace" }: AgentTraceProps) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card-premium overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse-soft" />
          <h3 className="font-head font-bold text-sm text-navy-900">{title}</h3>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Real-time Workflow</span>
        </div>
        {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {/* Steps */}
      {expanded && (
        <div className="p-5">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-100" />

            {steps.map((step, i) => {
              const cfg = statusConfig[step.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.12 }}
                  className="relative flex gap-4 pb-5 last:pb-0"
                >
                  {/* Icon */}
                  <div className={`relative z-10 w-8 h-8 rounded-xl ${cfg.bg} ring-2 ${cfg.ring} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className={`${cfg.color} ${step.status === "active" ? "animate-spin" : ""}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-navy-900">{step.label}</span>
                      {step.timestamp && (
                        <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                    {step.details && (
                      <p className="mt-1 text-[11px] text-slate-400 italic">{step.details}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
