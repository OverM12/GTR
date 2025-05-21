"use client";

export default function TermsOfUseModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black opacity-20"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-[40px] shadow-xl max-w-7xl w-full overflow-hidden flex flex-col relative">
                    {/* Header with Close Button */}
                    <div className="flex justify-between items-center px-6 py-4">
                        <h2 className="text-lg font-semibold">Terms of Use</h2>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="px-6 py-4 overflow-y-auto text-sm text-gray-700 flex-grow max-h-[70vh]">
                        <p>
                            Welcome to the GoodTime, a digital lifestyle performance coach provided by GoodTime Flow Limited. These Terms of Use (&apos;Terms&apos;) govern your access to and use of the GoodTime web platform and related services (collectively, the &apos;Service&apos;).
                        </p>
                        <p className="mt-2">
                            By accessing or using GoodTime, you agree to be bound by these Terms. If you do not agree, do not use the Service.
                        </p>

                        <h3 className="mt-4 font-semibold">1. Eligibility</h3>
                        <p>You must be at least 18 years old to use the Service. By using GoodTime, you represent that you meet this age requirement.</p>

                        <h3 className="mt-4 font-semibold">2. User Account</h3>
                        <p>You may be required to create an account to use certain features. You agree to provide accurate information and to keep your credentials secure. You are responsible for all activity under your account.</p>

                        <h3 className="mt-4 font-semibold">3. Use of the Service</h3>
                        <p>GoodTime is intended for personal, non-commercial use. You agree not to misuse the platform or interfere with its operation. You may not reverse engineer, copy, or redistribute any part of the Service without written permission.</p>

                        <h3 className="mt-4 font-semibold">4. Health Disclaimer</h3>
                        <p>GoodTime provides self-reflection tools and well-being insights but is not a substitute for professional medical, psychological, or mental health advice. Always consult a qualified professional for any health concerns.</p>

                        <h3 className="mt-4 font-semibold">5. Privacy</h3>
                        <p>Your use of the Service is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information.</p>

                        <h3 className="mt-4 font-semibold">6. Intellectual Property</h3>
                        <p>All content, features, and functionality of GoodTime, including text, graphics, and software, are owned by GoodTime Flow Limited and protected by intellectual property laws.</p>

                        <h3 className="mt-4 font-semibold">7. Termination</h3>
                        <p>We may suspend or terminate your access to the Service if you violate these Terms or use the Service in a harmful way. You may terminate your account at any time by contacting us.</p>

                        <h3 className="mt-4 font-semibold">8. Modifications</h3>
                        <p>We may update these Terms from time to time. If we make material changes, we will notify you through the Service or by email. Continued use after changes means you accept the new Terms.</p>

                        <h3 className="mt-4 font-semibold">9. Limitation of Liability</h3>
                        <p>To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of GoodTime.</p>

                        <h3 className="mt-4 font-semibold">10. Governing Law</h3>
                        <p>These Terms are governed by the laws of Hong Kong. Any disputes shall be resolved exclusively in the courts of that jurisdiction.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
