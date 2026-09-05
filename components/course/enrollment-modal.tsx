"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnrollment, isApplicable } from "@/api/enroll";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
}

export function EnrollmentModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: EnrollmentModalProps) {
  const [courseCode, setCourseCode] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const queryClient = useQueryClient();

  const storageKey = `enrollment_block_${courseId}`;
  const attemptsKey = `enrollment_attempts_${courseId}`;

  // Load block state from localStorage on component mount
  useEffect(() => {
    const savedBlockTime = localStorage.getItem(storageKey);
    const savedAttempts = localStorage.getItem(attemptsKey);
    
    if (savedBlockTime) {
      const blockTime = parseInt(savedBlockTime);
      if (Date.now() < blockTime) {
        setBlockedUntil(blockTime);
      } else {
        // Block has expired, clean up
        localStorage.removeItem(storageKey);
        localStorage.removeItem(attemptsKey);
      }
    }
    
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts));
    }
  }, [storageKey, attemptsKey]);

  // Check if user is currently blocked
  const isBlocked = blockedUntil && Date.now() < blockedUntil;

  // Update remaining time every second when blocked
  useEffect(() => {
    if (isBlocked) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((blockedUntil! - Date.now()) / 1000);
        setRemainingTime(remaining);
        if (remaining <= 0) {
          setBlockedUntil(null);
          setAttemptCount(0);
          setRemainingTime(0);
          // Clean up localStorage when block expires
          localStorage.removeItem(storageKey);
          localStorage.removeItem(attemptsKey);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isBlocked, blockedUntil, storageKey, attemptsKey]);

  const { mutate: enrollMutate, isPending: enrollPending } = useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      toast.success("تم التسجيل في الدورة بنجاح!");
      queryClient.invalidateQueries({ queryKey: [`course-${courseId}`] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      onClose();
      setCourseCode("");
    },
    onError: (error: any) => {
       console.log(error.message, "enrollment error");
       
       // Increment attempt count on error
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        localStorage.setItem(attemptsKey, newAttemptCount.toString());
        
        // Block user for 5 minutes after 5 failed attempts
        if (newAttemptCount >= 5) {
          const blockTime = Date.now() + (5 * 60 * 1000); // 5 minutes
          setBlockedUntil(blockTime);
          localStorage.setItem(storageKey, blockTime.toString());
          toast.error("تم حظرك لمدة 5 دقائق بسبب المحاولات المتكررة");
          return;
        }
       
       if (error.message === "Promo code not found (Status 400)") {
         toast.error(`كود الخصم غير موجود (المحاولة ${newAttemptCount}/5)`);
       } else if (error.message === "Promo code already used (Status 400)") {
         toast.error(`تم استخدام كود الخصم من قبل (المحاولة ${newAttemptCount}/5)`);
       } else if (error.message === "Promo code is not applicable for this course (Status 400)") {
         toast.error(`كود الخصم غير قابل للتطبيق على هذه الدورة (المحاولة ${newAttemptCount}/5)`);
       } else if (error.message === "Promo code has expired (Status 400)") {
         toast.error(`انتهت صلاحية كود الخصم (المحاولة ${newAttemptCount}/5)`);
       } else {
         toast.error(`حدث خطأ أثناء التسجيل (المحاولة ${newAttemptCount}/5)`);
       }
     },
  });

  const { mutate: checkPromoCode, isPending: checkPending } = useMutation({
    mutationFn: isApplicable,
    onSuccess: () => {
      enrollMutate({
        courseId: courseId,
        promoCode: courseCode.trim(),
      });
    },
    onError: (error: any) => {
       console.log(error.message, "promo check error");
       
       // Increment attempt count on error
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        localStorage.setItem(attemptsKey, newAttemptCount.toString());
        
        // Block user for 5 minutes after 5 failed attempts
        if (newAttemptCount >= 5) {
          const blockTime = Date.now() + (5 * 60 * 1000); // 5 minutes
          setBlockedUntil(blockTime);
          localStorage.setItem(storageKey, blockTime.toString());
          toast.error("تم حظرك لمدة 5 دقائق بسبب المحاولات المتكررة");
          return;
        }
       
       if (error.message === "Promo code not found (Status 400)") {
         toast.error(`كود الخصم غير موجود (المحاولة ${newAttemptCount}/5)`);
       } else if (error.message === "Promo code already used (Status 400)") {
         toast.error(`تم استخدام كود الخصم من قبل (المحاولة ${newAttemptCount}/5)`);
       } else if (error.message === "Promo code is not applicable for this course (Status 400)") {
         toast.error(`كود الخصم غير قابل للتطبيق على هذه الدورة (المحاولة ${newAttemptCount}/5)`);
       } else if (error.message === "Promo code has expired (Status 400)") {
         toast.error(`انتهت صلاحية كود الخصم (المحاولة ${newAttemptCount}/5)`);
       } else {
         toast.error(`حدث خطأ في التحقق من كود الخصم (المحاولة ${newAttemptCount}/5)`);
       }
     },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is blocked
    if (isBlocked) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      toast.error(`أنت محظور لمدة ${minutes}:${seconds.toString().padStart(2, '0')} دقيقة`);
      return;
    }
    
    if (!courseCode.trim()) {
      toast.error("يرجى إدخال كود الخصم");
      return;
    }
    
    // First check if promo code is applicable, then enroll
    checkPromoCode({
      code: courseCode.trim(),
      courseId: courseId,
    });
  };

  const handleClose = () => {
    if (!enrollPending && !checkPending) {
      onClose();
      setCourseCode("");
      // Reset attempt count when modal is closed
      if (!isBlocked) {
        setAttemptCount(0);
        localStorage.removeItem(attemptsKey);
      }
    }
  };

  const isLoading = enrollPending || checkPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl">
            التسجيل في الدورة
          </DialogTitle>
          <DialogDescription className="text-right text-lg">
            {isBlocked ? (
              <span className="text-red-500">
                تم حظرك لمدة {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')} دقيقة
              </span>
            ) : (
              <>أدخل كود الخصم للتسجيل في: {courseTitle}</>
            )}
            {attemptCount > 0 && !isBlocked && (
              <div className="text-orange-500 text-sm mt-1">
                المحاولات المتبقية: {5 - attemptCount}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseCode" className="text-right col-span-4">
                كود الخصم
              </Label>
              <Input
                id="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="أدخل كود الخصم هنا"
                className="col-span-4 text-right"
                dir="rtl"
                disabled={isLoading || isBlocked}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !courseCode.trim() || isBlocked}
            >
              {isBlocked 
                ? `محظور (${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')})` 
                : checkPending 
                ? "جاري التحقق..." 
                : enrollPending 
                ? "جاري التسجيل..." 
                : "تسجيل"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}