import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  BookOpen,
  Compass,
  FileSearch,
  GraduationCap,
  GitBranch,
  Globe2,
  Shield,
  Brain,
  Mic,
  FileText,
  ChevronRight,
  Sparkles,
  HeartPulse,
  CheckCircle2,
  Users,
  Server,
  MapPin,
  MessageSquare,
  Network,
  Pill,
  Send,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgentCard from "@/components/AgentCard";
import MetricCard from "@/components/MetricCard";
import { DEMO_METRICS } from "@/data/demoData";

const AGENTS = [
  {
    agent: "carepulse" as const,
    title: "CarePulse",
    description: "AI Early-Warning Agent — Detects meaningful changes in a patient's health context and generates explainable risk signals.",
    icon: Activity,
    path: "/app/carepulse",
    features: ["Vital Trends", "Risk Signals", "Adherence", "Explainable Alerts"],
    color: "blue" as const,
  },
  {
    agent: "carebridge" as const,
    title: "CareBridge",
    description: "Longitudinal Patient Story Agent — Converts fragmented medical information into one understandable patient timeline.",
    icon: BookOpen,
    path: "/app/carebridge",
    features: ["Timeline", "Document Extraction", "What Changed?", "Evidence"],
    color: "teal" as const,
  },
  {
    agent: "careaccess" as const,
    title: "CareAccess",
    description: "AI Care Pathway Agent — Moves from healthcare information to coordinated next steps and care navigation.",
    icon: Compass,
    path: "/app/careaccess",
    features: ["Care Pathways", "Urgency Screening", "Multilingual", "Follow-up"],
    color: "amber" as const,
  },
  {
    agent: "medguide" as const,
    title: "MedGuide",
    description: "Organize a patient-provided medication schedule and prepare questions for a pharmacist or clinician.",
    icon: Pill,
    path: "/app/agents/medguide",
    features: ["Schedule Support", "Prescription Context", "Human Review"],
    color: "blue" as const,
  },
  {
    agent: "carelocate" as const,
    title: "CareLocate",
    description: "Explore example care options and clarify what type of service may fit a request.",
    icon: MapPin,
    path: "/app/agents/carelocate",
    features: ["Care Options", "Service Type", "Demo Directory"],
    color: "teal" as const,
  },
  {
    agent: "reportlens" as const,
    title: "ReportLens",
    description: "Review a patient story using source facts, plain-language context, and missing information.",
    icon: FileSearch,
    path: "/app/agents/reportlens",
    features: ["Report Intake", "Source Facts", "Missing Context"],
    color: "amber" as const,
  },
  {
    agent: "healthlearn" as const,
    title: "HealthLearn",
    description: "Explore plain-language health education and prepare questions for a qualified professional.",
    icon: GraduationCap,
    path: "/app/agents/healthlearn",
    features: ["Health Education", "Question Prep", "Safety Guidance"],
    color: "blue" as const,
  },
];

const ARCHITECTURE_STEPS = [
  { label: "Health & System Signals", detail: "Records, trends, medicine availability", icon: Mic },
  { label: "HealthRipple AI", detail: "Connects system context to care workflows", icon: Brain },
  { label: "Specialized Agent", detail: "CarePulse / CareBridge / CareAccess", icon: Sparkles },
  { label: "Safety Engine", detail: "Evidence grounding + safety rules", icon: Shield },
  { label: "Human Oversight", detail: "Clinician review for actions", icon: Users },
  { label: "Explainable Response", detail: "With audit trail", icon: FileText },
];

const SAFETY_ITEMS = [
  "No autonomous clinical decisions",
  "Evidence-grounded responses only",
  "Confidence indicators on every output",
  "Human approval for high-impact actions",
  "Emergency escalation guidance",
  "Full audit logging",
];

