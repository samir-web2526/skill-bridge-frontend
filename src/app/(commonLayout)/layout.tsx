import React from 'react'
import { Navbar } from "@/components/shared/navbar";

export default function CommonLayout({children}:{children:React.ReactNode}) {
  return (
   
       <div>
          <Navbar></Navbar>
          {children}</div>
  )
}
