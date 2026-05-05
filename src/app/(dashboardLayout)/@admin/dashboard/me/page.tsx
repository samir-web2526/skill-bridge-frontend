import AdminProfilePage from '@/components/pages/dashboardPages/adminPages/AdminProfilePage'
import { getCurrentUser } from '@/lib/auth';
import React from 'react'

export default async function AdminProfile() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return (
    <div>
      <AdminProfilePage></AdminProfilePage>
    </div>
  )
}
