import React from 'react'
import { NavBar } from '../NavBar'
import Footer from '../LandingPage/Footer'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="flex w-full flex-col items-center justify-between pb-16 overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  )
}
