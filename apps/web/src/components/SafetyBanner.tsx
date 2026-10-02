import { Shield } from "lucide-react";

export default function SafetyBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-50 border border-amber-200/40 rounded-2xl px-5 py-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
        <Shield size={16} className="text-amber-600" />
      </div>
      <div>
        <p className="text-xs font-bold text-amber-800 mb-1">Decision Support — Not a Medical Diagnosis</p>
        <p className="text-[11px] text-amber-700 leading-relaxed">
          This is a prototype for decision support and education. It is not a substitute for professional medical diagnosis or treatment. All data shown is simulated. Never rely on this system for emergency medical decisions — seek professional help immediately.
        </p>
      </div>
    </div>
  );
}
