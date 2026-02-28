"use client";

import React, { useEffect, useState } from "react";
import { cancelBooking, getAllBookings } from "@/services/booking.service";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

import ReviewModal from "../review/Review";

export default function StudentBookingList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await getAllBookings();
      console.log(res);

      setBookings(
        (res?.data || []).map((b: any) => ({
          ...b,
          reviewed: !!b.review,
        })),
      );

      setTotalPage(res?.paginations?.totalPage || 1);
    } catch (error) {
      console.error("Booking fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handleCancel = async (bookingId: string) => {
    const res = await cancelBooking(bookingId);

    if (res) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b,
        ),
      );
    }
  };

  const handleReviewSuccess = (bookingId: string, updatedReview?: any) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, reviewed: true, review: updatedReview || b.review }
          : b,
      ),
    );
  };

  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  if (!bookings.length) {
    return <p className="text-center mt-10">No bookings yet.</p>;
  }

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
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={b?.tutor?.user?.image || "https://i.pravatar.cc/150"}
                    />
                    <AvatarFallback>👨‍🏫</AvatarFallback>
                  </Avatar>

                  <span>{b?.tutor?.bio || "Tutor"}</span>
                </div>
              </TableCell>

              <TableCell>{b?.tutor?.experience ?? 0} yrs</TableCell>

              <TableCell>{b?.tutor?.hourlyRate ?? 0} BDT/hr</TableCell>

              <TableCell>
                <Badge>{b.status}</Badge>
              </TableCell>

              <TableCell>{new Date(b.createdAt).toLocaleString()}</TableCell>

              <TableCell className="space-x-2">
                {b.status === "PENDING" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancel(b.id)}
                  >
                    Cancel
                  </Button>
                )}

                {b.status === "COMPLETED" && (
                  <Button
                    size="sm"
                    className={
                      b.reviewed
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white"
                    }
                    onClick={() => {
                      if (!b.reviewed) {
                        setSelectedBooking(b);
                      }
                    }}
                  >
                    {b.reviewed ? "Update Review" : "Write Review"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Review Modal */}
      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          existingReview={selectedBooking.review}
          onClose={() => setSelectedBooking(null)}
          onSuccess={(updatedReview: any) =>
            handleReviewSuccess(selectedBooking.id, updatedReview)
          }
        />
      )}

      {/* Pagination */}
      {totalPage > 1 && (
        <Pagination className="mt-6 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
