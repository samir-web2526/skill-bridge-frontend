/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  getTutors,
  getDeletedTutors,
  deleteTutor,
  restoreTutor,
  updateTutorStatus,
  TutorProfile,
  userStatus,
} from "@/services/tutors.service";

export default function ManageTutorPage() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"active" | "deleted">("active");

  // 🔥 Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // 🔥 FETCH
  const fetchTutors = useCallback(async () => {
    setLoading(true);

    const res =
      view === "active"
        ? await getTutors({
            page,
            limit,
            isDeleted: false,
          })
        : await getDeletedTutors();

    if (res.error || !res.data) {
      toast.error(res.error || "No data found");
      setLoading(false);
      return;
    }

    // 🔥 handle paginated response
    if (view === "active") {
      setTutors(res.data || []);
setTotal(res.data?.length || 0);
    } else {
      setTutors(Array.isArray(res.data) ? res.data : []);
      setTotal(res.data?.length || 0);
    }

    setLoading(false);
  }, [view, page, limit]);

 useEffect(() => {
      const run = async () => {
      await fetchTutors();
    };
    run();
  }, [fetchTutors]);

  // 🔥 DELETE
 const handleDelete = async (id: string, hasActiveBooking: boolean) => {
  if (hasActiveBooking) {
    toast.error(" Cannot delete tutor with active booking");
    return;
  }

  const res = await deleteTutor(id);

  if (res.error) return toast.error(res.error);

  toast.success("Tutor moved to deleted");
  fetchTutors();
};
  // 🔥 RESTORE
  const handleRestore = async (id: string) => {
    const res = await restoreTutor(id);
    if (res.error) return toast.error(res.error);

    toast.success("Tutor restored");
    fetchTutors();
  };

  // 🔥 STATUS UPDATE
 const handleStatus = async (id: string, status: userStatus) => {
  const res = await updateTutorStatus(id, status);

  if (res.error) return toast.error(res.error);

  toast.success("Status updated");
  fetchTutors();
};

  // 🔥 STATUS COLOR
  const getStatusColor = (status: userStatus) => {
    if (status === "ACTIVE") return "bg-emerald-500 dark:bg-emerald-600";
    if (status === "PENDING") return "bg-amber-500 dark:bg-amber-600";
    if (status === "BANNED") return "bg-red-500 dark:bg-red-600";
    return "bg-muted-foreground";
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Tutors</h1>

      {/* 🔥 Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={view === "active" ? "default" : "outline"}
          onClick={() => {
            setView("active");
            setPage(1);
          }}
        >
          Active Tutors
        </Button>

        <Button
          variant={view === "deleted" ? "default" : "outline"}
          onClick={() => setView("deleted")}
        >
          Deleted Tutors
        </Button>
      </div>

      {/* 🔥 LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="space-y-3">
            {tutors.map((tutor: any) => {
              const hasActiveBooking = tutor._count?.booking > 0;

              return (
                <div
                  key={tutor.id}
                  className="border border-border p-4 rounded-lg flex justify-between items-center bg-card shadow-sm hover:shadow-md transition"
                >
                  {/* LEFT */}
                  <div>
                    <p className="font-semibold">{tutor.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tutor.category?.name}
                    </p>

                    <span
                      className={`text-white text-xs px-2 py-1 rounded mt-1 inline-block ${getStatusColor(
                        tutor.user.status
                      )}`}
                    >
                      {tutor.user.status}
                    </span>

                    {hasActiveBooking && (
                      <p className="text-xs text-red-500 mt-1">
                        Active booking আছে — status change blocked
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex gap-2 items-center">
                    {view === "active" && (
                      <>
                        <select
                          value={tutor.user.status}
                          onChange={(e) =>
                            handleStatus(
                              tutor.id,
                              e.target.value as userStatus
                            )
                          }
                          className="border border-border bg-card text-foreground px-2 py-1 rounded text-sm outline-none focus:border-emerald-500"
                        >
                          <option value="ACTIVE">Active</option>

                          <option
                            value="PENDING"
                            disabled={hasActiveBooking}
                          >
                            Pending
                          </option>

                          <option
                            value="BANNED"
                            disabled={hasActiveBooking}
                          >
                            Banned
                          </option>
                        </select>

                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(tutor.id,hasActiveBooking)}
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {view === "deleted" && (
                      <Button onClick={() => handleRestore(tutor.id)}>
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🔥 PAGINATION */}
          {view === "active" && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </Button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}