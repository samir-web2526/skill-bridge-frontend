// export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
//   Math: { bg: "bg-emerald-50", text: "text-emerald-700" },
//   "Higher Math": { bg: "bg-yellow-50", text: "text-yellow-700" },
//   Physics: { bg: "bg-indigo-50", text: "text-indigo-700" },
//   Chemistry: { bg: "bg-purple-50", text: "text-purple-700" },
//   Biology: { bg: "bg-green-50", text: "text-green-700" },
//   English: { bg: "bg-orange-50", text: "text-orange-700" },
//   Bangla: { bg: "bg-rose-50", text: "text-rose-700" },
//   default: { bg: "bg-gray-50", text: "text-gray-700" },
// };

// export function getCategoryColor(name: string) {
//   return CATEGORY_COLORS[name] ?? CATEGORY_COLORS.default;
// }

import type { ElementType } from "react";
import { Calculator, Zap, FlaskConical, Microscope, Globe, BookOpen, Languages, Cpu } from "lucide-react";

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: ElementType; darkColor: string }> = {
  Math:          { bg: "bg-emerald-50", text: "text-emerald-700", icon: Calculator,   darkColor: "text-emerald-300" },
  "Higher Math": { bg: "bg-yellow-50",  text: "text-yellow-700",  icon: Calculator,   darkColor: "text-yellow-300" },
  Physics:       { bg: "bg-indigo-50",  text: "text-indigo-700",  icon: Zap,          darkColor: "text-indigo-300" },
  Chemistry:     { bg: "bg-purple-50",  text: "text-purple-700",  icon: FlaskConical, darkColor: "text-purple-300" },
  Biology:       { bg: "bg-green-50",   text: "text-green-700",   icon: Microscope,   darkColor: "text-green-300" },
  English:       { bg: "bg-orange-50",  text: "text-orange-700",  icon: Globe,        darkColor: "text-orange-300" },
  Bangla:        { bg: "bg-rose-50",    text: "text-rose-700",    icon: Languages,    darkColor: "text-rose-300" },
  ICT:           { bg: "bg-cyan-50",    text: "text-cyan-700",    icon: Cpu,          darkColor: "text-cyan-300" },
  default:       { bg: "bg-gray-50",    text: "text-gray-700",    icon: BookOpen,     darkColor: "text-gray-300" },
};

export function getCategoryColor(name: string) {
  return CATEGORY_COLORS[name] ?? CATEGORY_COLORS.default;
}