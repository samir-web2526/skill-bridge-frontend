"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/services/review.service";

type Props = {
  booking: any;
  onClose: () => void;
  onSuccess: (review: any) => void;
};

export default function ReviewModal({ booking, onClose, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      bookingId: booking.id,
      tutorId: booking.tutor.id,
      rating,
      comment,
    };

    const res = await createReview(payload);

    if (res) {
      onSuccess(res);
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[420px] space-y-4">

        <h2 className="text-xl font-semibold">
          Review Tutor
        </h2>

        {/* Rating */}
        <div>
          <label className="text-sm font-medium">Rating</label>

          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded w-full p-2 mt-1"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium">Comment</label>

          <Textarea
            placeholder="Write your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">

          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-600 text-white"
          >
            Submit Review
          </Button>

        </div>
      </div>
    </div>
  );
}