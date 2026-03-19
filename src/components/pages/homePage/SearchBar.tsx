/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/lib/auth/adminActions/actions";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPopular() {
      const result = await getAllCategories(1, 20);
      if (result?.data) {
        const sorted = [...result.data]
          .sort((a, b) => {
            const totalBookingsA = a.tutor.reduce(
              (sum: number, t: any) => sum + (t._count?.booking ?? 0),
              0
            );
            const totalBookingsB = b.tutor.reduce(
              (sum: number, t: any) => sum + (t._count?.booking ?? 0),
              0
            );
            return totalBookingsB - totalBookingsA;
          })
          .slice(0, 5)
          .map((cat: any) => cat.name);

        setPopularCategories(sorted);
      }
    }

    fetchPopular();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/tutors?search=${encodeURIComponent(search.trim())}`);
  };

  const handleBadgeClick = (categoryName: string) => {
    router.push(`/tutors?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div>
      <div className="flex gap-2 p-1.5 bg-white border border-zinc-200 rounded-xl shadow-sm mb-4 max-w-lg">
        <Search size={15} className="ml-2 self-center text-zinc-400 shrink-0" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by subject or tutor name..."
          className="border-0 shadow-none focus-visible:ring-0 text-sm bg-transparent"
        />
        <Button
          onClick={handleSearch}
          className="bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm px-5 shrink-0"
        >
          Search
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-10">
        <span className="text-xs text-zinc-400 font-medium">Popular:</span>
        {popularCategories.length > 0 ? (
          popularCategories.map((t) => (
            <Badge
              key={t}
              onClick={() => handleBadgeClick(t)}
              variant="outline"
              className="cursor-pointer text-xs rounded-full px-3 py-1 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {t}
            </Badge>
          ))
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-20 rounded-full bg-zinc-100 animate-pulse"
            />
          ))
        )}
      </div>
    </div>
  );
}