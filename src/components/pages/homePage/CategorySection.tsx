"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { Category } from "@/services/category.service";


export default function CategorySection({
  categories,
}: {
  categories: Category[];
}) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? categories : categories.slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible?.map((cat) => {
          const {
            bg,
            text,
            icon: Icon,
            shadowHex,
          } = getCategoryColor(cat.name);
          return (
            <Card
              key={cat.id}
              className={`group cursor-pointer border-0 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col ${bg}`}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 12px 24px -10px ${shadowHex}`)
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <CardContent className="p-6 text-center flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl ${bg} brightness-95 flex items-center justify-center mx-auto mb-4`}>
                   <Icon size={24} className={text} />
                </div>
                <div
                  className={`font-bold text-base mb-2 ${text}`}
                >
                  {cat.name}
                </div>
                <div className={`text-xs leading-relaxed ${text} opacity-80 line-clamp-3 mb-6 flex-1`}>
                  {cat.description || `Find the best tutors for ${cat.name} and improve your grades with personalized sessions.`}
                </div>
                <div className="mt-auto pt-2 border-t border-current/10">
                   <p className={`text-[10px] font-bold uppercase tracking-wider ${text}`}>Explore {cat._count?.tutor ?? 0} Tutors</p>
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
            className="gap-2 text-sm font-semibold border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-sm animate-[bounce_2s_ease-in-out_infinite]"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show All {categories.length} Categories{" "}
                <ChevronDown size={16} />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
