import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Circle,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import { NAV_GROUPS } from "@/navigation/sidebar";

function NavigationLinks({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.title ?? "overview"}>
          {group.title && !compact && (
            <div className="px-3 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase mb-2">
              {group.title}
            </div>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/app"}
                  title={compact ? item.label : undefined}
                  aria-label={item.label}
                  onClick={onNavigate}
                  className={({ isActive }) => `nav-item ${compact ? "justify-center px-0" : ""} ${isActive ? "nav-item-active" : ""}`}
                >
                  <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                  {!compact && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const currentItem = NAV_GROUPS.flatMap((group) => group.items).find((item) =>
    item.path === "/app" ? location.pathname === "/app" : location.pathname.startsWith(item.path),
  ) ?? NAV_GROUPS[0].items[0];
  const currentGroup = NAV_GROUPS.find((group) => group.items.includes(currentItem))?.title ?? "Overview";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#f4f8fa]">
      <aside className={`hidden md:flex shrink-0 bg-navy flex-col transition-[width] duration-300 ${sidebarCollapsed ? "w-[76px]" : "w-[252px]"}`}>
        <div className={`h-[76px] flex items-center border-b border-navy-border ${sidebarCollapsed ? "justify-center px-3" : "px-5"}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan font-bold">H</div>
            {!sidebarCollapsed && <div className="min-w-0">
              <div className="font-head font-extrabold text-[15px] text-white leading-tight">HealthRipple <span className="text-cyan">AI</span></div>
              <div className="text-[10px] text-slate-400 mt-1 tracking-wide">CONNECTED CARE · PROTOTYPE</div>
            </div>}
          </div>
        </div>

        <NavigationLinks compact={sidebarCollapsed} />

        {!sidebarCollapsed && <div className="px-4 py-4 border-t border-navy-border space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Circle size={7} className="text-emerald-400 fill-emerald-400" /> System healthy
          </div>
          <div className="text-[10px] text-slate-500">Synthetic data · prototype</div>
        </div>}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[68px] shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/70 flex items-center gap-3 md:gap-4 px-4 md:px-6 sticky top-0 z-20">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
            className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <Menu size={19} />
          </button>
          <button
            onClick={() => setSidebarCollapsed((value) => !value)}
            aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            className="hidden md:inline-flex w-9 h-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-ink transition"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <div className="hidden sm:block min-w-0">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted font-bold">{currentGroup}</div>
            <div className="text-sm font-semibold text-ink truncate">{currentItem.label}</div>
          </div>
          <div
            className="flex items-center gap-2 text-sm text-muted bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 w-full max-w-[300px] min-w-0 sm:ml-auto md:ml-4 transition"
          >
            <Search size={15} />
            <input type="text" placeholder="Search care pages..." className="bg-transparent outline-none flex-1 min-w-0" />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-green bg-mint rounded-full px-2.5 py-1 mr-1">
              <Circle size={6} className="fill-green" />
              Synthetic Data
            </span>
            <div className="w-8 h-8 rounded-full bg-[#d8eee9] text-[#247a69] flex items-center justify-center text-[10px] font-extrabold ml-1 ring-2 ring-white">
              HR
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav aria-label="Quick navigation" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200/80 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] grid grid-cols-5">
        {[NAV_GROUPS[0].items[0], NAV_GROUPS[1].items[0], NAV_GROUPS[1].items[1], NAV_GROUPS[2].items[0]].map((item) => {
          const Icon = item.icon;
          return <NavLink key={item.path} to={item.path} end={item.path === "/app"} className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[9px] font-semibold transition ${isActive ? "text-primary" : "text-slate-500"}`}>
            <Icon size={19} strokeWidth={1.8} />
            <span>{item.label === "AI Care Center" ? "Overview" : item.label}</span>
          </NavLink>;
        })}
        <button onClick={() => setMobileNavOpen(true)} className="flex flex-col items-center gap-1 py-1 text-[9px] font-semibold text-slate-500" aria-label="More navigation">
          <Menu size={19} strokeWidth={1.8} />
          <span>More</span>
        </button>
      </nav>

      <AnimatePresence>
        {mobileNavOpen && <motion.div className="md:hidden fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-navy/55 backdrop-blur-[2px]" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
            className="relative h-full w-[min(84vw,300px)] bg-navy flex flex-col shadow-2xl"
          >
            <div className="h-[76px] px-5 flex items-center justify-between border-b border-navy-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan font-bold">H</div>
                <div>
                  <div className="font-head font-extrabold text-[15px] text-white">HealthRipple <span className="text-cyan">AI</span></div>
                  <div className="text-[10px] text-slate-400 mt-1 tracking-wide">CONNECTED CARE · PROTOTYPE</div>
                </div>
              </div>
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <NavigationLinks onNavigate={() => setMobileNavOpen(false)} />
            <div className="px-4 py-4 border-t border-navy-border text-[11px] text-slate-400 flex items-center gap-2">
              <Circle size={7} className="text-emerald-400 fill-emerald-400" /> System healthy
            </div>
          </motion.aside>
        </motion.div>}
      </AnimatePresence>


    </div>
  );
}
