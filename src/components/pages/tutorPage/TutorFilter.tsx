"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw } from "lucide-react";

export type TutorFilters = {
  search: string;
  category: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minRating: number | undefined;
  availableOnly: boolean;
};

type Props = {
  filters: TutorFilters;
  onChange: (filters: TutorFilters) => void;
  categories: string[];
};

const DEFAULT_FILTERS: TutorFilters = {
  search: "",
  category: "All",
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  availableOnly: false,
};

const RATING_OPTIONS = [
  { label: "Any", value: undefined },
  { label: "4.0+", value: 4.0 },
  { label: "4.5+", value: 4.5 },
  { label: "4.8+", value: 4.8 },
];

export function TutorFilter({ filters, onChange, categories }: Props) {
  const allCategories = ["All", ...categories];

  const activeFilterCount = [
    filters.category !== "All",
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
    filters.minRating !== undefined,
    filters.availableOnly,
    filters.search !== "",
  ].filter(Boolean).length;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm text-foreground">Filters</p>
          {activeFilterCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 h-auto">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Name or subject..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Category
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...filters, category: c })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                filters.category === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Price (৳/hr)
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-9 text-sm"
          />
          <span className="text-muted-foreground text-sm shrink-0">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Min Rating
        </Label>
        <div className="flex gap-1.5">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r.label}
              onClick={() => onChange({ ...filters, minRating: r.value })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                filters.minRating === r.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground cursor-pointer">
          Available Only
        </Label>
        <Switch
          checked={filters.availableOnly}
          onCheckedChange={(checked) =>
            onChange({ ...filters, availableOnly: checked })
          }
        />
      </div>
    </div>
  );
}
