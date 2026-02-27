import { getAllCategories } from '@/services/categoryServices/categoryServices';
import React from 'react'

export default async function CategoryPage() {
     const categories = await getAllCategories();
    console.log(categories.data)
  return (
    <div>CategoryPage</div>
  )
}
