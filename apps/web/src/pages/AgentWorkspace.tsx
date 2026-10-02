import { useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Check, FileSearch, GraduationCap, MapPin, Pill, Search, Upload } from "lucide-react";
import SafetyBanner from "@/components/SafetyBanner";

const AGENTS = {
  medguide: {
    name: "MedGuide",
    role: "Medication support agent",
    icon: Pill,
    summary: "Organize a patient-provided medication schedule and prepare questions for a pharmacist or clinician.",
    note: "This demo does not verify prescriptions, check interactions, or change medication instructions.",
  },
  carelocate: {
    name: "CareLocate",
    role: "Care options agent",
    icon: MapPin,
    summary: "Explore sample care options and clarify what type of service may fit a request.",
    note: "Facilities and availability below are simulated examples. This is not a live directory, locator, or booking service.",
  },
  reportlens: {
    name: "ReportLens",
    role: "Report understanding agent",
    icon: FileSearch,
    summary: "Prepare a structured report review that separates source facts, context, and missing information.",
    note: "Files stay in this browser demo and are not uploaded or medically interpreted. Example values are synthetic.",
  },
  healthlearn: {
    name: "HealthLearn",
    role: "Health education agent",
    icon: GraduationCap,
    summary: "Explore plain-language health education and prepare questions to discuss with a qualified professional.",
    note: "Educational content only. It does not diagnose, recommend treatment, or replace professional care.",
  },
} satisfies Record<string, { name: string; role: string; icon: LucideIcon; summary: string; note: string }>;

type AgentKey = keyof typeof AGENTS;

const FACILITIES = [
  { name: "Community Primary Care Clinic", type: "Primary care", area: "Central Mangaluru · simulated" },
  { name: "District General Hospital", type: "Hospital", area: "Mangaluru district · simulated" },
  { name: "Community Diagnostics Centre", type: "Diagnostics", area: "Central Mangaluru · simulated" },
];

const LEARNING_TOPICS = [
  { id: "visit", label: "Prepare for a visit", detail: "Bring a current medication list, relevant reports, symptom timing, allergies, and the questions you want to ask. Confirm what to bring with the care provider." },
  { id: "medicine", label: "Understand a prescription", detail: "Use the exact directions on your prescription. Ask your pharmacist or clinician if instructions are unclear; do not change a dose based on this demo." },
  { id: "reports", label: "Organize a report", detail: "Keep the report date, test name, result, units, and laboratory reference range together. A qualified clinician can interpret these in your health context." },
];

