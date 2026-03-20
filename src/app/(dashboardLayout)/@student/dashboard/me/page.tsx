import StudentProfilePage from '@/components/pages/dashboardPages/studentPages/StudentProfilePage'
import { getUser } from '@/lib/auth/session';
import React from 'react'

export default async function StudentProfile() {
  const user = await getUser();
  if (!user || user.role !== "STUDENT") return null;
  return (
    <div>
      <StudentProfilePage></StudentProfilePage>
    </div>
  )
}