const PLATFORM_WORKFLOWS = [
  { name: "MediRipple", detail: "Forecast medicine demand and stockout risk across a synthetic supply network.", status: "Implemented engine · demo data", icon: Activity },
  { name: "CareFlow", detail: "Trace how a local medicine shortage could affect connected facilities.", status: "Implemented engine · demo data", icon: Network },
  { name: "What-If Simulator", detail: "Compare a baseline with an advisory redistribution scenario.", status: "Implemented · human review required", icon: GitBranch },
  { name: "DoseSignal", detail: "Flag treatment-pattern changes without claiming to know whether a dose was taken.", status: "Implemented detector · demo data", icon: Pill },
  { name: "Health Copilot", detail: "Ask questions grounded in the platform's structured supply-risk data.", status: "Backend API · optional phrasing service", icon: MessageSquare },
  { name: "Hospital Finder", detail: "Explore example care options from the Namma Saathi pathway demo.", status: "Simulated facility list · not live search", icon: MapPin },
];

const CHAT_RESPONSES: Record<string, string> = {
  en: "This demo can help organize your question and point to a care workflow. It cannot diagnose or replace a clinician. For urgent symptoms, seek immediate professional help.",
  kn: "ಈ ಡೆಮೊ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸರಿಯಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇದು ರೋಗನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ ಅಥವಾ ವೈದ್ಯರ ಸಲಹೆಗೆ ಬದಲಿಯಾಗುವುದಿಲ್ಲ. ತುರ್ತು ಲಕ್ಷಣಗಳಿದ್ದರೆ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.",
  hi: "यह डेमो आपके प्रश्न को व्यवस्थित करने में मदद कर सकता है। यह निदान नहीं करता और डॉक्टर की सलाह का विकल्प नहीं है। आपातकालीन लक्षणों पर तुरंत चिकित्सा सहायता लें।",
  ta: "இந்த டெமோ உங்கள் கேள்வியை ஒழுங்குபடுத்த உதவும். இது நோயறிதல் செய்யாது; மருத்துவரின் ஆலோசனைக்கு மாற்றாகாது. அவசர அறிகுறிகள் இருந்தால் உடனடியாக மருத்துவ உதவியை நாடுங்கள்.",
};

