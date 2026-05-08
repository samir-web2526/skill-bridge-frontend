import type { ElementType } from "react";
import {
  Calculator,
  Zap,
  FlaskConical,
  Microscope,
  Globe,
  BookOpen,
  Languages,
  Cpu,
} from "lucide-react";

export const CATEGORY_COLORS: Record<
  string,
  {
    bg: string;
    text: string;
    icon: ElementType;
    darkColor: string;
    shadowHex: string;
  }
> = {
  Math: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: Calculator,
    darkColor: "text-emerald-300",
    shadowHex: "#10b981",
  },
  "Higher Math": {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    text: "text-yellow-700 dark:text-yellow-300",
    icon: Calculator,
    darkColor: "text-yellow-300",
    shadowHex: "#eab308",
  },
  Physics: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    icon: Zap,
    darkColor: "text-indigo-300",
    shadowHex: "#6366f1",
  },
  Chemistry: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    icon: FlaskConical,
    darkColor: "text-purple-300",
    shadowHex: "#a855f7",
  },
  Biology: {
    bg: "bg-green-50 dark:bg-green-950/40",
    text: "text-green-700 dark:text-green-300",
    icon: Microscope,
    darkColor: "text-green-300",
    shadowHex: "#22c55e",
  },
  English: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    icon: Globe,
    darkColor: "text-orange-300",
    shadowHex: "#f97316",
  },
  Bangla: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    icon: Languages,
    darkColor: "text-rose-300",
    shadowHex: "#f43f5e",
  },
  ICT: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-300",
    icon: Cpu,
    darkColor: "text-cyan-300",
    shadowHex: "#06b6d4",
  },
  default: {
    bg: "bg-gray-50 dark:bg-zinc-900/50",
    text: "text-gray-700 dark:text-zinc-300",
    icon: BookOpen,
    darkColor: "text-gray-300",
    shadowHex: "#71717a",
  },
};

export function getCategoryColor(name: string) {
  return CATEGORY_COLORS[name] ?? CATEGORY_COLORS.default;
}
