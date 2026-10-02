import { motion, useReducedMotion } from "framer-motion";
import type { HealthSignal } from "@/types";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

interface RiskSignalProps {
  signal: HealthSignal;
  index?: number;
}

const riskStyles = {
  normal: { bg: "bg-emerald-50", border: "border-emerald-200/50", text: "text-emerald-700", badge: "badge-normal", label: "Normal" },
  watch: { bg: "bg-amber-50", border: "border-amber-200/50", text: "text-amber-700", badge: "badge-watch", label: "Watch" },
  elevated: { bg: "bg-orange-50", border: "border-orange-200/50", text: "text-orange-700", badge: "badge-elevated", label: "Elevated" },
  critical: { bg: "bg-red-50", border: "border-red-200/50", text: "text-red-700", badge: "badge-critical", label: "Critical" },
};

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export default function RiskSignal({ signal, index = 0 }: RiskSignalProps) {
  const reduce = useReducedMotion();
  const style = riskStyles[signal.riskLevel];
  const TrendIcon = trendIcon[signal.trend];
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : index * 0.06 }}
      className={`rounded-2xl border ${style.border} bg-white p-4 hover:shadow-premium transition-all duration-300`}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-navy-900">{signal.label}</span>
            <span className={style.badge}>{style.label}</span>
          </div>
          <span className="text-[10px] text-slate-400 capitalize">{signal.type} signal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendIcon size={14} className={style.text} />
        </div>
      </div>

      {/* Values */}
      <div className="flex items-end gap-3 mb-3">
        <span className="font-head font-bold text-2xl text-navy-900">{signal.currentValue}</span>
        {signal.unit && <span className="text-xs text-slate-400 pb-1">{signal.unit}</span>}
      </div>

      {/* Previous */}
      {signal.previousValue && (
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-slate-400">Previously:</span>
          <span className="font-semibold text-slate-600">{signal.previousValue} {signal.unit}</span>
        </div>
      )}

      {/* Explanation toggle */}
      {signal.explanation && (
        <>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition"
          >
            <Info size={12} />
            {showExplanation ? "Hide" : "Why this signal?"}
          </button>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <p className="text-[11px] text-slate-600 leading-relaxed">{signal.explanation}</p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
