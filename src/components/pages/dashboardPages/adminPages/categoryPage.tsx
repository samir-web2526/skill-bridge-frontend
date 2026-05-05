/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Pagination, PaginationMeta } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, AlertCircle, Inbox } from "lucide-react";
import { CategoryDialog } from "./categoryDialog";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { toast } from "sonner";
import { Category, createCategory, deleteCategory, getCategories, updateCategory } from "@/services/category.service";

function StatCard({
  label,
  value,
  dotColor,
  valueColor,
}: {
  label: string;
  value: string | number;
  dotColor: string;
  valueColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 px-4 py-3 shadow-sm">
      <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-xs text-zinc-400 font-medium mt-0.5 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        {label}
      </p>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getCategories({page});
   if (result?.data) {
  setCategories(Array.isArray(result.data) ? result.data : []);
  setPaginations(result.meta);
}else {
        setError("Failed to load categories. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [page, refresh]);

  const stats = useMemo(() => {
    const total = paginations?.total ?? categories.length;
    const totalTutors = categories.reduce(
      (s, c) => s + (c._count?.tutor ?? 0),
      0,
    );
    const avg =
      categories.length > 0
        ? (totalTutors / categories.length).toFixed(1)
        : "—";
    return { total, totalTutors, avg };
  }, [categories, paginations]);

  const openCreateDialog = () => {
    setDialogMode("create");
    setInputName("");
    setInputDescription("");
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category: any) => {
    setDialogMode("edit");
    setInputName(category.name);
    setInputDescription(category.description ?? "");
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!inputName.trim()) return;
    setIsSubmitting(true);

    if (dialogMode === "create") {
      const result = await createCategory({
  name: inputName.trim(),
  description: inputDescription.trim(),
});
      if (result && result.data) {
  toast.success("Category created successfully.");

  setCategories((prev) => [result.data!, ...prev]);

  setRefresh((prev) => prev + 1);
}
    } else if (dialogMode === "edit" && selectedCategory) {
     const result = await updateCategory(selectedCategory.id, {
  name: inputName.trim(),
  description: inputDescription.trim(),
});
      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        setDialogOpen(false);
        return;
      }
     if (result?.data) {
  toast.success("Category updated successfully.");

  setCategories((prev) =>
    prev.map((c) =>
      c.id === selectedCategory.id ? result.data! : c
    )
  );

  setRefresh((prev) => prev + 1);
}
    }

    setIsSubmitting(false);
    setDialogOpen(false);
  };

  const handleDelete = async (categoryId: string) => {
    const result = await deleteCategory(categoryId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Category deleted successfully.");
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      setRefresh((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Admin
        </p>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Categories
            </h1>
            {paginations && (
              <p className="text-sm text-zinc-400 font-medium mt-0.5">
                {paginations.total} categor
                {paginations.total !== 1 ? "ies" : "y"} total
              </p>
            )}
          </div>

          <Button
            onClick={openCreateDialog}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold px-4 flex items-center gap-2 shadow-sm shadow-emerald-100"
          >
            <Plus size={15} />
            Add new
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-5">
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Total categories"
            value={stats.total}
            dotColor="bg-zinc-300"
            valueColor="text-zinc-800"
          />
          <StatCard
            label="Total tutors"
            value={stats.totalTutors}
            dotColor="bg-emerald-500"
            valueColor="text-emerald-700"
          />
          <StatCard
            label="Avg per category"
            value={stats.avg}
            dotColor="bg-blue-400"
            valueColor="text-blue-700"
          />
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                <TableHead className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3 pl-6">
                  Category
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3">
                  Description
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3 text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-100 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 rounded bg-zinc-100" />
                          <div className="h-2.5 w-14 rounded bg-zinc-100" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-48 rounded bg-zinc-100" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex gap-2 justify-end">
                        <div className="h-7 w-7 rounded-lg bg-zinc-100" />
                        <div className="h-7 w-7 rounded-lg bg-zinc-100" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Inbox size={22} className="text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-400">
                        No categories found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, idx) => {
                  const {
                    icon: Icon,
                    bg: bgColor,
                    text: color,
                  } = getCategoryColor(category.name);
                  return (
                    <TableRow
                      key={category.id}
                      className={`hover:bg-zinc-50 transition-colors ${
                        idx % 2 === 1 ? "bg-zinc-50/50" : ""
                      }`}
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}
                          >
                            <Icon size={15} className={color} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-800">
                              {category.name}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {category._count?.tutor ?? 0} tutor
                              {(category._count?.tutor ?? 0) !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 max-w-65">
                        <p className="text-sm text-zinc-400 truncate">
                          {category.description ?? "—"}
                        </p>
                      </TableCell>

                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                            className="h-8 w-8 rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors"
                          >
                            <Pencil size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                            className="h-8 w-8 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {paginations && (
          <div className="pt-2">
            <Pagination
              paginations={paginations}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <CategoryDialog
        open={dialogOpen}
        mode={dialogMode}
        inputName={inputName}
        inputDescription={inputDescription}
        isSubmitting={isSubmitting}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        onNameChange={setInputName}
        onDescriptionChange={setInputDescription}
      />
    </div>
  );
}
