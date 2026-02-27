import TutorCard from "@/components/modules/tutors/TutorCard";
import { getAllTutors } from "@/services/tutor.service";
import React from "react";

export default async function TutorsPage() {
  const tutors = await getAllTutors();
  console.log(tutors);
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
      {tutors?.data?.data?.map((tutor: any) => (
        <TutorCard
        key={tutor.id}
          id={tutor.id}
          name={tutor.user.name}
          subject={tutor.category.name}
          location="Dhaka"
          rating={tutor.averageRating || 0}
          pricePerHour={tutor.hourlyRate || 0}
          image={tutor.user.image}
        />
      ))}
    </div>
  );
}