export default function AgentWorkspace() {
  const { agentSlug } = useParams();
  const reduce = useReducedMotion();
  const isAgentKey = agentSlug && Object.prototype.hasOwnProperty.call(AGENTS, agentSlug);
  const agent = isAgentKey ? AGENTS[agentSlug as AgentKey] : undefined;
  const [reminderMarked, setReminderMarked] = useState(false);
  const [facilitySearch, setFacilitySearch] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [fileName, setFileName] = useState("");
  const [showExample, setShowExample] = useState(false);
  const [learningTopic, setLearningTopic] = useState(LEARNING_TOPICS[0].id);

  if (!agent) {
    return (
      <div className="p-8 text-center">
        <h1 className="font-head font-bold text-2xl text-navy-900 mb-3">Agent not found</h1>
        <Link to="/app" className="text-sm font-semibold text-teal-700">Return to AI Care Center</Link>
      </div>
    );
  }

  const Icon = agent.icon;
  const visibleFacilities = FACILITIES.filter((facility) =>
    `${facility.name} ${facility.type} ${facility.area}`.toLowerCase().includes(facilitySearch.toLowerCase()),
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.files?.[0]?.name ?? "");
    setShowExample(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-7 lg:p-9 space-y-6">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.35 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#e8f4f2] text-teal-800 flex items-center justify-center shrink-0">
            <Icon size={21} strokeWidth={1.8} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-teal-700 mb-1">{agent.role} · demo</div>
            <h1 className="font-head font-extrabold text-2xl md:text-3xl text-navy-900">{agent.name}</h1>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">{agent.summary}</p>
          </div>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition">
          <ArrowLeft size={14} /> All seven agents
        </Link>
      </motion.header>

      <SafetyBanner />

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5 items-start">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
          {agentSlug === "medguide" && (
            <>
              <h2 className="font-head font-bold text-lg text-navy-900 mb-1">Example schedule</h2>
              <p className="text-xs text-slate-500 mb-5">A local interaction using fictional demo data. No reminder is sent.</p>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {[{ time: "8:00 AM", name: "Example medicine A", instruction: "Follow the supplied prescription" }, { time: "8:00 PM", name: "Example medicine B", instruction: "Follow the supplied prescription" }].map((item) => (
                  <div key={item.time} className="flex items-center gap-3 py-4">
                    <div className="w-12 text-xs font-bold text-teal-800">{item.time}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-navy-900">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.instruction}</div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wide rounded-full bg-slate-50 border border-slate-100 px-2 py-1 text-slate-500">Demo</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setReminderMarked((value) => !value)} className="mt-5 btn-primary !rounded-xl !px-4 !py-2.5 !text-xs">
                {reminderMarked ? <><Check size={14} /> Marked in this demo</> : "Mark example reminder complete"}
              </button>
            </>
          )}

          {agentSlug === "carelocate" && (
            <>
              <h2 className="font-head font-bold text-lg text-navy-900 mb-1">Explore example care options</h2>
              <p className="text-xs text-slate-500 mb-4">Search only filters this fictional Mangaluru directory.</p>
              <label className="sr-only" htmlFor="facility-search">Search example care options</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 mb-4">
                <Search size={15} className="text-slate-400" />
                <input id="facility-search" value={facilitySearch} onChange={(event) => setFacilitySearch(event.target.value)} placeholder="Search type or area" className="min-w-0 flex-1 text-sm outline-none" />
              </div>
              <div className="space-y-3">
                {visibleFacilities.map((facility) => (
                  <div key={facility.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                    <div>
                      <div className="text-sm font-semibold text-navy-900">{facility.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{facility.type} · {facility.area}</div>
                    </div>
                    <button onClick={() => setSelectedFacility(facility.name)} className="text-xs font-semibold text-teal-800 hover:text-teal-600">
                      {selectedFacility === facility.name ? "Selected for demo" : "Select option"}
                    </button>
                  </div>
                ))}
                {visibleFacilities.length === 0 && <p className="text-sm text-slate-500 py-4">No sample options match that search.</p>}
              </div>
            </>
          )}

          {agentSlug === "reportlens" && (
            <>
              <h2 className="font-head font-bold text-lg text-navy-900 mb-1">Start a report review</h2>
              <p className="text-xs text-slate-500 mb-5">Choose a file to show its name locally, or open the sample review. This page does not upload or parse files.</p>
              <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-700 hover:border-teal-500 cursor-pointer transition">
                <Upload size={16} /> Choose report file
                <input type="file" accept=".pdf,image/*,.txt" onChange={handleFileChange} className="sr-only" />
              </label>
              {fileName && <p className="mt-3 text-xs text-slate-600" aria-live="polite">Selected locally: {fileName}. No file was uploaded or read.</p>}
              <button onClick={() => setShowExample((value) => !value)} className="mt-5 btn-primary !rounded-xl !px-4 !py-2.5 !text-xs">
                {showExample ? "Hide sample review" : "Open simulated report example"}
              </button>
              {showExample && (
                <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 p-4" aria-live="polite">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-teal-800 mb-2">Synthetic example · not your uploaded file</div>
                  <p className="text-sm text-slate-700"><strong>Source fact:</strong> Example lab report, dated 12 May · HbA1c value shown as 7.2%.</p>
                  <p className="text-sm text-slate-700 mt-2"><strong>Missing context:</strong> Reference range, prior results, and clinician interpretation are not included.</p>
                </div>
              )}
            </>
          )}

          {agentSlug === "healthlearn" && (
            <>
              <h2 className="font-head font-bold text-lg text-navy-900 mb-1">Choose a learning topic</h2>
              <p className="text-xs text-slate-500 mb-5">General educational guidance to help prepare for a conversation with a care professional.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {LEARNING_TOPICS.map((topic) => (
                  <button key={topic.id} onClick={() => setLearningTopic(topic.id)} aria-pressed={learningTopic === topic.id} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${learningTopic === topic.id ? "border-teal-700 bg-teal-800 text-white" : "border-slate-200 text-slate-600 hover:border-teal-400"}`}>
                    {topic.label}
                  </button>
                ))}
              </div>
              <div className="rounded-xl bg-[#f5f8f9] p-5">
                <div className="text-sm font-semibold text-navy-900 mb-2">{LEARNING_TOPICS.find((topic) => topic.id === learningTopic)?.label}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{LEARNING_TOPICS.find((topic) => topic.id === learningTopic)?.detail}</p>
              </div>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-navy-900 p-5 md:p-6 text-white">
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-teal-300 mb-3">What this agent does</div>
            <h2 className="font-head font-bold text-lg mb-3">One clear role, inside one care system.</h2>
            <p className="text-xs leading-relaxed text-slate-300">{agent.summary}</p>
            <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-300">{agent.note}</div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="text-[10px] font-bold tracking-wide uppercase text-amber-800 mb-1">Human oversight</div>
            <p className="text-xs leading-relaxed text-amber-900">Use this prototype for demonstration and education only. It does not provide a diagnosis or treatment plan. For emergency symptoms, seek immediate professional help.</p>
          </div>
          <Link to="/app" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-600">
            Return to the Care Orchestrator <ArrowLeft size={14} />
          </Link>
        </aside>
      </div>
    </div>
  );
}