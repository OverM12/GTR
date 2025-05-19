"use client"

import Haderbar from "@/components/layout/Haderbar"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { useCookies } from 'next-client-cookies';

// Change the component name from 'page' to 'Page'
export default function Page() {
    const router = useRouter();
    const [otp, setOtp] = useState(""), [countdown, setCountdown] = useState(60), [isResending, setIsResending] = useState(false), [error, setError] = useState(null);
    const cookies = useCookies();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isResending) {
            setIsResending(false);
        }
    }, [countdown, isResending]);

    const handleVerifyOTP = async () => {
        const email = localStorage.getItem("email");
        if (!email || !otp) return setError("Email or OTP missing");
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/login/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });
    
            if (!response.ok) throw new Error("OTP verification failed");
    
            const data = await response.json();
            // Fix: Store the actual token value instead of the cookies object
            localStorage.setItem("accessToken", data.data.accessToken);
            cookies.set('accessToken', data.data.accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };
    

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-orange-100">
            <Haderbar />
            <div className="mx-auto max-w-3xl px-4">
                <div className="pt-16 flex flex-col items-center">
                    <h1 className="text-4xl text-center text-black font-bold">OTP Password</h1>
                    <h2 className="text-3xl text-center text-black font-bold">Verification</h2>
                    <p className="text-lg text-center text-black py-6">We have sent a verification code to your email.</p>

                    <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-xl border px-6 py-3 rounded-full mb-6"
                    />

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <button
                        onClick={handleVerifyOTP}
                        className="bg-[#ff9933] hover:bg-[#ff8000] text-black font-medium rounded-full px-6 py-3"
                    >
                        Verify OTP
                    </button>

                    <div className="pt-6 text-sm text-center">
                        {countdown > 0 ? (
                            <span>Able to resend OTP in {countdown}s</span>
                        ) : (
                            <span className="underline cursor-pointer" onClick={() => setCountdown(60)}>Resend OTP</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
