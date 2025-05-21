"use client"
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

function Haderbar() {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  // Define which pages should show the header
  const authPages = ['/auth/signup', '/auth/users/deleted', '/auth/login', '/auth/otp-verification', '/auth/success']

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleTabChange = (tab) => {
    // Update the activeTab in the parent component
    setActiveTab(tab)

    // Close the menu after changing tab
    setShowMenu(false)
  }

  return (
    <div className="w-full">
      {/* Auth pages header */}
      {authPages.includes(pathname) && (
        <h3 className='text-[20px] md:text-[28px] py-[16px] px-[24px] text-center lg:text-start font-bold border border-gray-100 bg-white shadow-md text-[#ff9933]'>
          Good Time
        </h3>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Haderbar