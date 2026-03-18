// src/components/pages/homePage/CategorySection.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryColor } from "@/lib/category/categoryColors";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

export default function CategorySection({ categories }: { categories: Category[] }) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? categories : categories.slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((cat) => {
          const { bg, text, icon: Icon } = getCategoryColor(cat.name);
          return (
            <Card
              key={cat.id}
              className={`group cursor-pointer border-0 hover:-translate-y-1 transition-all duration-200 ${bg}`}
            >
              <CardContent className="p-5 text-center">
                <Icon size={22} className={`mx-auto mb-3 ${text}`} />
                <div className={`font-semibold text-sm mb-1 ${text} opacity-90`}>
                  {cat.name}
                </div>
                <div className={`text-xs leading-relaxed ${text} opacity-70`}>
                  {cat.description ?? ""}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {categories.length > 4 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2 text-sm font-semibold border-zinc-200 hover:border-emerald-300 hover:text-emerald-700"
          >
            {showAll ? (
              <>Show Less <ChevronUp size={16} /></>
            ) : (
              <>Show All {categories.length} Categories <ChevronDown size={16} /></>
            )}
          </Button>
        </div>
      )}
    </>
  );
}