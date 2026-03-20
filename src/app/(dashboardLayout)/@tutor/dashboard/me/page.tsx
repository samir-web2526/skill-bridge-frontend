import TutorProfilePage from '@/components/pages/dashboardPages/tutorPages/TutorProfilePage'
import { getUser } from '@/lib/auth/session';
import React from 'react'

export default async function TutorProfile() {
  const user = await getUser();
  if (!user || user.role !== "TUTOR") return null;
  return (
    <div>
      <TutorProfilePage></TutorProfilePage>
    </div>
  )
}
