"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Haderbar from '@/components/layout/Haderbar'

export default function AccountDeleted() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-orange-100">
            <Haderbar />
            <div className="flex flex-col items-center py-16 px-6 space-y-16 relative z-10">
                <div className="max-w-[680px] w-full flex flex-col items-center space-y-6">
                    <div className="w-full flex flex-col items-center space-y-2">
                        <h2 className="w-full text-[#151B2A] text-center text-[32px] font-bold leading-[38px]">
                            Your Account has been deleted
                        </h2>
                        <h3 className="w-full text-[#2B2E38] text-center text-[24px] font-bold leading-[34px]">
                            Thank you for doing assessment with us.
                        </h3>
                        <p className="w-full text-[#2B2E38] text-center text-[18px] font-normal leading-[25px]">
                            The account able to reclaim within 30 days from today to save all of your information and assessment before permanently removed.
                        </p>
                    </div>
                </div>

                <div className="max-w-[624px] w-full rounded-[24px] shadow-[0_8px_24px_rgba(18,19,20,0.15)] overflow-hidden">
                    <div className="w-full h-[320px] relative">
                        <Image
                            src="/your-gtr/users_img/Frame 6.svg"
                            alt="Happy person in sunlight"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="w-full bg-white p-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 bg-[#FF9933] text-[#151B2A] font-bold text-[14px] leading-[22px] py-[10px] px-6 rounded-[24px] flex items-center justify-center"
                        >
                            Visit Homepage
                        </Link>
                        <Link
                            href="/signup"
                            className="flex-1 border border-[#737685] text-[#2B2E38] font-medium text-[14px] leading-[20px] py-[10px] px-6 rounded-[24px] flex items-center justify-center"
                        >
                            Create Account Again
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}