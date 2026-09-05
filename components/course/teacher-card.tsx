"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeacherCardProps {
  teacher: {
    name: string;
    title: string;
    university?: string;
    experience?: string;
    rating?: number;
    students?: number;
    courses?: number;
    about?: string;
    profileUrl?: string;
  };
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card className="animate-scale-in shadow-xl border-0">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={teacher.profileUrl || "/placeholder-user.jpg"}
              alt={teacher.name}
            />
            <AvatarFallback className="text-2xl">
              {teacher.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-2">
              {teacher.name}
            </h3>
            <p className="text-primary text-xl mb-2">
              {teacher.title}
            </p>
            {/* {teacher.university && (
              <p className="text-muted-foreground text-lg mb-2">
                {teacher.university}
              </p>
            )}
            {teacher.experience && (
              <p className="text-muted-foreground text-lg mb-4">
                خبرة {teacher.experience}
              </p>
            )}
            {teacher.about && (
              <p className="text-muted-foreground text-lg">
                {teacher.about}
              </p>
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}