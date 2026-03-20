"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { TutorProfileDialog } from "./TutorProfile";
import { getAvailableTutors } from "@/lib/auth/studentActions/actions";



export default function StudentTutorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tutors, setTutors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getAvailableTutors(1, 50);
      if (result) {
        setTutors(result.data);
      } else {
        setError("Failed to load tutors. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Find Tutors</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {!isLoading
            ? `${tutors.length} tutor${tutors.length !== 1 ? "s" : ""} available`
            : ""}
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-zinc-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead>Tutor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : tutors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  No tutors available
                </TableCell>
              </TableRow>
            ) : (
              tutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>
                    <p className="font-medium text-sm">
                      {tutor.user?.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tutor.user?.email ?? ""}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tutor.category?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    ৳{tutor.hourlyRate}/hr
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {Number(tutor.averageRating).toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({tutor.totalReview})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tutor.experience ? `${tutor.experience} yrs` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedTutor(tutor)}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TutorProfileDialog
        open={!!selectedTutor}
        tutor={selectedTutor}
        onClose={() => setSelectedTutor(null)}
      />
    </div>
  );
}
