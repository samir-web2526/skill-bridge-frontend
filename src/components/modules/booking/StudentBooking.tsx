"use client";

import React, { useEffect, useState } from "react";
import { getAllBookings } from "@/services/booking.service";
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

export default function StudentBookingList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const res = await getAllBookings(); // backend handles pagination
      setBookings(res.data || []);
      setTotalPage(res.paginations?.totalPage || 1);
      setLoading(false);
    };
    fetchBookings();
  }, [page]);

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;
  if (bookings.length === 0) return <p className="text-center mt-10">No bookings yet.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Bookings</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tutor</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id} className="hover:bg-gray-50">
              {/* Tutor */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={b.tutor?.user?.image || "https://i.pravatar.cc/150?img=4"}
                    />
                    <AvatarFallback>👨‍🏫</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {b.tutor?.name || b.tutor?.bio || "No Name"}
                  </span>
                </div>
              </TableCell>

              {/* Experience */}
              <TableCell>{b.tutor?.experience || 0} yrs</TableCell>

              {/* Rate */}
              <TableCell>{b.tutor?.hourlyRate || 0} BDT/hr</TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant={
                    b.status === "CONFIRMED"
                      ? "success"
                      : b.status === "PENDING"
                      ? "warning"
                      : "secondary"
                  }
                >
                  {b.status}
                </Badge>
              </TableCell>

              {/* Created At */}
              <TableCell className="text-gray-500 text-sm">
                {new Date(b.createdAt).toLocaleString()}
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