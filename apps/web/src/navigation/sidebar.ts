import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Compass,
  Database,
  FileSearch,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Mic,
  Pill,
  Server,
  Shield,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "AI Care Center", path: "/app", icon: LayoutDashboard },
    ],
  },
  {
    title: "AI Agents",
    items: [
      { label: "CarePulse", path: "/app/carepulse", icon: Activity },
      { label: "CareBridge", path: "/app/carebridge", icon: BookOpen },
      { label: "CareAccess", path: "/app/careaccess", icon: Compass },
      { label: "MedGuide", path: "/app/agents/medguide", icon: Pill },
      { label: "CareLocate", path: "/app/agents/carelocate", icon: MapPin },
      { label: "ReportLens", path: "/app/agents/reportlens", icon: FileSearch },
      { label: "HealthLearn", path: "/app/agents/healthlearn", icon: GraduationCap },
    ],
  },
  {
    title: "Features",
    items: [
      { label: "Voice Care", path: "/app/voice", icon: Mic },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Safety & AI", path: "/app/safety", icon: Shield },
      { label: "Data Explorer", path: "/app/data", icon: Database },
      { label: "Architecture", path: "/app/architecture", icon: Server },
      { label: "About", path: "/app/about", icon: Users },
    ],
  },
];

export const HOME_NAV_ITEMS = [
  { label: "Platform", path: "/#platform" },
  { label: "Seven agents", path: "/#agents" },
  { label: "Safety", path: "/app/safety" },
  { label: "Technology", path: "/app/architecture" },
  { label: "About", path: "/app/about" },
];
