import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Compass,
  FileUp,
  Image,
  Mic,
  Send,
  Sparkles,
  Brain,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import SafetyBanner from "@/components/SafetyBanner";
import AgentTrace from "@/components/AgentTrace";
import EvidenceCard from "@/components/EvidenceCard";
import { DEMO_AGENT_TRACE, DEMO_WHY_THIS_ANSWER } from "@/data/demoData";

const DEMO_SCENARIOS = [
  {
    id: "scenario-1",
    title: "Health Report Analysis",
    description: "Upload previous and current health reports to see the patient timeline, detected changes, and care review recommendations.",
    agent: "CareBridge",
    icon: BookOpen,
    color: "teal",
    query: "Analyze my latest blood test results compared to last month.",
  },
  {
    id: "scenario-2",
    title: "Voice Health Query",
    description: "Ask a healthcare question using voice to see transcription, intent detection, agent selection, and evidence-grounded response.",
    agent: "CarePulse",
    icon: Activity,
    color: "blue",
    query: "My blood pressure seems high and I've been feeling tired lately.",
  },
  {
    id: "scenario-3",
    title: "Care Navigation",
    description: "Ask for care pathway assistance to see intent understanding, urgency screening, and coordinated next steps.",
    agent: "CareAccess",
    icon: Compass,
    color: "amber",
    query: "I need to see a doctor about my diabetes management. What are my options?",
  },
];

export default function CommandCenter() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleDemo = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setQuery(scenario.query);
    setActiveDemo(scenario.id);
    setShowTrace(false);
    setShowResponse(false);
    // Simulate agentic workflow
    setTimeout(() => setShowTrace(true), 500);
    setTimeout(() => setShowResponse(true), 2000);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    setActiveDemo("custom");
    setShowTrace(false);
    setShowResponse(false);
    setTimeout(() => setShowTrace(true), 500);
    setTimeout(() => setShowResponse(true), 2000);
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white">
            <Brain size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-head font-extrabold text-2xl text-navy-900">AI Care Center</h1>
            <p className="text-xs text-slate-400">HealthRipple Care Orchestrator · Simulated agent workflow</p>
          </div>
        </div>
      </motion.div>

      <SafetyBanner />

      {/* Main Input */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.1 }}
        className="card-premium p-6"
      >
        <h2 className="font-head font-bold text-lg text-navy-900 mb-1">How can I help with your care?</h2>
        <p className="text-xs text-slate-400 mb-5">Type, speak, or upload — the orchestrator will route to the right agent.</p>

        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Describe your health concern or question..."
            className="input-premium !pr-36 !py-4"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-teal hover:bg-teal-50 transition" title="Voice input">
              <Mic size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-teal hover:bg-teal-50 transition" title="Upload document">
              <FileUp size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-teal hover:bg-teal-50 transition" title="Upload image">
              <Image size={16} />
            </button>
            <button
              onClick={handleSubmit}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white hover:shadow-glow transition"
              title="Send"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Agent Cards */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.15 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {[
          { title: "CarePulse", desc: "Early-warning signals", icon: Activity, path: "/app/carepulse", gradient: "from-primary to-primary-700" },
          { title: "CareBridge", desc: "Patient story timeline", icon: BookOpen, path: "/app/carebridge", gradient: "from-teal to-teal-700" },
          { title: "CareAccess", desc: "Care pathway navigation", icon: Compass, path: "/app/careaccess", gradient: "from-amber-500 to-amber-600" },
        ].map((agent) => {
          const Icon = agent.icon;
          return (
            <Link
              key={agent.title}
              to={agent.path}
              className="card-premium p-4 flex items-center gap-4 no-underline group"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shrink-0`}>
                <Icon size={18} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-head font-bold text-sm text-navy-900">{agent.title}</div>
                <div className="text-[11px] text-slate-400">{agent.desc}</div>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-teal group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </motion.div>

      {/* Demo Scenarios */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.2 }}
      >
        <h3 className="font-head font-bold text-base text-navy-900 mb-1">Demo Scenarios</h3>
        <p className="text-xs text-slate-400 mb-4">Select a scenario to see the agentic workflow in action.</p>

        <div className="grid md:grid-cols-3 gap-4">
          {DEMO_SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            const isActive = activeDemo === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => handleDemo(scenario)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "bg-teal-50 border-teal-200 shadow-glow"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-premium"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={isActive ? "text-teal" : "text-slate-400"} />
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{scenario.agent}</span>
                </div>
                <h4 className="font-head font-bold text-sm text-navy-900 mb-1">{scenario.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{scenario.description}</p>
                {isActive && (
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-teal">
                    <Sparkles size={10} /> Running workflow...
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Agent Trace */}
      {showTrace && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5 }}
        >
          <AgentTrace steps={DEMO_AGENT_TRACE} />
        </motion.div>
      )}

      {/* Response */}
      {showResponse && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5 }}
          className="card-premium p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white shrink-0">
              <MessageSquare size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-head font-bold text-sm text-navy-900">AI Care Response</span>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">Evidence-Grounded</span>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed space-y-3 mb-4">
                <p>
                  Based on your recent health data, I've identified several correlated changes that suggest a decline in overall health stability:
                </p>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-orange-500 mt-1 shrink-0" />
                    <span className="text-xs"><strong>Blood pressure</strong> has increased from 128/82 to 148/92 mmHg (+20 systolic)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-amber-500 mt-1 shrink-0" />
                    <span className="text-xs"><strong>Medication adherence</strong> has dropped from 91% to 73% over 30 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-amber-500 mt-1 shrink-0" />
                    <span className="text-xs"><strong>HbA1c</strong> increased from 6.8% to 7.2%, indicating declining glycemic control</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-amber-500 mt-1 shrink-0" />
                    <span className="text-xs"><strong>Physical activity</strong> dropped from 6,800 to 3,200 steps/day</span>
                  </div>
                </div>
                <p>
                  <strong>Recommendation:</strong> A clinical review within the next 1-2 weeks is recommended. This is not an emergency, but the combination of declining signals warrants timely follow-up.
                </p>
                <p className="text-[11px] text-amber-700 bg-amber-50 rounded-xl p-3">
                  ⚠️ If you experience chest pain, severe headache, or vision changes, please seek immediate emergency medical care.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <EvidenceCard data={DEMO_WHY_THIS_ANSWER} />
                <Link to="/app/carepulse" className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl px-3 py-2 transition">
                  <Activity size={14} /> View Full Dashboard
                </Link>
                <Link to="/app/careaccess" className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl px-3 py-2 transition">
                  <Compass size={14} /> Find Care Options
                </Link>
              </div>
            </div>
          </div>

          {/* Simulated data label */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-[9px] font-bold tracking-widest text-amber-600 bg-amber-50 rounded-full px-3 py-1 uppercase">
              Simulated Demo Response · Not Real Medical Advice
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
