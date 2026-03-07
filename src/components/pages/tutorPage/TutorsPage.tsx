"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorFilter, TutorFilters } from "./TutorFilter";
import { FormattedTutor } from "./TutorCard";

import { TutorList } from "./TutorList";
import { TutorProfile } from "./TutorProfile";
import { getTutors } from "@/services/tutors.services";
import { useRouter } from "next/navigation";
import { Pagination, PaginationMeta } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";

const CATEGORIES = [
  "Math",
  "Higher Math",
  "Physics",
  "Chemistry",
  "Biology",
  "Bangla",
  "English",
];

const DEFAULT_FILTERS: TutorFilters = {
  search: "",
  category: "All",
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  availableOnly: false,
};

export default function TutorsPage() {
  const [tutors, setTutors] = useState<FormattedTutor[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TutorFilters>(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<FormattedTutor | null>(
    null,
  );

  const router = useRouter();
  const { page, handlePageChange } = usePagination();

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
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilter ? "Hide Filters" : "Filters"}
          </Button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div
          className={`grid gap-5 items-start ${showFilter ? "grid-cols-[260px_1fr]" : "grid-cols-1"}`}
        >
          {showFilter && (
            <TutorFilter
              filters={filters}
              onChange={handleFilterChange}
              categories={CATEGORIES}
            />
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

      <TutorProfile
        tutor={selectedTutor}
        onClose={() => setSelectedTutor(null)}
        onBook={(tutor) => router.push(`/tutors/${tutor.id}`)}
      />
    </div>
  );
}
