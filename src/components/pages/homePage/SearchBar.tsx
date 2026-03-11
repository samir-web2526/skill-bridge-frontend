"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const popular = ["Mathematics", "Physics", "English", "Chemistry", "Biology"];

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <div>
      {/* Search box */}
      <div className="flex gap-2 p-1.5 bg-white border border-zinc-200 rounded-xl shadow-sm mb-4 max-w-lg">
        <Search size={15} className="ml-2 self-center text-zinc-400 shrink-0" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by subject or tutor name..."
          className="border-0 shadow-none focus-visible:ring-0 text-sm bg-transparent"
        />
        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm px-5 shrink-0">
          Search
        </Button>
      </div>

      {/* Popular tags */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <span className="text-xs text-zinc-400 font-medium">Popular:</span>
        {popular.map(t => (
          <Badge
            key={t}
            variant="outline"
            className="cursor-pointer text-xs rounded-full px-3 py-1 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
}