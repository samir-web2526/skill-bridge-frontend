import TutorProfilePage from '@/components/pages/dashboardPages/tutorPages/TutorProfilePage'
import { getCurrentUser } from '@/lib/auth';
import React from 'react'

export default async function TutorProfile() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return null;
  return (
    <div>
      <TutorProfilePage></TutorProfilePage>
    </div>
  )
}
