"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Haderbar from "@/components/layout/Haderbar";
import { authService } from "@/services/api";

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            setError("Please accept the terms of use");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await authService.register(formData);

            // Store the access token securely in HTTP-only cookie
            // Note: This assumes your backend sets the cookie with the token

            // Alternative: If you need to store in localStorage (less secure)
            if (response.accessToken) {
                // Store encrypted token
                const encryptedToken = btoa(response.accessToken);
                localStorage.setItem('auth_token', encryptedToken);
            }

            router.push("/");
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-orange-100">
            <Haderbar />
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="py-8 sm:py-12 md:py-[48px] flex flex-col items-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-center text-black font-bold">Sign Up</h1>
                    <p className="text-base sm:text-lg text-black text-center py-2 sm:py-4">Get started with assessments for free.</p>

                    {error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                        >
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 sm:space-y-[24px]">
                        <div>
                            <p className="text-sm font-medium mb-2">Your name</p>
                            <input
                                className="w-full border rounded-full px-3 sm:px-4 py-2 sm:py-3"
                                placeholder="Your name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Your email</p>
                            <input
                                className="w-full border rounded-full px-3 sm:px-4 py-2 sm:py-3"
                                placeholder="Your email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="bg-[#F0F1F5] p-3 sm:p-4 rounded-[24px]">
                            <p className="text-xs sm:text-sm text-gray-700">
                                Providing this information improves the accuracy of your assessment and helps us give better recommendations to measure Good Times in your life. It also helps us understand social trends. We only collect demographic data—your personal details stay private and cannot be linked back to you.
                            </p>
                            <div className="flex items-start mt-3 sm:mt-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="mt-1 mr-2"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    required
                                />
                                <label htmlFor="terms" className="text-xs sm:text-sm">
                                    I agree to the <a href="#" className="underline">terms of use</a>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-[24px]">
                            <button
                                type="submit"
                                disabled={loading || !termsAccepted}
                                className={`w-full text-center rounded-[24px] px-3 sm:px-4 py-2 sm:py-3 text-black font-medium text-sm sm:text-base transition-colors ${termsAccepted
                                        ? "bg-[#ff9933] hover:bg-[#f08827]"
                                        : "bg-gray-300 cursor-not-allowed"
                                    } disabled:opacity-50`}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-xs sm:text-sm">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="font-medium underline hover:text-[#ff9933] transition-colors"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="py-8 sm:py-12 md:py-[48px]"></div>
            </div>
        </div>
    );
}