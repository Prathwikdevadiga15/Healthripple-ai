import { motion, useReducedMotion } from "framer-motion";
import type { DemoMetric } from "@/types";

interface MetricCardProps {
  metric: DemoMetric;
  index?: number;
}

export default function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : index * 0.08 }}
      className="card-premium p-6 text-center group"
    >
      <div className="font-head font-bold text-4xl text-gradient mb-2 group-hover:scale-105 transition-transform duration-300">
        {metric.value}{metric.suffix || ""}
      </div>
      <div className="font-head font-semibold text-sm text-navy-900 mb-1">{metric.label}</div>
      <p className="text-[11px] text-slate-400 leading-relaxed">{metric.description}</p>
      <span className="inline-block mt-3 text-[8px] font-bold tracking-widest text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 uppercase">
        Prototype / Demo
      </span>
    </motion.div>
  );
}
