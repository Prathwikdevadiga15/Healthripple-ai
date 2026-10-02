import { Link } from "react-router-dom";
import { HeartPulse, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Disclaimer */}
      <div className="disclaimer-banner">
        ⚠️ Prototype for decision support and education. Not a substitute for professional medical diagnosis or treatment.
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white">
                <HeartPulse size={18} strokeWidth={2.2} />
              </div>
              <span className="font-head font-bold text-[15px] text-white">
                HealthRipple <span className="text-teal-400">AI</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              HealthRipple AI connects health-system intelligence with Namma Saathi, a patient-centered care experience. Prototype workflows use simulated data.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/app" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">AI Care Center</Link></li>
              <li><Link to="/app/carepulse" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">CarePulse</Link></li>
              <li><Link to="/app/carebridge" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">CareBridge</Link></li>
              <li><Link to="/app/careaccess" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">CareAccess</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/app/safety" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">Safety & AI</Link></li>
              <li><Link to="/app/architecture" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">Architecture</Link></li>
              <li><Link to="/app/data" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">Data Explorer</Link></li>
              <li><Link to="/app/voice" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">Voice Care</Link></li>
              <li><Link to="/app/about" className="text-sm text-slate-300 hover:text-teal-400 transition no-underline">About</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/30 transition" aria-label="GitHub">
                <Github size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/30 transition" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/30 transition" aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Built with care for the future of Indian healthcare.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© 2026 HealthRipple AI · Namma Saathi care experience · Demo data is synthetic</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-amber-400 bg-amber-400/10 rounded-full px-2.5 py-1">
              PROTOTYPE
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-emerald-400 bg-emerald-400/10 rounded-full px-2.5 py-1">
              SIMULATED DATA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
