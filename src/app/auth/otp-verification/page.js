"use client"

import Haderbar from "@/components/layout/Haderbar"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation";
import { useCookies } from 'next-client-cookies';

// Change the component name from 'page' to 'Page'
export default function Page() {
    const router = useRouter();
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState(null);
    const cookies = useCookies();
    const inputRefs = useRef([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isResending) {
            setIsResending(false);
        }
    }, [countdown, isResending]);

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        // Auto-focus to next input if current input is filled
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = async () => {
        const email = localStorage.getItem("email");
        const otp = otpValues.join("");
        
        if (!email || !otp || otp.length !== 6) return setError("Email or OTP missing");
    
        try {
            const response = await fetch("https://api-test.goodtime.app/users/login/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });
    
            if (!response.ok) throw new Error("OTP verification failed");
    
            const data = await response.json();
            const accessToken = data.accessToken || data.token;
            if (accessToken) {
                cookies.set('accessToken', accessToken);
                localStorage.setItem("accessToken", accessToken);
            }
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleResendOTP = () => {
        // Implement resend OTP logic here
        setCountdown(60);
        setIsResending(true);
        // You would typically call your API to resend the OTP here
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-orange-100">
            <Haderbar />
            <div className="mx-auto max-w-3xl px-4">
                <div className="pt-16 flex flex-col items-center">
                    <h1 className="text-4xl text-center text-black font-bold">OTP Verification</h1>
                    <p className="text-lg text-center text-black py-6">We have sent a verification code to your e-mail address.</p>

                    <div className="flex gap-2 mb-6">
                        {otpValues.map((value, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                maxLength="1"
                                value={value}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-sm border border-gray-300 rounded-full"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <button
                        onClick={handleVerifyOTP}
                        className="bg-[#ff9933] hover:bg-[#ff8000] text-black font-medium rounded-full px-6 py-3"
                    >
                        Verify OTP
                    </button>

                    <div className="pt-6 text-sm text-center">
                        Don&apos;t received code?
                        {countdown > 0 ? (
                            <span>Resend OTP password in {countdown}s</span>
                        ) : (
                            <span 
                                className="underline cursor-pointer" 
                                onClick={handleResendOTP}
                            >
                                Resend OTP password
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
