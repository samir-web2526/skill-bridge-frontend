"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getCategories } from "@/services/category.service";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPopular() {
      const result = await getCategories({ page: 1, limit: 20 });

if (result.data) {
  const sorted = [...result.data]
    .sort(
      (a, b) =>
        (b.totalBookings ?? 0) - (a.totalBookings ?? 0)
    )
    .slice(0, 5)
    .map((cat) => cat.name);

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
      <div className="flex gap-2 p-1.5 bg-card border border-border rounded-xl shadow-sm mb-4 max-w-lg">
        <Search size={15} className="ml-2 self-center text-muted-foreground shrink-0" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by subject or tutor name..."
          className="border-0 shadow-none focus-visible:ring-0 text-sm bg-transparent"
        />
        <Button
          onClick={handleSearch}
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg text-sm px-5 shrink-0 text-white"
        >
          Search
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-10">
        <span className="text-xs text-muted-foreground font-medium">Popular:</span>
        {popularCategories.length > 0 ? (
          popularCategories.map((t) => (
            <Badge
              key={t}
              onClick={() => handleBadgeClick(t)}
              variant="outline"
              className="cursor-pointer text-xs rounded-full px-3 py-1 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 dark:border-zinc-800 transition-colors"
            >
              {t}
            </Badge>
          ))
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse"
            />
          ))
        )}
      </div>
    </div>
  );
}