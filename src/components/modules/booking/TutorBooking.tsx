"use client";

import React, { useEffect, useState } from "react";
import { getAllBookings, updateBooking } from "@/services/booking.service";
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

export default function TutorBookingList() {
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
  if (bookings.length === 0)
    return <p className="text-center mt-10">No bookings yet.</p>;

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await updateBooking(bookingId, { status });

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Tutor Bookings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-gray-50">
              {/* Student */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        booking.user?.image || "https://i.pravatar.cc/150?img=3"
                      }
                    />
                    <AvatarFallback>👤</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {booking.user?.name || "No Name"}
                  </span>
                </div>
              </TableCell>

              {/* Phone */}
              <TableCell>{booking.user?.phone || "017*****"}</TableCell>

              {/* Rate */}
              <TableCell>{booking.tutor?.hourlyRate || 0} BDT/hr</TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant={
                    booking.status === "CONFIRMED"
                      ? "success"
                      : booking.status === "PENDING"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {booking.status}
                </Badge>
              </TableCell>

              {/* Created At */}
              <TableCell className="text-gray-500 text-sm">
                {new Date(booking.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {booking.status === "PENDING" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() =>
                        handleUpdateStatus(booking.id, "CONFIRMED")
                      }
                    >
                      Confirm
                    </Button>
                  )}

                  {booking.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() =>
                        handleUpdateStatus(booking.id, "COMPLETED")
                      }
                    >
                      Complete
                    </Button>
                  )}

                  {booking.status === "COMPLETED" && (
                    <span className="text-green-700 font-semibold">
                      Completed
                    </span>
                  )}
                </div>
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
