

import TutorDetailCard from "@/components/modules/tutors/tutorDetails";
import { getTutorDetails } from "@/services/tutorServices/tutorServices"

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const {id} = await params;
  const tutor = await getTutorDetails(id)
  const tutorData = tutor.data;
  console.log(tutorData)

  if (!tutor.data) {
    return <p className="text-center">Tutor not found</p>
  }

  return (
    <div className="container mx-auto py-12">
      <TutorDetailCard
      id={tutorData.id}
        name={tutorData.user.name}
        bio={tutorData.bio}
        subject={tutorData.category.name}
        rating={tutorData.averageRating || 0}
        hourlyRate={tutorData.hourlyRate}
        image={tutorData.user.image}
      />
    </div>
  )
}