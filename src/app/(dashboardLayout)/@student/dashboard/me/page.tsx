import StudentProfilePage from '@/components/pages/dashboardPages/studentPages/StudentProfilePage'
import { getCurrentUser } from '@/lib/auth';
import React from 'react'

export default async function StudentProfile() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") return null;
  return (
    <div>
      <StudentProfilePage></StudentProfilePage>
    </div>
  )
}
