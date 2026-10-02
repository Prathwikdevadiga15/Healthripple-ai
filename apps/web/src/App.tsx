import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import Home from "@/pages/Home";
import CommandCenter from "@/pages/CommandCenter";
import CarePulse from "@/pages/CarePulse";
import CareBridge from "@/pages/CareBridge";
import CareAccess from "@/pages/CareAccess";
import VoiceCare from "@/pages/VoiceCare";
import Safety from "@/pages/Safety";
import Architecture from "@/pages/Architecture";
import About from "@/pages/About";
import AgentWorkspace from "@/pages/AgentWorkspace";
import DataExplorer from "@/pages/DataExplorer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<CommandCenter />} />
        <Route path="carepulse" element={<CarePulse />} />
        <Route path="carebridge" element={<CareBridge />} />
        <Route path="careaccess" element={<CareAccess />} />
        <Route path="agents/:agentSlug" element={<AgentWorkspace />} />
        <Route path="data" element={<DataExplorer />} />
        <Route path="voice" element={<VoiceCare />} />
        <Route path="safety" element={<Safety />} />
        <Route path="architecture" element={<Architecture />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
