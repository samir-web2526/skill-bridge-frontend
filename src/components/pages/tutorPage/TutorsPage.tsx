"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TutorFilter, TutorFilters } from "./TutorFilter";
import { TutorList } from "./TutorList";
import { TutorProfile } from "./TutorProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, PaginationMeta } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { getCategories } from "@/services/category.service";
import { getTutors } from "@/services/tutors.service";

import { formatTutor, FormattedTutor } from "./TutorCard";

const DEFAULT_FILTERS: TutorFilters = {
  search: "",
  category: "All",
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  availableOnly: false,
  sortBy: "createdAt",
  sortOrder: "desc",
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

  const activeFilterCount = [
    filters.category !== "All",
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
    filters.minRating !== undefined,
    filters.availableOnly,
    filters.search !== "",
    filters.sortBy !== "createdAt",
  ].filter(Boolean).length;

  useEffect(() => {
    const loadCategories = async () => {
      const res = await getCategories();
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data.map((cat) => cat.name));
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getTutors({
        searchTerm: filters.search || undefined,
        category: filters.category !== "All" ? filters.category : undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        availableOnly: filters.availableOnly || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page,
        limit: 10,
      });

      if (result.data) {
        const formatted = result.data.map(formatTutor);
        setTutors(formatted);
        setPaginations(result.meta);
      } else {
        setTutors([]);
        setError(result.error);
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
      <div className="max-w-7xl mx-auto px-4 py-8">

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
              <span className="bg-primary text-primary-foreground text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <button
            onClick={() => setShowDrawer(true)}
            className={cn(
              "flex md:hidden items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border transition-all shadow-sm",
              activeFilterCount > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-background text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
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
              onSelect={(t) => router.push(`/tutors/${t.id}`)}
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

    </div>
  );
}
