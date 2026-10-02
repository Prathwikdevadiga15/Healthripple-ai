import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, MicOff, Globe, Volume2, MessageSquare, CheckCircle2 } from "lucide-react";
import SafetyBanner from "@/components/SafetyBanner";
import { SUPPORTED_LANGUAGES } from "@/data/demoData";

export default function VoiceCare() {
  const reduce = useReducedMotion();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [transcript, setTranscript] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setTranscript("My blood pressure has been high recently and I feel tired all the time. Can you help me understand what's happening?");
      setTimeout(() => setShowResponse(true), 1500);
    } else {
      setIsRecording(true);
      setTranscript("");
      setShowResponse(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
            <Mic size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-head font-extrabold text-2xl text-navy-900">Multilingual Voice Care</h1>
            <p className="text-xs text-slate-400">Speak in your language · AI understands and responds</p>
          </div>
        </div>
      </motion.div>

      <SafetyBanner />

      {/* Language Selection */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.05 }}
        className="card-premium p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Globe size={14} className="text-teal" />
          <span className="text-xs font-bold text-navy-900">Select Language</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`rounded-2xl px-5 py-3 text-center transition-all duration-200 border ${
                selectedLang === lang.code
                  ? "bg-gradient-to-br from-primary to-teal text-white border-transparent shadow-glow"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-200 hover:bg-teal-50/30"
              }`}
            >
              <div className="font-head font-bold text-sm">{lang.nativeLabel}</div>
              <div className={`text-[10px] ${selectedLang === lang.code ? "text-white/80" : "text-slate-400"}`}>{lang.label}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recording Interface */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: 0.1 }}
        className="card-premium p-8 text-center"
      >
        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-1 h-16 mb-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-full ${isRecording ? "bg-gradient-to-t from-primary to-teal" : "bg-slate-200"}`}
              animate={isRecording ? {
                height: [12, Math.random() * 48 + 12, 12],
              } : { height: 12 }}
              transition={isRecording ? {
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.05,
              } : {}}
              style={{ height: 12 }}
            />
          ))}
        </div>

        {/* Record Button */}
        <button
          onClick={handleRecord}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-110"
              : "bg-gradient-to-br from-primary to-teal hover:shadow-glow"
          }`}
        >
          {isRecording ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-white" />}
        </button>

        <p className="text-sm font-semibold text-navy-900 mb-1">
          {isRecording ? "Listening... tap to stop" : "Tap to start speaking"}
        </p>
        <p className="text-[11px] text-slate-400">
          {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.label} selected
        </p>
      </motion.div>

      {/* Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={14} className="text-teal" />
            <span className="text-xs font-bold text-navy-900">Transcription</span>
            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">Simulated</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed italic">"{transcript}"</p>
        </motion.div>
      )}

      {/* Response */}
      {showResponse && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Volume2 size={14} className="text-primary" />
            <span className="text-xs font-bold text-navy-900">AI Voice Response</span>
            <span className="text-[9px] font-bold bg-teal-50 text-teal-700 rounded-full px-2 py-0.5">Evidence-Grounded</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            I can see from your recent health data that your blood pressure has increased and your medication adherence has declined. These changes, combined with the fatigue you're experiencing, suggest you should schedule a follow-up with your doctor within the next week.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Agent Workflow</div>
            {["Voice transcription", "Intent: health concern — vitals + fatigue", "Agent: CarePulse (early warning)", "Evidence: vital trends, adherence data, lab history", "Safety: No emergency indicators", "Response generated"].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 size={10} className="text-teal shrink-0" /> {step}
              </div>
            ))}
          </div>

          <div className="text-center">
            <span className="text-[9px] font-bold tracking-widest text-amber-600 bg-amber-50 rounded-full px-3 py-1 uppercase">
              Simulated Voice Response · Not Real Medical Advice
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
