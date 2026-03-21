"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  asDrawer?: boolean;
  onClose?: () => void;
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

const BANNER_GREEN = "#0d7a5f";

export function TutorFilter({
  filters,
  onChange,
  categories,
  asDrawer,
  onClose,
}: Props) {
  const allCategories = ["All", ...categories];

  const activeFilterCount = [
    filters.category !== "All",
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
    filters.minRating !== undefined,
    filters.availableOnly,
    filters.search !== "",
  ].filter(Boolean).length;

  const content = (
    <>
      <div className="px-4.5 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          {asDrawer && (
            <div className="w-8 h-1 rounded-full bg-border absolute top-3 left-1/2 -translate-x-1/2" />
          )}
          <p className="text-sm font-medium text-foreground">Filters</p>
          {activeFilterCount > 0 && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
              style={{ background: BANNER_GREEN }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}
          {asDrawer && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 text-xs font-medium px-3"
              style={{ color: BANNER_GREEN }}
            >
              Done
            </Button>
          )}
        </div>
      </div>

      <div className="px-4.5 py-3.5 flex flex-col gap-2 border-b border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
          Search
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Name or subject..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9 h-9 text-sm rounded-[10px] bg-muted/40 border-border focus-visible:ring-0"
            style={{
              outline: "none",
              boxShadow: "none",
              borderColor: filters.search ? BANNER_GREEN : undefined,
            }}
          />
        </div>
      </div>

      <div className="px-4.5 py-3.5 flex flex-col gap-2.5 border-b border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
          Category
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allCategories.map((c) => {
            const isActive = filters.category === c;
            return (
              <button
                key={c}
                onClick={() => onChange({ ...filters, category: c })}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
                style={
                  isActive
                    ? {
                        background: BANNER_GREEN,
                        color: "#fff",
                        borderColor: BANNER_GREEN,
                        boxShadow: `0 4px 12px -2px ${BANNER_GREEN}66`,
                      }
                    : {
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        borderColor: "var(--color-border-tertiary)",
                      }
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4.5 py-3.5 flex flex-col gap-2.5 border-b border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
          Price (৳/hr)
        </p>
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
            className="h-9 text-sm rounded-[10px] bg-muted/40 border-border focus-visible:ring-0 text-center"
            style={{
              boxShadow: "none",
              borderColor: filters.minPrice ? BANNER_GREEN : undefined,
            }}
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
            className="h-9 text-sm rounded-[10px] bg-muted/40 border-border focus-visible:ring-0 text-center"
            style={{
              boxShadow: "none",
              borderColor: filters.maxPrice ? BANNER_GREEN : undefined,
            }}
          />
        </div>
      </div>

      <div className="px-4.5 py-3.5 flex flex-col gap-2.5 border-b border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
          Min Rating
        </p>
        <div className="flex gap-1.5">
          {RATING_OPTIONS.map((r) => {
            const isActive = filters.minRating === r.value;
            return (
              <button
                key={r.label}
                onClick={() => onChange({ ...filters, minRating: r.value })}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
                style={
                  isActive
                    ? {
                        background: BANNER_GREEN,
                        color: "#fff",
                        borderColor: BANNER_GREEN,
                        boxShadow: `0 4px 12px -2px ${BANNER_GREEN}66`,
                      }
                    : {
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        borderColor: "var(--color-border-tertiary)",
                      }
                }
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4.5 py-3.5 flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground cursor-pointer">
          Available only
        </Label>
        <Switch
          checked={filters.availableOnly}
          onCheckedChange={(checked) =>
            onChange({ ...filters, availableOnly: checked })
          }
          style={
            filters.availableOnly
              ? ({ "--switch-bg": BANNER_GREEN } as React.CSSProperties)
              : undefined
          }
          className={filters.availableOnly ? "[&>span]:bg-[#0d7a5f]" : ""}
        />
      </div>
    </>
  );

  if (!asDrawer) {
    return (
      <div className="bg-card border border-border rounded-4xl overflow-hidden flex flex-col">
        {content}
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-4xl overflow-hidden flex flex-col max-h-[85vh] overflow-y-auto">
        <div className="w-9 h-1 rounded-full bg-border mx-auto mt-3 mb-1 shrink-0" />
        {content}
      </div>
    </>
  );
}
