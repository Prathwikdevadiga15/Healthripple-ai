import { motion, useReducedMotion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Info, HeartPulse, Clock, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import SafetyBanner from "@/components/SafetyBanner";
import RiskSignal from "@/components/RiskSignal";
import EvidenceCard from "@/components/EvidenceCard";
import { DEMO_HEALTH_SIGNALS, DEMO_WHY_THIS_ANSWER } from "@/data/demoData";

const BP_TREND = [
  { date: "Jun 1", systolic: 128, diastolic: 82 },
  { date: "Jul 10", systolic: 130, diastolic: 84 },
  { date: "Aug 20", systolic: 132, diastolic: 85 },
  { date: "Sep 15", systolic: 135, diastolic: 87 },
  { date: "Sep 28", systolic: 142, diastolic: 90 },
  { date: "Sep 30", systolic: 148, diastolic: 92 },
];

const HBA1C_TREND = [
  { month: "Mar", value: 6.8 },
  { month: "Jun", value: 6.9 },
  { month: "Sep", value: 7.2 },
];

const ADHERENCE_TREND = [
  { week: "W1", value: 95 },
  { week: "W2", value: 90 },
  { week: "W3", value: 82 },
  { week: "W4", value: 73 },
];

export default function CarePulse() {
  const reduce = useReducedMotion();

  const elevatedSignals = DEMO_HEALTH_SIGNALS.filter(s => s.riskLevel === "elevated" || s.riskLevel === "critical");
  const watchSignals = DEMO_HEALTH_SIGNALS.filter(s => s.riskLevel === "watch");
  const normalSignals = DEMO_HEALTH_SIGNALS.filter(s => s.riskLevel === "normal");

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white">
            <Activity size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-head font-extrabold text-2xl text-navy-900">CarePulse</h1>
            <p className="text-xs text-slate-400">AI Early-Warning Agent · Health Trend Dashboard</p>
          </div>
        </div>
      </motion.div>

      <SafetyBanner />

      {/* Summary Bar */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Signals", value: DEMO_HEALTH_SIGNALS.length, icon: Activity, color: "text-primary" },
          { label: "Elevated", value: elevatedSignals.length, icon: AlertTriangle, color: "text-orange-600" },
          { label: "Watch", value: watchSignals.length, icon: TrendingUp, color: "text-amber-600" },
          { label: "Normal", value: normalSignals.length, icon: HeartPulse, color: "text-emerald-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-premium p-4 flex items-center gap-3">
              <Icon size={18} className={stat.color} />
              <div>
                <div className="font-head font-bold text-xl text-navy-900">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* BP Trend */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: 0.1 }}
          className="card-premium p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-head font-bold text-sm text-navy-900">Blood Pressure Trend</h3>
              <p className="text-[10px] text-slate-400">6-month trend · Simulated data</p>
            </div>
            <span className="badge-elevated">Elevated</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={BP_TREND}>
              <defs>
                <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f4c75" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0f4c75" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis domain={[70, 160]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 11 }}
              />
              <Area type="monotone" dataKey="systolic" stroke="#0f4c75" strokeWidth={2} fill="url(#bpGrad)" dot={{ r: 3, fill: "#0f4c75" }} />
              <Line type="monotone" dataKey="diastolic" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 2, fill: "#94a3b8" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* HbA1c + Adherence */}
        <div className="space-y-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, delay: 0.15 }}
            className="card-premium p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-head font-bold text-sm text-navy-900">HbA1c Trend</h3>
                <p className="text-[10px] text-slate-400">3-month trend · Simulated data</p>
              </div>
              <span className="badge-watch">Watch</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={HBA1C_TREND}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis domain={[6, 8]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, delay: 0.2 }}
            className="card-premium p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-head font-bold text-sm text-navy-900">Medication Adherence</h3>
                <p className="text-[10px] text-slate-400">4-week trend · Simulated data</p>
              </div>
              <span className="badge-elevated">Declining</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={ADHERENCE_TREND}>
                <defs>
                  <linearGradient id="adhGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fill="url(#adhGrad)" dot={{ r: 3, fill: "#ef4444" }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>

      {/* Risk Signals */}
      <div>
        <h2 className="font-head font-bold text-lg text-navy-900 mb-1">Health Signals</h2>
        <p className="text-xs text-slate-400 mb-4">Compared against patient baseline. All data is simulated.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_HEALTH_SIGNALS.map((signal, i) => (
            <RiskSignal key={signal.id} signal={signal} index={i} />
          ))}
        </div>
      </div>

      {/* AI Interpretation */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 0.4 }}
        className="card-premium p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
            <Info size={16} className="text-teal" />
          </div>
          <div>
            <h3 className="font-head font-bold text-sm text-navy-900">AI Early-Warning Summary</h3>
            <p className="text-[10px] text-slate-400">Correlated signal analysis · Decision support only</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Multiple correlated signals indicate a decline in health stability. Rising blood pressure (20mmHg increase), declining medication adherence (73%), rising HbA1c (7.2%), reduced activity, and patient-reported fatigue form a coherent pattern suggesting the need for timely clinical review.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <EvidenceCard data={DEMO_WHY_THIS_ANSWER} />
          <span className="text-[9px] font-bold tracking-widest text-amber-600 bg-amber-50 rounded-full px-3 py-1 uppercase">
            AI Interpretation · Not a Diagnosis
          </span>
        </div>
      </motion.div>
    </div>
  );
}
