import { motion, useReducedMotion } from "framer-motion";
import type { CarePathwayStep } from "@/types";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface CarePathwayProps {
  steps: CarePathwayStep[];
}

const statusCfg = {
  completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", line: "bg-emerald-300" },
  current: { icon: Circle, color: "text-teal-500", bg: "bg-teal-50", line: "bg-slate-200" },
  upcoming: { icon: Clock, color: "text-slate-300", bg: "bg-slate-50", line: "bg-slate-100" },
};

export default function CarePathway({ steps }: CarePathwayProps) {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const cfg = statusCfg[step.status];
        const Icon = cfg.icon;
        const isLast = i === steps.length - 1;

        return (
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : i * 0.08 }}
            className="flex gap-4"
          >
            {/* Stepper */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0 ring-2 ring-white`}>
                <Icon size={18} className={cfg.color} strokeWidth={step.status === "current" ? 2.5 : 1.8} />
              </div>
              {!isLast && <div className={`w-[2px] flex-1 min-h-[24px] ${cfg.line}`} />}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-6 ${step.status === "upcoming" ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">STEP {step.step}</span>
                {step.status === "current" && (
                  <span className="text-[9px] font-bold bg-teal-100 text-teal-700 rounded-full px-2 py-0.5 animate-pulse-soft">CURRENT</span>
                )}
              </div>
              <h4 className="font-head font-bold text-sm text-navy-900 mb-1">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              {step.urgency && (
                <span className="inline-flex mt-2 text-[10px] font-bold rounded-full px-2.5 py-0.5 bg-amber-50 text-amber-700 capitalize">
                  {step.urgency}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
