/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTutors, TutorProfile } from "@/services/tutors.service";

export default function AllTutors() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await getTutors({
        page,
        limit: 6,
        isDeleted: false,
        searchTerm: debouncedSearch || undefined,
      });

      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      setTutors(res.data ?? []);
      setMeta(res.meta);
      setLoading(false);
    };

    load();
  }, [page, debouncedSearch]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Active Tutors</h1>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tutors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground outline-none focus:border-emerald-500 w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="border border-border rounded-xl shadow-sm p-5 bg-card hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={tutor.user?.image || "/avatar.png"}
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    {tutor.user?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {tutor.category?.name}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>📧 {tutor.user?.email}</p>
                <p>📞 {tutor.user?.phone || "N/A"}</p>
                <p>💰 Hourly: {tutor.hourlyRate} BDT</p>
                <p>⭐ Rating: {tutor.averageRating ?? "0"}</p>
                <p>📚 Experience: {tutor.experience} years</p>
                <p>
                  🟢 Availability:{" "}
                  {tutor.availability ? "Available" : "Not Available"}
                </p>
              </div>

              {/* Bio */}
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {tutor.bio}
              </p>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {tutor.availableFrom} - {tutor.availableTo}
                </span>
                <span>
                  Bookings: {tutor.totalBookings ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <div className="flex justify-center gap-3 mt-6">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="px-3 py-2 text-sm">
            Page {page} of {meta.totalPage}
          </span>

          <Button
            disabled={page === meta.totalPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}