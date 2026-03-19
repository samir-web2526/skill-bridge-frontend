"use client";

import { useState, useEffect } from "react";

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
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/lib/auth/adminActions/actions";
import { CategoryDialog } from "./categoryDialog";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getAllCategories(page);

      if (result) {
        setCategories(result.data);
        setPaginations(result.paginations);
      } else {
        setError("Failed to load categories. Please try again.");
      }

      setIsLoading(false);
    };

    load();
  }, [page]);

  const openCreateDialog = () => {
    setDialogMode("create");
    setInputName("");
    setInputDescription("");
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const result = await createCategory(
        inputName.trim(),
        inputDescription.trim(),
      );
      if (result) setCategories((prev) => [result, ...prev]);
    } else if (dialogMode === "edit" && selectedCategory) {
      const result = await updateCategory(
        selectedCategory.id,
        inputName.trim(),
        inputDescription.trim(),
      );
      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        setDialogOpen(false);
        return;
      }
      if (result) {
        setCategories((prev) =>
          prev.map((c) => (c.id === selectedCategory.id ? result : c)),
        );
      }
    }

    setIsSubmitting(false);
    setDialogOpen(false);
  };

  const handleDelete = async (categoryId: string) => {
    const result = await deleteCategory(categoryId);
    if (result)
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {paginations
              ? `${paginations.total} categor${paginations.total !== 1 ? "ies" : "y"} found`
              : ""}
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" />
          Add New
        </Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-50 truncate">
                    {category.description ?? "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginations && (
        <Pagination paginations={paginations} onPageChange={handlePageChange} />
      )}

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
