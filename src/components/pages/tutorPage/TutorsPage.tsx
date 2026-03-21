"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorFilter, TutorFilters } from "./TutorFilter";
import { FormattedTutor } from "./TutorCard";
import { TutorList } from "./TutorList";
import { TutorProfile } from "./TutorProfile";
import { getTutors, getCategories } from "@/services/tutors.services";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, PaginationMeta } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";

const DEFAULT_FILTERS: TutorFilters = {
  search: "",
  category: "All",
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  availableOnly: false,
};

export default function TutorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { page, handlePageChange } = usePagination();

  const [filters, setFilters] = useState<TutorFilters>(() => {
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "All";
    return { ...DEFAULT_FILTERS, search, category };
  });

  const [tutors, setTutors] = useState<FormattedTutor[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showFilter, setShowFilter] = useState(false);

  const [showDrawer, setShowDrawer] = useState(false);

  const [selectedTutor, setSelectedTutor] = useState<FormattedTutor | null>(
    null,
  );

  const activeFilterCount = [
    filters.category !== "All",
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
    filters.minRating !== undefined,
    filters.availableOnly,
    filters.search !== "",
  ].filter(Boolean).length;

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getTutors(filters, page);
      if (result) {
        setTutors(result.data);
        setPaginations(result.paginations);
      } else {
        setError("Failed to load tutors. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [filters, page]);

  const handleFilterChange = (newFilters: TutorFilters) => {
    setFilters(newFilters);
    handlePageChange(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Find a Tutor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {paginations
                ? `${paginations.total} tutor${paginations.total !== 1 ? "s" : ""} found`
                : ""}
            </p>
          </div>

          <Button
            variant={showFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilter((v) => !v)}
            className="gap-2 hidden md:flex"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilter ? "Hide Filters" : "Filters"}
            {activeFilterCount > 0 && (
              <span className="bg-white text-[#0d7a5f] text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <button
            onClick={() => setShowDrawer(true)}
            className="flex md:hidden items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border transition-all"
            style={
              activeFilterCount > 0
                ? {
                    background: "#0d7a5f",
                    color: "#fff",
                    borderColor: "#0d7a5f",
                  }
                : undefined
            }
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-[#0d7a5f] text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div
          className={`grid gap-5 items-start ${showFilter ? "md:grid-cols-[260px_1fr]" : "grid-cols-1"}`}
        >
          {showFilter && (
            <div className="hidden md:block">
              <TutorFilter
                filters={filters}
                onChange={handleFilterChange}
                categories={categories}
              />
            </div>
          )}

          <div>
            <TutorList
              tutors={tutors}
              isLoading={isLoading}
              onSelect={setSelectedTutor}
            />
            {paginations && (
              <Pagination
                paginations={paginations}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {showDrawer && (
        <TutorFilter
          filters={filters}
          onChange={handleFilterChange}
          categories={categories}
          asDrawer
          onClose={() => setShowDrawer(false)}
        />
      )}

      <TutorProfile
        tutor={selectedTutor}
        onClose={() => setSelectedTutor(null)}
        onBook={(tutor) => router.push(`/tutors/${tutor.id}`)}
      />
    </div>
  );
}
