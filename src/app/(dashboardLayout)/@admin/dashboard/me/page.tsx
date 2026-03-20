import AdminProfilePage from '@/components/pages/dashboardPages/adminPages/AdminProfilePage'
import { getUser } from '@/lib/auth/session';
import React from 'react'

export default async function AdminProfile() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") return null;
  return (
    <div>
      <AdminProfilePage></AdminProfilePage>
    </div>
  )
}
