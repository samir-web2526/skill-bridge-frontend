/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { Category, createCategory, deleteCategory, getCategories, updateCategory } from "@/services/category.service";
import { PaginationMeta } from "@/types/sharedTypes";
import { Button } from "@/components/ui/button";
import { AlertCircle, Inbox, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { CategoryDialog } from "./categoryDialog";
import { Pagination } from "@/components/ui/Pagination";

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
    <div className="bg-card rounded-xl border border-border px-4 py-3 shadow-sm">
      <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground font-medium mt-0.5 flex items-center gap-1.5">
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

  const [search, setSearch] = useState("");
  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getCategories({ page, searchTerm: search || undefined });
      if (result?.data) {
        setCategories(Array.isArray(result.data) ? result.data : []);
        setPaginations(result.meta);
      } else {
        setError("Failed to load categories. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [page, refresh, search]);


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

    try {
      if (dialogMode === "create") {
        const result = await createCategory({
          name: inputName.trim(),
          description: inputDescription.trim(),
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.data) {
          toast.success("Category created successfully.");
          setRefresh((prev) => prev + 1);
        }
      } else if (dialogMode === "edit" && selectedCategory) {
        const result = await updateCategory(selectedCategory.id, {
          name: inputName.trim(),
          description: inputDescription.trim(),
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.data) {
          toast.success("Category updated successfully.");
          setRefresh((prev) => prev + 1);
        }
      }

      setDialogOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    const result = await deleteCategory(categoryId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Category deleted successfully.");
      setRefresh((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
          Admin
        </p>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Categories
            </h1>
            {paginations && (
              <p className="text-sm text-muted-foreground font-medium mt-0.5">
                {paginations.total} categor
                {paginations.total !== 1 ? "ies" : "y"} total
              </p>
            )}
          </div>

          <Button
            onClick={openCreateDialog}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold px-4 flex items-center gap-2 shadow-sm"
          >
            <Plus size={15} />
            Add new
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-5">
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 md:flex-none">
            <StatCard
              label="Total categories"
              value={stats.total}
              dotColor="bg-muted-foreground/30"
              valueColor="text-foreground"
            />
            <StatCard
              label="Total tutors"
              value={stats.totalTutors}
              dotColor="bg-primary"
              valueColor="text-primary"
            />
            <StatCard
              label="Avg per category"
              value={stats.avg}
              dotColor="bg-chart-1"
              valueColor="text-chart-1"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                <TableHead className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase py-3 pl-6">
                  Category
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase py-3">
                  Description
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase py-3 text-right pr-6">
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
                        <div className="w-8 h-8 rounded-xl bg-muted shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 rounded bg-muted" />
                          <div className="h-2.5 w-14 rounded bg-muted" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-48 rounded bg-muted" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex gap-2 justify-end">
                        <div className="h-7 w-7 rounded-lg bg-muted" />
                        <div className="h-7 w-7 rounded-lg bg-muted" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Inbox size={22} className="text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
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
                  } = getCategoryColor(category?.name ?? "default" );
                  return (
                    <TableRow
                      key={category.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}
                          >
                            <Icon size={15} className={color} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {category.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {category?._count?.tutor ?? 0} tutor
                              {(category?._count?.tutor ?? 0) !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 max-w-65">
                        <p className="text-sm text-muted-foreground truncate">
                          {category.description ?? "—"}
                        </p>
                      </TableCell>

                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                            className="h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Pencil size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                            className="h-8 w-8 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive transition-colors"
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
