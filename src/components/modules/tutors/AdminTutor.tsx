"use client";

import React, { useEffect, useState } from "react";
import { deleteTutor, getAllTutors } from "@/services/tutor.service";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationContent,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

export default function AdminTutorsTable() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const res = await getAllTutors();
        console.log(res);

        // Set tutors array from API
        setTutors(res.data?.data || []);

        // Set total pages from API
        setTotalPage(res.data?.paginations?.totalPage || 1);
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
        setTutors([]);
        setTotalPage(1);
      }
      setLoading(false);
    };
    fetchTutors();
  }, [page]);

  if (loading) return <p className="text-center mt-10">Loading tutors...</p>;
  if (tutors.length === 0)
    return <p className="text-center mt-10">No tutors found.</p>;

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this tutor?",
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteTutor(id);

     if(res){
       setTutors((prev) => prev.filter((tutor) => tutor.id !== id));
     }

      alert("Tutor deleted successfully");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Tutors</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Total Bookings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tutors?.map((tutor) => (
            <TableRow key={tutor.id} className="hover:bg-gray-50">
              {/* Avatar */}
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={tutor.user?.image || "https://i.pravatar.cc/150?img=4"}
                  />
                  <AvatarFallback>{tutor.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>

              {/* Name */}
              <TableCell>{tutor.user?.name || "No Name"}</TableCell>

              {/* Bio */}
              <TableCell>{tutor.bio || "No Bio"}</TableCell>

              {/* Category */}
              <TableCell>{tutor.category?.name || "N/A"}</TableCell>

              {/* Total Bookings */}
              <TableCell>{tutor.totalBookings || 0}</TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant={
                    tutor.status === "ACTIVE"
                      ? "success"
                      : tutor.status === "INACTIVE"
                        ? "secondary"
                        : "warning"
                  }
                >
                  {tutor?.user?.status || "Unknown"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(tutor.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPage > 1 && (
        <Pagination className="mt-6 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(page - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPage }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={i + 1 === page}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(page + 1, totalPage))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
