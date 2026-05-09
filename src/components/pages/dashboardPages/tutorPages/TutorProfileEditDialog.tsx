"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateTutor } from "@/services/tutors.service";
import { getCategories, Category } from "@/services/category.service";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: () => void;
}

export function TutorProfileEditDialog({ open, onClose, profile, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    image: profile?.user?.image || "",
    bio: profile?.bio || "",
    hourlyRate: profile?.hourlyRate || 0,
    categoryId: profile?.categoryId || "",
    experience: profile?.experience || 0,
    education: profile?.education || "",
    availability: profile?.availability ?? true,
  });

  useEffect(() => {
    const loadCategories = async () => {
      const res = await getCategories({ limit: 100 });
      if (res.data) setCategories(res.data);
    };
    if (open) loadCategories();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert to numbers
    const payload = {
      ...formData,
      hourlyRate: Number(formData.hourlyRate),
      experience: String(formData.experience),
    };

    const res = await updateTutor(profile.id, payload as any);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Profile updated successfully");
      onUpdate();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Tutor Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile Image URL</Label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/avatar.png"
              className="rounded-xl bg-muted/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hourly Rate (৳)</Label>
              <Input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                className="rounded-xl bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience (Years)</Label>
              <Input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                className="rounded-xl bg-muted/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full h-10 rounded-xl border border-input bg-muted/30 px-3 text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education</Label>
            <Input
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="rounded-xl bg-muted/30"
              placeholder="e.g. BSc in Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="rounded-xl bg-muted/30 min-h-[100px]"
              placeholder="Tell students about your teaching style..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="availability"
              checked={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="availability" className="text-sm font-semibold cursor-pointer">Currently Available for Bookings</Label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
