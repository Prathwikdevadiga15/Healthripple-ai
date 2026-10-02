import { motion, useReducedMotion } from "framer-motion";
import type { TimelineEvent } from "@/types";
import {
  Stethoscope,
  Pill,
  FlaskConical,
  Activity,
  CalendarCheck,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";

interface HealthTimelineProps {
  events: TimelineEvent[];
}

const typeConfig: Record<TimelineEvent["type"], { icon: typeof Stethoscope; color: string; bg: string }> = {
  diagnosis: { icon: Stethoscope, color: "text-purple-600", bg: "bg-purple-50" },
  medication: { icon: Pill, color: "text-blue-600", bg: "bg-blue-50" },
  lab: { icon: FlaskConical, color: "text-teal-600", bg: "bg-teal-50" },
  procedure: { icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
  visit: { icon: CalendarCheck, color: "text-primary", bg: "bg-primary-50" },
  symptom: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  discharge: { icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
};

const sourceTypeBadge = {
  extracted: { label: "Extracted", color: "bg-emerald-50 text-emerald-700" },
  ai_interpreted: { label: "AI Interpreted", color: "bg-blue-50 text-blue-700" },
  user_reported: { label: "Self-Reported", color: "bg-amber-50 text-amber-700" },
};

export default function HealthTimeline({ events }: HealthTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-teal-200 via-slate-200 to-slate-100" />

      {events.map((event, i) => {
        const cfg = typeConfig[event.type];
        const Icon = cfg.icon;
        const badge = sourceTypeBadge[event.sourceType];
        return (
          <motion.div
            key={event.id}
            initial={reduce ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.06 }}
            className="relative flex gap-4 md:gap-6 pb-8 last:pb-0"
          >
            {/* Node */}
            <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0 ring-4 ring-white`}>
              <Icon size={20} className={cfg.color} strokeWidth={1.8} />
            </div>

            {/* Card */}
            <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-premium transition-shadow duration-300">
              {/* Date + Source Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <time className="text-xs font-semibold text-slate-400">{event.date}</time>
                <span className={`text-[9px] font-bold rounded-full px-2 py-0.5 ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-head font-bold text-sm text-navy-900 mb-1">{event.title}</h4>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed mb-2">{event.description}</p>

              {/* Source */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Info size={10} />
                <span>Source: {event.source}</span>
              </div>

              {/* Details */}
              {event.details && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-3">
                  {Object.entries(event.details).map(([key, val]) => (
                    <div key={key} className="text-[10px]">
                      <span className="text-slate-400 font-medium">{key}: </span>
                      <span className="text-slate-600 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
