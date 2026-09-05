"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addReview } from "@/api/courses";

interface ReviewModalProps {
  courseId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}



export function ReviewModal({ courseId, isOpen, onOpenChange, trigger }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      toast.success("تم إرسال تقييمك بنجاح!");
      queryClient.invalidateQueries({ queryKey: [`course-${courseId}`] });
      onOpenChange(false);
      setRating(0);
      setComment("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال التقييم");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("يرجى اختيار تقييم");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("يرجى كتابة تعليق لا يقل عن 10 أحرف");
      return;
    }

    reviewMutation.mutate({
      courseId,
      rate: rating,
      content: comment.trim(),
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`transition-colors ${
            isActive ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`h-8 w-8 ${
              isActive ? "fill-current" : ""
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl">إضافة تقييم</DialogTitle>
          <DialogDescription className="text-right">
            شاركنا رأيك في هذه الدورة لمساعدة الطلاب الآخرين
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-right text-lg">التقييم</Label>
            <div className="flex justify-center gap-1">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && "ضعيف"}
                {rating === 2 && "مقبول"}
                {rating === 3 && "جيد"}
                {rating === 4 && "جيد جداً"}
                {rating === 5 && "ممتاز"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-right text-lg">
              التعليق
            </Label>
            <Textarea
              id="comment"
              placeholder="اكتب تعليقك هنا... (على الأقل 10 أحرف)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] text-right"
              dir="rtl"
            />
            <p className="text-sm text-muted-foreground text-right">
              {comment.length}/500 حرف
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={reviewMutation.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={reviewMutation.isPending || rating === 0 || comment.trim().length < 10}
            >
              {reviewMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}