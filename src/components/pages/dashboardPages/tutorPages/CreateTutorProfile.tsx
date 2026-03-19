"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTutorProfile } from "@/lib/auth/tutorActions/actions";

type Category = { id: string; name: string };

export default function BecomeTutorForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    bio: "",
    hourlyRate: "",
    experience: "",
    categoryId: "",
  });

  const handleSubmit = async () => {
    if (!form.bio || !form.hourlyRate || !form.experience || !form.categoryId) {
      setError("Shob field fill korte hobe!");
      return;
    }

    setLoading(true);
    setError("");

    const result = await createTutorProfile({
      bio: form.bio,
      hourlyRate: Number(form.hourlyRate),
      experience: Number(form.experience),
      categoryId: form.categoryId,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Bio</Label>
        <Textarea
          placeholder="Apnar teaching experience somprorke likhun..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Category</Label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm bg-background"
        >
          <option value="">Category select korun</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Hourly Rate (৳)</Label>
        <Input
          type="number"
          placeholder="e.g. 500"
          value={form.hourlyRate}
          onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Experience (years)</Label>
        <Input
          type="number"
          placeholder="e.g. 3"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
      >
        {loading ? "Creating..." : "Create Tutor Profile"}
      </Button>
    </div>
  );
}
