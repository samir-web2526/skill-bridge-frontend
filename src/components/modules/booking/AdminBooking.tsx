"use client";

import React, { useEffect, useState } from "react";
import { getAllBookings } from "@/services/booking.service";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationContent,
} from "@/components/ui/pagination";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async (pageNumber: number) => {
    setLoading(true);
    const res = await getAllBookings(); // backend pagination
    setBookings(res.data || []);
    setTotalPage(res.paginations?.totalPage || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">All Bookings (Admin)</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id} className="hover:bg-gray-50">
                {/* User */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={b.user?.image || "https://i.pravatar.cc/150?img=3"}
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">{b.user?.name || "No Name"}</p>
                      <p className="text-gray-500 text-sm">
                        {b.user?.phone || "017*****"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Tutor */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={b.tutor?.user?.image || "https://i.pravatar.cc/150?img=4"}
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {b.tutor?.name || b.tutor?.bio || "No Name"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {b.tutor?.experience || 0} yrs exp
                      </p>
                    </div>
                  </div>
                </TableCell>

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
      )}

      {/* Pagination */}
      {totalPage > 1 && (
        <Pagination className="mt-6 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(Math.max(page - 1, 1))} />
            </PaginationItem>

            {Array.from({ length: totalPage }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setPage(i + 1)} isActive={i + 1 === page}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext onClick={() => setPage(Math.min(page + 1, totalPage))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}