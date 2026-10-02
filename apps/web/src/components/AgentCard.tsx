import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { AgentType } from "@/types";

interface AgentCardProps {
  agent: AgentType;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  features: string[];
  color: "blue" | "teal" | "amber";
  index?: number;
}

const colorMap = {
  blue: {
    bg: "bg-primary-50",
    border: "border-primary-200/50",
    iconBg: "bg-gradient-to-br from-primary to-primary-700",
    accent: "text-primary",
    badge: "bg-primary-100 text-primary-700",
    hoverBorder: "hover:border-primary-300",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200/50",
    iconBg: "bg-gradient-to-br from-teal to-teal-700",
    accent: "text-teal-700",
    badge: "bg-teal-100 text-teal-700",
    hoverBorder: "hover:border-teal-300",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200/50",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
    accent: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    hoverBorder: "hover:border-amber-300",
  },
};

export default function AgentCard({ title, description, icon: Icon, path, features, color, index = 0 }: AgentCardProps) {
  const reduce = useReducedMotion();
  const c = colorMap[color];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : index * 0.1 }}
    >
      <Link
        to={path}
        className={`group block card-premium p-6 border ${c.border} ${c.hoverBorder} transition-all duration-300 no-underline`}
      >
        {/* Top accent */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl ${c.iconBg}`} />

        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl ${c.iconBg} flex items-center justify-center text-white mb-4`}>
          <Icon size={22} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h3 className="font-head font-bold text-lg text-navy-900 mb-2 group-hover:text-gradient transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          {description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-5">
          {features.map((feature) => (
            <span key={feature} className={`text-[10px] font-bold rounded-full px-2.5 py-1 ${c.badge}`}>
              {feature}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className={`flex items-center gap-2 text-sm font-semibold ${c.accent} group-hover:gap-3 transition-all duration-300`}>
          Explore <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
