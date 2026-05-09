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
    bg: "bg-primary/10",
    text: "text-primary",
    icon: Calculator,
    darkColor: "text-primary",
    shadowHex: "var(--color-primary)",
  },
  "Higher Math": {
    bg: "bg-chart-1/10",
    text: "text-chart-1",
    icon: Calculator,
    darkColor: "text-chart-1",
    shadowHex: "var(--color-chart-1)",
  },
  Physics: {
    bg: "bg-chart-2/10",
    text: "text-chart-2",
    icon: Zap,
    darkColor: "text-chart-2",
    shadowHex: "var(--color-chart-2)",
  },
  Chemistry: {
    bg: "bg-chart-3/10",
    text: "text-chart-3",
    icon: FlaskConical,
    darkColor: "text-chart-3",
    shadowHex: "var(--color-chart-3)",
  },
  Biology: {
    bg: "bg-chart-4/10",
    text: "text-chart-4",
    icon: Microscope,
    darkColor: "text-chart-4",
    shadowHex: "var(--color-chart-4)",
  },
  English: {
    bg: "bg-chart-5/10",
    text: "text-chart-5",
    icon: Globe,
    darkColor: "text-chart-5",
    shadowHex: "var(--color-chart-5)",
  },
  Bangla: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    icon: Languages,
    darkColor: "text-destructive",
    shadowHex: "var(--color-destructive)",
  },
  ICT: {
    bg: "bg-secondary",
    text: "text-secondary-foreground",
    icon: Cpu,
    darkColor: "text-secondary-foreground",
    shadowHex: "var(--color-secondary)",
  },
  default: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    icon: BookOpen,
    darkColor: "text-muted-foreground",
    shadowHex: "var(--color-muted)",
  },
};

export function getCategoryColor(name: string) {
  return CATEGORY_COLORS[name] ?? CATEGORY_COLORS.default;
}
