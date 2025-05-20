"use client";

import React from "react";

export default function PrivacyPolicyModal(props) {
  const { isOpen, onClose } = props;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-20 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-[40px] shadow-xl max-w-7xl max-h-[80vh] w-full overflow-hidden flex flex-col relative">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-lg font-semibold">Privacy Policy</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-4 overflow-y-auto text-sm text-gray-700 flex-grow">
            <p>
              At GoodTime Flow Limited, your privacy is our priority. This Privacy Policy describes how we collect, use, share, and protect your personal data when you use the GoodTime, our digital well-being and lifestyle assessment platform.
            </p>
            <p className="mt-2">
              This policy complies with the Personal Data (Privacy) Ordinance (PDPO) of Hong Kong and the Personal Data Protection Act (PDPA) of Thailand.
            </p>

            <h3 className="mt-4 font-semibold">1. Data We Collect</h3>
            <p>We may collect the following categories of personal data:</p>
            <ul className="list-disc list-inside ml-4">
              <li>
                <strong>a. Directly Provided by You</strong><br />
                Name, email, and login credentials<br />
                Your self-assessment inputs (e.g., emotional, social, and behavioral data)
              </li>
              <li className="mt-2">
                <strong>b. Automatically Collected</strong><br />
                Usage data such as browser, device, IP address, and session data<br />
                Interaction patterns with the GoodTime platform (e.g., clicks, scrolls, and interactions with features)
              </li>
              <li className="mt-2">
                <strong>c. Sensitive Data</strong><br />
                Lifestyle and emotional well-being inputs collected through assessments<br />
                This data is only collected with your explicit, informed consent
              </li>
            </ul>

            <h3 className="mt-4 font-semibold">2. Purpose of Data Collection</h3>
            <p>We collect and process your data for the following purposes:</p>
            <ul className="list-disc list-inside ml-4">
              <li>To create and manage your account</li>
              <li>To provide personalized self-assessment and well-being insights</li>
              <li>To improve service functionality and user experience</li>
              <li>To communicate updates or respond to inquiries</li>
              <li>To comply with legal and regulatory obligations</li>
            </ul>

            <h3 className="mt-4 font-semibold">3. Legal Basis for Processing</h3>
            <p>We process your data based on:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Your explicit consent (for sensitive personal data)</li>
              <li>Contractual necessity (e.g., providing services you request)</li>
              <li>Legal obligations (when required by law)</li>
            </ul>

            <h3 className="mt-4 font-semibold">4. Data Storage and Security</h3>
            <p>
              Your data is stored securely on servers using encryption and access controls. We implement administrative, technical, and physical safeguards to protect your data against unauthorized access, alteration, or disclosure.
            </p>

            <h3 className="mt-4 font-semibold">5. Data Retention</h3>
            <p>
              We retain personal data only for as long as needed to fulfill the purposes stated in this policy or as required by applicable law. Upon your request or account termination, your data will be deleted or anonymized unless retention is legally required.
            </p>

            <h3 className="mt-4 font-semibold">6. Data Sharing</h3>
            <p>We may share your data:</p>
            <ul className="list-disc list-inside ml-4">
              <li>With service providers under binding agreements for hosting and analytics</li>
              <li>When legally required or in connection with legal claims</li>
              <li>In the event of a corporate restructure or acquisition</li>
            </ul>

            <h3 className="mt-4 font-semibold">7. Your Rights</h3>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Access your personal data and obtain a copy</li>
              <li>Request corrections to inaccurate or incomplete data</li>
              <li>Withdraw consent (where processing is based on consent)</li>
              <li>Object to data processing or request data deletion</li>
              <li>Lodge complaints with the relevant privacy authority (PPC in HK or PDPC in Thailand)</li>
            </ul>
            <p>You may exercise these rights by contacting us at <a href="mailto:contact@goodtime.app" className="text-blue-600 underline">contact@goodtime.app</a>.</p>

            <h3 className="mt-4 font-semibold">8. Cookies and Analytics</h3>
            <p>
              We use cookies and similar technologies to improve the platform. You can manage cookie settings via your browser. Non-essential cookies are only used with your consent.
            </p>

            <h3 className="mt-4 font-semibold">9. Children&apos;s Data</h3>
            <p>
              Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
