"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createTutorProfile } from "@/lib/auth/tutorActions/actions";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { toast } from "sonner";

type Category = { id: string; name: string };

const MAX_BIO = 500;

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
      setError("All fields are required.");
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
    toast.success("Tutor profile created successfully!");
    router.refresh();
    router.push("/dashboard/me");
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Tutor Dashboard
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
          Become a Tutor
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Complete your profile to start teaching on SkillBridge.
        </p>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-0 px-6 py-4 border-b border-zinc-100 bg-zinc-50">
            {[
              { n: "1", label: "Profile", done: !!form.bio },
              { n: "2", label: "Category", done: !!form.categoryId },
              {
                n: "3",
                label: "Pricing",
                done: !!(form.hourlyRate && form.experience),
              },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                      s.done
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-zinc-200 text-zinc-400"
                    }`}
                  >
                    {s.done ? (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5l2 2 4-4"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      s.n
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${s.done ? "text-emerald-600" : "text-zinc-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-px mx-3 ${s.done ? "bg-emerald-300" : "bg-zinc-100"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="relative h-20 bg-emerald-700 overflow-hidden flex items-center px-6 gap-3">
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              viewBox="0 0 560 80"
              preserveAspectRatio="xMidYMid slice"
            >
              <circle cx="500" cy="10" r="80" fill="#fff" />
              <circle cx="40" cy="70" r="50" fill="#fff" />
            </svg>
            <div className="relative w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#fff"
                  opacity="0.9"
                />
                <rect
                  x="10"
                  y="2"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#fff"
                  opacity="0.6"
                />
                <rect
                  x="2"
                  y="10"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#fff"
                  opacity="0.6"
                />
                <rect
                  x="10"
                  y="10"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#fff"
                  opacity="0.3"
                />
              </svg>
            </div>
            <div className="relative">
              <p className="text-sm font-semibold text-white">
                Tell students about yourself
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                A great bio gets 3× more booking requests
              </p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
                Bio
              </p>
              <Textarea
                placeholder="Share your teaching experience and style..."
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value.slice(0, MAX_BIO) })
                }
                rows={3}
                className="rounded-xl border-zinc-200 text-sm resize-none focus-visible:ring-emerald-500 focus-visible:border-emerald-400"
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <circle
                      cx="6"
                      cy="6"
                      r="5"
                      stroke="#059669"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M6 5v3M6 4v.3"
                      stroke="#059669"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  150+ characters recommended
                </p>
                <p
                  className={`text-[10px] font-medium tabular-nums ${
                    form.bio.length > MAX_BIO * 0.9
                      ? "text-amber-500"
                      : "text-zinc-300"
                  }`}
                >
                  {form.bio.length} / {MAX_BIO}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
                Subject category
              </p>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const { icon: Icon, bg, text } = getCategoryColor(cat.name);
                  const isSelected = form.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm({ ...form, categoryId: cat.id })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
                      >
                        <Icon size={12} className={text} />
                      </div>
                      <span
                        className={`text-xs font-semibold truncate ${
                          isSelected ? "text-emerald-700" : "text-zinc-600"
                        }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Hourly rate
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">
                    ৳
                  </span>
                  <input
                    type="number"
                    placeholder="500"
                    value={form.hourlyRate}
                    onChange={(e) =>
                      setForm({ ...form, hourlyRate: e.target.value })
                    }
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold rounded-xl border border-zinc-200 bg-white text-zinc-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-zinc-300 mt-1.5">
                  ৳100 – ৳5,000 per hour
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Experience
                </p>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="3"
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className="w-full pl-3 pr-10 py-2 text-sm font-semibold rounded-xl border border-zinc-200 bg-white text-zinc-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">
                    yrs
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 mt-1.5">
                  Years of teaching
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  className="shrink-0"
                >
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="5.5"
                    stroke="#ef4444"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M6.5 4v3M6.5 9v.3"
                    stroke="#ef4444"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-t border-zinc-100">
            <p className="text-xs text-zinc-400">All fields are required</p>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold px-5 flex items-center gap-2 shadow-sm shadow-emerald-100 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-3.5 h-3.5 shrink-0"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeDasharray="20"
                      strokeDashoffset="10"
                      strokeLinecap="round"
                    />
                  </svg>
                  Creating…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l2.5 2.5 5.5-5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Create profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