export default function Home() {
  const reduce = useReducedMotion();
  const [chatLanguage, setChatLanguage] = useState("en");
  const [chatMessage, setChatMessage] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = chatMessage.trim();
    if (!message) return;
    setSentMessage(message);
    setChatMessage("");
  };

  return (
    <div className="bg-bg font-body">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <header className="relative min-h-[90vh] flex items-center overflow-hidden bg-navy-900">
        {/* Background mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-teal/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary/15 via-transparent to-transparent" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-32 md:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7 }}
            >
              <div className="section-eyebrow !text-teal-400 mb-6">
                <span className="!bg-teal-400" />
                HEALTHRIPPLE AI · NAMMA SAATHI CARE
              </div>

              <h1 className="font-head font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-white leading-[1.08] mb-6">
                Healthcare that<br />
                understands the<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-primary-300">whole patient.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
                HealthRipple AI brings system-level medicine intelligence and Namma Saathi's patient-centered care journey together. Seven specialized agents connect early signals, patient stories and practical next steps, with people still in control.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/app" className="btn-primary !px-7 !py-3.5 !text-sm !rounded-2xl">
                  Launch AI Care <ArrowRight size={16} />
                </Link>
                <a href="#how-it-works" className="btn-secondary !bg-white/5 !text-white !border-white/20 hover:!bg-white/10 !rounded-2xl">
                  Explore how it works <ChevronRight size={16} />
                </a>
              </div>
            </motion.div>

            {/* Right — Human-centered care visual */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.2 }}
              className="relative mt-10 lg:mt-0"
            >
              <div className="relative min-h-[230px] md:min-h-[340px] lg:min-h-[430px] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay={!reduce}
                  muted
                  loop
                  playsInline
                  preload={reduce ? "none" : "metadata"}
                  poster="https://images.pexels.com/videos/6129936/pictures/preview-0.jpg"
                  aria-label="Clinician speaking with a patient"
                >
                  <source src="https://videos.pexels.com/video-files/6129936/6129936-sd_640_360_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-teal-300 animate-pulse-soft" />
                    <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">A care journey, connected</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { name: "Understand", agent: "CareBridge" },
                      { name: "Detect", agent: "CarePulse" },
                      { name: "Coordinate", agent: "CareAccess" },
                    ].map((step) => (
                      <div key={step.name} className="rounded-xl border border-white/20 bg-navy-950/55 backdrop-blur-md p-2.5 sm:p-3">
                        <div className="text-[9px] uppercase tracking-wide text-teal-200 mb-1">{step.name}</div>
                        <div className="text-[11px] sm:text-xs font-semibold text-white">{step.agent}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-white/80">
                    <span>Patient context → safer next steps</span>
                    <a href="https://www.pexels.com/video/doctor-talking-to-a-patient-6129936/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">Video: Pexels</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <a href="#agents" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-teal-400 transition">
          <span className="text-[9px] font-bold tracking-widest uppercase">Discover</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-current flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-current" />
          </motion.div>
        </a>
      </header>

      <section id="platform" className="bg-white py-16 md:py-20 border-b border-slate-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl mb-10">
            <div className="section-eyebrow mb-4">ONE PLATFORM · TWO CONNECTED VIEWS</div>
            <h2 className="font-head font-extrabold text-3xl md:text-4xl text-navy-900 mb-4">
              Healthcare doesn't lack information.<br />It lacks connection.
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              HealthRipple starts with the signals around care. Namma Saathi brings that same systems perspective to the patient story, helping people and care teams understand what changed and what could happen next.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] items-stretch gap-4 md:gap-6">
            <div className="rounded-2xl border border-slate-200 bg-[#f7fafb] p-6 md:p-8">
              <div className="text-[10px] font-bold tracking-[0.16em] text-teal uppercase mb-3">HEALTH SYSTEM · HEALTHRIPPLE AI</div>
              <h3 className="font-head font-bold text-xl text-navy-900 mb-2">See the signal across the network.</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">Explore medicine demand forecasts, shortage ripple simulations and explainable redistribution recommendations.</p>
              <Link to="/app/architecture" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-700 transition">
                Explore the platform <ArrowRight size={14} />
              </Link>
            </div>
            <div className="hidden md:flex items-center justify-center text-slate-300" aria-hidden="true">
              <ArrowRight size={22} />
            </div>
            <div className="rounded-2xl border border-teal-100 bg-[#f3faf8] p-6 md:p-8">
              <div className="text-[10px] font-bold tracking-[0.16em] text-teal uppercase mb-3">PATIENT JOURNEY · NAMMA SAATHI</div>
              <h3 className="font-head font-bold text-xl text-navy-900 mb-2">Make the whole story easier to see.</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">CareBridge connects a timeline, CarePulse highlights changes, and CareAccess helps organize a human-reviewed next step.</p>
              <Link to="/app" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-700 transition">
                Explore the care experience <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <p className="mt-5 text-[11px] text-slate-400">Prototype only: both views use synthetic/demo data and are not connected to live hospital or patient systems.</p>
        </div>
      </section>

      <section className="bg-[#f5f8f9] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl mb-9">
            <div className="section-eyebrow mb-4">SIX SPECIALIST WORKFLOWS</div>
            <h2 className="font-head font-extrabold text-3xl md:text-4xl text-navy-900 mb-3">
              From medicine networks<br className="hidden sm:block" /> to the patient next door.
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              HealthRipple's supply intelligence and Namma Saathi's care tools belong to one connected platform. These workflows use synthetic data; facility listings are examples, not a live hospital locator.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {PLATFORM_WORKFLOWS.map((workflow, index) => {
              const Icon = workflow.icon;
              return (
                <motion.article
                  key={workflow.name}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : index * 0.04 }}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#eaf5f3] text-teal-700 flex items-center justify-center shrink-0">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>
                    <span className="text-[9px] leading-4 font-bold tracking-wide uppercase text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1 text-right">{workflow.status}</span>
                  </div>
                  <h3 className="font-head font-bold text-base text-navy-900 mb-1.5">{workflow.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{workflow.detail}</p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-navy-900">Explore the source data</div>
              <p className="mt-1 text-xs text-slate-500">Browse all six synthetic CSV datasets with search and pagination.</p>
            </div>
            <Link to="/app/data" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-600">Open Data Explorer <ArrowRight size={14} /></Link>
          </div>

          <div className="mt-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-10 items-start rounded-3xl bg-navy-900 p-5 sm:p-7 md:p-9 text-white">
            <div>
              <div className="flex items-center gap-2 text-teal-300 mb-4">
                <Globe2 size={17} />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Multilingual care assistant · demo</span>
              </div>
              <h3 className="font-head font-bold text-2xl md:text-3xl mb-3">Care should speak your language.</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">Try a simulated text exchange in English, Kannada, Hindi or Tamil. Tulu is planned and is not enabled in this prototype.</p>
              <Link to="/app/voice" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-white transition">
                Open voice care <ArrowRight size={15} />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="text-xs font-semibold text-white">Namma Saathi assistant</div>
                <span className="text-[9px] font-bold tracking-wide text-amber-200 bg-amber-300/10 border border-amber-100/10 rounded-full px-2.5 py-1">SIMULATED</span>
              </div>
              <div aria-live="polite" className="min-h-24 space-y-3 mb-4">
                {sentMessage ? (
                  <>
                    <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-teal-500/20 px-3.5 py-2.5 text-xs text-white">{sentMessage}</div>
                    <div className="max-w-[95%] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-3 text-xs leading-relaxed text-slate-200">{CHAT_RESPONSES[chatLanguage]}</div>
                  </>
                ) : (
                  <div className="max-w-[95%] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-3 text-xs leading-relaxed text-slate-200">Hello. Share what you need help understanding, and I can show how a care workflow might organize it.</div>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="flex flex-col sm:flex-row gap-2">
                <label className="sr-only" htmlFor="care-chat-language">Response language</label>
                <select
                  id="care-chat-language"
                  value={chatLanguage}
                  onChange={(event) => setChatLanguage(event.target.value)}
                  className="rounded-xl border border-white/15 bg-navy-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ · Kannada</option>
                  <option value="hi">हिन्दी · Hindi</option>
                  <option value="ta">தமிழ் · Tamil</option>
                </select>
                <label className="sr-only" htmlFor="care-chat-message">Your care question</label>
                <input
                  id="care-chat-message"
                  value={chatMessage}
                  onChange={(event) => setChatMessage(event.target.value)}
                  placeholder="How can I help with your care?"
                  className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button type="submit" aria-label="Send demo message" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-400 transition">
                  Send <Send size={13} />
                </button>
              </form>
              <p className="mt-3 text-[10px] leading-relaxed text-slate-400">This is a scripted language demo, not a live AI response or medical advice. For emergencies, seek immediate professional help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THREE AGENTS ═══ */}
      <section id="agents" className="py-24 md:py-32 bg-bg">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.5 }}
            className="text-center mb-16"
          >
            <div className="section-eyebrow justify-center mb-4">SEVEN SPECIALIZED CARE AGENTS</div>
            <h2 className="font-head font-extrabold text-3xl md:text-4xl text-navy-900 mb-4">
              One intelligent system.<br /><span className="text-gradient">Seven focused agents.</span>
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">
              One connected patient journey: understand the story, detect changes, coordinate next steps, and support everyday health needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {AGENTS.map((agent, i) => (
              <AgentCard key={agent.agent} {...agent} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.5 }}
            >
              <div className="section-eyebrow mb-4">HEALTHRIPPLE CARE ORCHESTRATOR · PROTOTYPE</div>
              <h2 className="font-head font-extrabold text-3xl md:text-4xl text-navy-900 mb-4">
                One intelligent system.<br /><span className="text-gradient">Three specialized agents.</span>
              </h2>
              <p className="text-base text-slate-500 mb-8 max-w-lg">
                The prototype routes a request to the relevant care workflow, presents available evidence, and surfaces safety guidance. Gemini integration, clinical RAG and live patient-system connections are not currently implemented.
              </p>

              <div className="space-y-4">
                {[
                  { label: "Multimodal Input", detail: "Voice, text, documents, medical images" },
                  { label: "Intelligent Routing", detail: "Automatically selects the right care agent" },
                  { label: "Evidence Grounding", detail: "Every response backed by patient data" },
                  { label: "Safety-First", detail: "Deterministic safety rules + human oversight" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-teal mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-navy-900">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/app/architecture" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-teal hover:text-teal-700 transition">
                View full architecture <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 text-white"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
                  <Brain size={16} className="text-teal-400" />
                  <span className="text-xs font-bold text-teal-400">HealthRipple Care Orchestrator · Demo</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { name: "CarePulse", icon: Activity, desc: "Early Warning" },
                  { name: "CareBridge", icon: BookOpen, desc: "Patient Story" },
                  { name: "CareAccess", icon: Compass, desc: "Care Pathway" },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.name} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition">
                      <Icon size={20} className="text-teal-400 mx-auto mb-2" />
                      <div className="text-[11px] font-bold text-white">{a.name}</div>
                      <div className="text-[9px] text-slate-400">{a.desc}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Shield size={10} className="text-teal-400" /> Safety Engine</span>
                <span>→</span>
                <span className="flex items-center gap-1"><Users size={10} className="text-teal-400" /> Human Oversight</span>
                <span>→</span>
                <span className="flex items-center gap-1"><Server size={10} className="text-teal-400" /> Audit Log</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SAFETY ═══ */}
      <section className="py-24 md:py-32 bg-bg">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.5 }}
            >
              <div className="section-eyebrow mb-4">RESPONSIBLE AI</div>
              <h2 className="font-head font-extrabold text-3xl md:text-4xl text-navy-900 mb-4">
                Safety is not a feature.<br /><span className="text-gradient">It's the foundation.</span>
              </h2>
              <p className="text-base text-slate-500 mb-8 max-w-lg">
                Every part of the system is designed with deterministic safety rules, evidence grounding, and human oversight. An LLM alone never makes high-impact clinical decisions.
              </p>

              <div className="space-y-3">
                {SAFETY_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-navy-900 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/app/safety" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-teal hover:text-teal-700 transition">
                Read our safety approach <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-primary flex items-center justify-center text-white mx-auto mb-6">
                  <Shield size={28} strokeWidth={1.8} />
                </div>
                <h3 className="font-head font-bold text-xl text-navy-900 mb-3">Safety-First Architecture</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  Every response passes through deterministic safety checks before reaching the user.
                </p>
                <div className="inline-block bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-left">
                  <div className="space-y-2 text-xs">
                    {["Evidence check", "Confidence scoring", "Emergency screening", "Uncertainty flagging", "Human gate"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <CheckCircle2 size={10} className="text-emerald-500" />
                        </div>
                        <span className="font-medium text-navy-900">{s}</span>
                        <span className="text-[9px] text-emerald-500 font-bold ml-auto">PASS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ IMPACT DASHBOARD ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          >
            <div className="section-eyebrow justify-center mb-4">PROTOTYPE METRICS</div>
            <h2 className="font-head font-extrabold text-3xl md:text-4xl text-navy-900 mb-2">
              Impact <span className="text-gradient">Dashboard</span>
            </h2>
            <p className="text-sm text-slate-500 mb-12 max-w-md mx-auto">
              These metrics represent prototype/demo activity only. No real patient outcomes are claimed.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {DEMO_METRICS.map((metric, i) => (
              <MetricCard key={metric.label} metric={metric} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 md:py-32 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-teal/20 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          >
            <HeartPulse size={36} className="text-teal-400 mx-auto mb-6" />
            <h2 className="font-head font-extrabold text-3xl md:text-4xl text-white mb-4">
              Ready to experience<br />the future of care?
            </h2>
            <p className="text-base text-slate-300 mb-8 max-w-md mx-auto">
              Explore how agentic AI can transform fragmented health data into coordinated, explainable care decisions.
            </p>
            <Link to="/app" className="btn-primary !px-8 !py-4 !text-base !rounded-2xl">
              Launch AI Care Center <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
