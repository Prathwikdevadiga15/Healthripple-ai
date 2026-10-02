import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowRight, HeartPulse, ChevronDown } from "lucide-react";
import { HOME_NAV_ITEMS } from "@/navigation/sidebar";

const AGENT_LINKS = [
  { label: "CarePulse", path: "/app/carepulse", detail: "Detect meaningful changes" },
  { label: "CareBridge", path: "/app/carebridge", detail: "Understand the patient story" },
  { label: "CareAccess", path: "/app/careaccess", detail: "Coordinate a care pathway" },
  { label: "MedGuide", path: "/app/agents/medguide", detail: "Organize medication context" },
  { label: "CareLocate", path: "/app/agents/carelocate", detail: "Explore care options" },
  { label: "ReportLens", path: "/app/agents/reportlens", detail: "Review source information" },
  { label: "HealthLearn", path: "/app/agents/healthlearn", detail: "Explore health education" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setAgentsOpen(false);
      }
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setAgentsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100" aria-label="Main navigation">
      <div className="absolute left-0 top-0 h-[2px] bg-teal-600 transition-[width] duration-150" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-navy-900 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
            <HeartPulse size={18} strokeWidth={2.2} />
          </div>
          <div className="hidden sm:block">
            <span className="font-head font-bold text-[15px] tracking-tight text-navy-900">
              HealthRipple <span className="text-gradient">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-1">
          {HOME_NAV_ITEMS.map((item) => (
            item.path.startsWith("/#") ? (
              <a key={item.path} href={item.path.slice(1)} className="px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-navy-900 transition-colors duration-200 rounded-xl hover:bg-slate-50">
                {item.label}
              </a>
            ) : (
              <Link key={item.path} to={item.path} className="px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-navy-900 transition-colors duration-200 rounded-xl hover:bg-slate-50">
                {item.label}
              </Link>
            )
          ))}
          <div className="relative">
            <button onClick={() => setAgentsOpen((open) => !open)} aria-expanded={agentsOpen} aria-haspopup="true" className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-navy-900 rounded-xl hover:bg-slate-50">
              Agents <ChevronDown size={14} className={`transition-transform ${agentsOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {agentsOpen && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: reduce ? 0 : 0.16 }} className="absolute right-0 top-12 w-[340px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Seven patient-care agents</div>
                  {AGENT_LINKS.map((agent) => (
                    <Link key={agent.path} to={agent.path} onClick={() => setAgentsOpen(false)} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 group">
                      <span className="text-sm font-semibold text-navy-900">{agent.label}</span>
                      <span className="text-[11px] text-slate-500 group-hover:text-teal-700">{agent.detail}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link to="/app" className="btn-primary text-xs !py-2.5 !px-4 !rounded-xl">
            Launch AI <ArrowRight size={14} />
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="xl:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <button className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={closeMenus} aria-label="Close navigation menu" />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[min(90vw,390px)] bg-white shadow-2xl flex flex-col"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
            >
              <div className="h-[72px] px-5 flex items-center justify-between border-b border-slate-100">
                <span className="font-head font-bold text-[15px] text-navy-900">HealthRipple AI</span>
                <button onClick={closeMenus} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-4">
                <Link to="/" onClick={closeMenus} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
                  Home
                </Link>
                {HOME_NAV_ITEMS.map((item) => (
                  item.path.startsWith("/#") ? (
                    <a key={item.path} href={item.path.slice(1)} onClick={closeMenus} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">{item.label}</a>
                  ) : (
                    <Link key={item.path} to={item.path} onClick={closeMenus} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">{item.label}</Link>
                  )
                ))}
                <div className="px-4 pt-5 pb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Seven patient-care agents</div>
                <div className="space-y-1">
                  {AGENT_LINKS.map((agent) => (
                    <Link key={agent.path} to={agent.path} onClick={closeMenus} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-teal-50 transition">
                      <span className="text-sm font-semibold text-navy-900">{agent.label}</span>
                      <span className="text-[10px] text-slate-500">{agent.detail}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/app" onClick={closeMenus} className="btn-primary w-full mt-5 !rounded-xl !py-3">Launch AI Care <ArrowRight size={14} /></Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
