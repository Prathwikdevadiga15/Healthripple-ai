import { motion, useReducedMotion } from "framer-motion";
import { Users, Heart, Target, Lightbulb, HeartPulse } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { DEMO_METRICS } from "@/data/demoData";

export default function About() {
  const reduce = useReducedMotion();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white mx-auto mb-4">
          <HeartPulse size={24} strokeWidth={1.8} />
        </div>
        <h1 className="font-head font-extrabold text-3xl text-navy-900 mb-3">About HealthRipple AI</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Building the future of proactive, explainable, and coordinated healthcare using agentic AI.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.1 }}
        className="card-premium p-8 md:p-12 text-center"
      >
        <Target size={32} className="text-teal mx-auto mb-6" />
        <h2 className="font-head font-bold text-2xl text-navy-900 mb-4">Our Mission</h2>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Healthcare today is fragmented. Doctors lack time, patients lack context, and critical signals are often missed until they become emergencies. Our mission is to transform fragmented health information into a single, cohesive patient story that empowers clinicians and guides patients toward better outcomes.
        </p>
      </motion.div>

      {/* Core Values */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Proactive Over Reactive", icon: Lightbulb, desc: "We detect health trends early, shifting care from reactive treatment to proactive prevention." },
          { title: "Safety by Design", icon: Heart, desc: "We build systems that support, not replace, medical professionals. Safety rules dictate every action." },
          { title: "Radical Transparency", icon: Users, desc: "Every AI decision is explainable, grounded in evidence, and designed to build trust." },
        ].map((value, i) => {
          const Icon = value.icon;
          return (
            <motion.div
              key={value.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.1 }}
              className="card-premium p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                <Icon size={18} className="text-teal" />
              </div>
              <h3 className="font-head font-bold text-base text-navy-900 mb-2">{value.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Impact */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <div className="text-center mb-8">
          <h2 className="font-head font-bold text-2xl text-navy-900 mb-2">Prototype Impact</h2>
          <p className="text-sm text-slate-500">Demonstrating the potential of agentic healthcare workflows</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEMO_METRICS.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Note */}
      <div className="text-center text-xs text-slate-400 bg-slate-50 rounded-xl p-4">
        HealthRipple AI is a prototype that brings medicine-supply intelligence and the Namma Saathi patient-care experience into one product vision. Supply analytics and care-agent journeys are separate demo workflows using synthetic data; Gemini, live patient records and hospital integrations are not currently implemented.
      </div>
    </div>
  );
}
