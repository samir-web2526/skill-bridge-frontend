export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Math: { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Higher Math": { bg: "bg-yellow-50", text: "text-yellow-700" },
  Physics: { bg: "bg-indigo-50", text: "text-indigo-700" },
  Chemistry: { bg: "bg-purple-50", text: "text-purple-700" },
  Biology: { bg: "bg-green-50", text: "text-green-700" },
  English: { bg: "bg-orange-50", text: "text-orange-700" },
  Bangla: { bg: "bg-rose-50", text: "text-rose-700" },
  default: { bg: "bg-gray-50", text: "text-gray-700" },
};

export function getCategoryColor(name: string) {
  return CATEGORY_COLORS[name] ?? CATEGORY_COLORS.default;
}
