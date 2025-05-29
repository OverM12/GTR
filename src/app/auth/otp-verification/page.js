"use client"

import Haderbar from "@/components/layout/Haderbar"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation";
import { useCookies } from 'next-client-cookies';

export default function Page() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState(null);
    const cookies = useCookies();

    const inputsRef = useRef([]);

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
        if (!email || otp.length < 6) return setError("Email or OTP missing");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/login/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            if (!response.ok) throw new Error("OTP verification failed");

            const data = await response.json();
            localStorage.setItem("accessToken", data.data.accessToken);
            cookies.set('accessToken', data.data.accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            const newOtpArray = otp.split('');
            newOtpArray[index] = value;
            const finalOtp = newOtpArray.join('').padEnd(6, '');
            setOtp(finalOtp);

            if (index < 5) {
                inputsRef.current[index + 1]?.focus();
            }

            if (finalOtp.length === 6) {
                handleVerifyOTP();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const otpArray = paste.split('');
        setOtp(paste);

        otpArray.forEach((digit, idx) => {
            if (inputsRef.current[idx]) {
                inputsRef.current[idx].value = digit;
            }
        });

        if (paste.length === 6) {
            handleVerifyOTP();
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

                    <div className="flex gap-4 mb-6" onPaste={handlePaste}>
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                ref={el => inputsRef.current[index] = el}
                                type="text"
                                maxLength="1"
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-15 text-center text-xl border rounded-full"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

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
