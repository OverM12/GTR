"use client";
import React, { useState, useEffect, useRef } from "react";
import { userService } from "@/services/userService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        yearOfBirth: "",
        gender: "",
        countryOfOrigin: "",
        currentCountry: "",
        currentCity: "",
        termsConsent: true,
        dataPrivacyConsent: true,
        privacyPolicyConsent: true,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await userService.getProfile();
                const userData = response.data;

                setFormData((prev) => ({
                    ...prev,
                    name: userData.name || "",
                    email: userData.email || "",
                    yearOfBirth: userData.yearOfBirth || "",
                    gender: userData.gender || "",
                    countryOfOrigin: userData.countryOfOrigin || "",
                    currentCountry: userData.currentCountry || "",
                    currentCity: userData.currentCity || "",
                    termsConsent: userData.termsConsent !== undefined ? userData.termsConsent : true,
                    dataPrivacyConsent: userData.dataPrivacyConsent !== undefined ? userData.dataPrivacyConsent : true,
                    privacyPolicyConsent: userData.privacyPolicyConsent !== undefined ? userData.privacyPolicyConsent : true,
                }));

                if (userData.profilePicturePath) {
                    // ใช้ profilePicturePath จาก API response
                    const fullImageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userData.profilePicturePath}`;
                    setProfilePictureUrl(fullImageUrl);
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleProfilePictureClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const previewUrl = URL.createObjectURL(file);
            setProfilePictureUrl(previewUrl);
        }
    };

    const uploadProfilePicture = async () => {
        if (!profilePicture) return;

        try {
            const formData = new FormData();
            formData.append("profilePicture", profilePicture); // ใช้ key เป็น "profilePicture" ตาม API

            const response = await userService.updateProfilePicture(formData);

            // อัปเดต URL รูปภาพด้วย path จากเซิร์ฟเวอร์
            const newProfilePicturePath = response.data.profilePicturePath;
            const fullImageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${newProfilePicturePath}`;
            setProfilePictureUrl(fullImageUrl);

            return response.data;
        } catch (err) {
            console.error("Error uploading profile picture:", err);
            setError("Failed to upload profile picture. Please try again.");
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const updateData = {
                name: formData.name,
                yearOfBirth: parseInt(formData.yearOfBirth),
                gender: formData.gender,
                countryOfOrigin: formData.countryOfOrigin,
                currentCountry: formData.currentCountry,
                currentCity: formData.currentCity,
                termsConsent: formData.termsConsent,
                dataPrivacyConsent: formData.dataPrivacyConsent,
                privacyPolicyConsent: formData.privacyPolicyConsent,
            };

            if (profilePicture) {
                await uploadProfilePicture();
            }

            await userService.updateProfile(updateData);
            router.push("/");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.message || "Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex">
                <div className="bg-gray-50 w-full min-h-screen">
                    <div className="max-w-2xl h-lvh overflow-auto mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4 pb-8">
                        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-4">Edit Profile</h1>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="bg-[#C6B06A] rounded-lg p-2 sm:p-2.5 md:p-3 lg:p-4 mb-4 md:mb-6 flex items-start gap-2">
                            <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                <path d="M8.57634 1.99946L14.9271 12.9995C15.1113 13.3183 15.002 13.7261 14.6831 13.9101C14.5818 13.9687 14.4669 13.9995 14.3498 13.9995H1.64811C1.27992 13.9995 0.981445 13.701 0.981445 13.3328C0.981445 13.2157 1.01225 13.1008 1.07076 12.9995L7.42161 1.99946C7.60574 1.6806 8.01341 1.57135 8.33227 1.75544C8.43367 1.81396 8.51781 1.89812 8.57634 1.99946ZM2.80281 12.6661H13.1951L7.99894 3.66613L2.80281 12.6661ZM7.33227 10.6661H8.66561V11.9995H7.33227V10.6661ZM7.33227 5.99946H8.66561V9.33282H7.33227V5.99946Z" fill="black" />
                            </svg>
                            <p className="text-xs md:text-sm lg:text-base text-[#2B2E38] flex-1">Complete your profile to unlock the full potential for your GTR assessment.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white rounded-xl md:rounded-[40px] p-3 md:p-4 lg:p-6 shadow-sm mb-4 md:mb-6">
                            <div className="flex flex-col items-start gap-4 p-3 md:p-4 lg:p-[16px] self-stretch">
                                <h2 className="text-base md:text-lg lg:text-xl font-bold">User Profile</h2>

                                <div className="flex w-full">
                                    <div
                                        className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border border-gray-300 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden relative"
                                        onClick={handleProfilePictureClick}
                                    >
                                        {profilePictureUrl ? (
                                            <Image
                                                src={profilePictureUrl}
                                                alt="Profile"
                                                layout="fill"
                                                objectFit="cover"
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="black" />
                                                </svg>
                                                <span className="text-[8px] md:text-[10px] lg:text-xs text-center text-[#2B2E38]">Upload profile pic</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 w-full">
                                    <div className="space-y-2 md:space-y-3">
                                        <label htmlFor="name" className="block text-xs md:text-sm font-medium">Your name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Your name"
                                            className="w-full p-2 md:p-2.5 lg:p-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2 md:space-y-3">
                                        <label htmlFor="email" className="block text-xs md:text-sm font-medium">Your email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Your email"
                                            className="w-full p-2 md:p-2.5 lg:p-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                                            value={formData.email}
                                            disabled
                                            readOnly
                                        />
                                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 md:pt-6 mb-6 p-3 md:p-4 lg:p-[16px]">
                                <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 md:mb-6">Personal Information</h2>

                                <div className="space-y-3 md:space-y-4">
                                    <div>
                                        <label htmlFor="yearOfBirth" className="block text-xs md:text-sm font-medium mb-2">What&apos;s your year of birth?</label>
                                        <input
                                            type="number"
                                            id="yearOfBirth"
                                            name="yearOfBirth"
                                            placeholder="Enter date of birth"
                                            className="w-full p-2 md:p-2.5 lg:p-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.yearOfBirth}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs md:text-sm font-medium mb-2">What&apos;s your gender?</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['male', 'female', 'other'].map(gender => (
                                                <label key={gender} className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value={gender}
                                                        className="hidden"
                                                        checked={formData.gender === gender}
                                                        onChange={handleChange}
                                                    />
                                                    <span className={`px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 text-xs md:text-sm rounded-full border transition-colors ${formData.gender === gender ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:border-gray-400'}`}>
                                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="countryOfOrigin" className="block text-xs md:text-sm font-medium mb-2">Where are you from?</label>
                                        <div className="relative">
                                            <select
                                                id="countryOfOrigin"
                                                name="countryOfOrigin"
                                                className="w-full p-2 md:p-2.5 lg:p-3 text-xs md:text-sm border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.countryOfOrigin}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>Select country</option>
                                                <option value="Thailand">Thailand</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States">United States</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs md:text-sm font-medium mb-2">Where do you currently live mostly?</label>
                                        <div className="space-y-2 md:space-y-3">
                                            <div className="relative">
                                                <select
                                                    id="currentCountry"
                                                    name="currentCountry"
                                                    className="w-full p-2 md:p-2.5 lg:p-3 text-xs md:text-sm border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={formData.currentCountry}
                                                    onChange={handleChange}
                                                >
                                                    <option value="" disabled>Select country</option>
                                                    <option value="Thailand">Thailand</option>
                                                    <option value="United Kingdom">United Kingdom</option>
                                                    <option value="United States">United States</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="currentCity"
                                                    name="currentCity"
                                                    placeholder="Enter your city"
                                                    className="w-full p-2 md:p-2.5 lg:p-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={formData.currentCity}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 md:pt-6 mb-6 p-3 md:p-4 lg:p-[16px]">
                                <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 md:mb-6">Consent</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {[
                                        { name: 'termsConsent', label: 'Terms and condition' },
                                        { name: 'dataPrivacyConsent', label: 'Data privacy' },
                                        { name: 'privacyPolicyConsent', label: 'Privacy policy' }
                                    ].map((consent) => (
                                        <div key={consent.name} className="bg-gray-100 p-2 md:p-2.5 lg:p-3 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] md:text-xs lg:text-sm">{consent.label}</p>
                                                <p className="text-[8px] md:text-[10px] lg:text-xs text-black underline cursor-pointer">Read</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name={consent.name}
                                                    className="sr-only peer"
                                                    checked={formData[consent.name]}
                                                    onChange={handleChange}
                                                />
                                                <div className="w-8 md:w-9 lg:w-11 h-4 md:h-5 lg:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 md:after:h-4 lg:after:h-5 after:w-3 md:after:w-4 lg:after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col xs:flex-row gap-2 md:gap-3 justify-end p-3 md:p-4 lg:p-[16px]">
                                <Link
                                    href="/your-gtr"
                                    className="py-1 md:py-1.5 lg:py-2 px-2 md:px-3 lg:px-4 text-xs md:text-sm border border-gray-300 rounded-full text-center hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="py-1 md:py-1.5 lg:py-2 px-2 md:px-3 lg:px-4 text-xs md:text-sm bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-70"
                                >
                                    {saving ? 'Saving...' : 'Save Edit'}
                                </button>
                            </div>
                        </form>

                        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm mb-4 md:mb-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-[16px]">
                                <div>
                                    <h2 className="text-sm md:text-base lg:text-lg font-bold mb-2">Delete account?</h2>
                                    <p className="text-[10px] md:text-xs lg:text-sm text-gray-600 mb-1">
                                        When the account was deleted, it causes all of your information be removed from the system in next 30 days.
                                    </p>
                                    <p className="text-[10px] md:text-xs lg:text-sm text-gray-600">
                                        Without logging in back within duration, you have to start from beginning again.
                                    </p>
                                </div>
                                <button
                                    className="flex justify-center items-center gap-2 py-2 md:py-[10px] px-3 md:px-[16px] text-xs md:text-sm border border-gray-300 bg-white text-gray-700 rounded-full whitespace-nowrap hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                        <path d="M4.5 14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25H4.5V14.25ZM14.25 3H11.625L10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3Z" fill="#1C1B1F" />
                                    </svg>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                        <div className="bg-white rounded-xl w-full max-w-md p-6 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <path d="M20.667 5.99935H27.3337V8.66602H24.667V25.9993C24.667 26.7357 24.0701 27.3327 23.3337 27.3327H4.66699C3.93062 27.3327 3.33366 26.7357 3.33366 25.9993V8.66602H0.666992V5.99935H7.33366V1.99935C7.33366 1.26298 7.93062 0.666016 8.66699 0.666016H19.3337C20.0701 0.666016 20.667 1.26298 20.667 1.99935V5.99935ZM22.0003 8.66602H6.00033V24.666H22.0003V8.66602ZM10.0003 12.666H12.667V20.666H10.0003V12.666ZM15.3337 12.666H18.0003V20.666H15.3337V12.666ZM10.0003 3.33268V5.99935H18.0003V3.33268H10.0003Z" fill="#31363F" />
                                    </svg>
                                    <h2 className="text-lg font-bold">Delete Account</h2>
                                </div>
                                <button
                                    className="text-black hover:text-gray-700 transition-colors"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm mb-2">You will permanently lose your:</p>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    <li className='text-xs'>All user information</li>
                                    <li className='text-xs'>All of your assessment record</li>
                                </ul>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    className="py-2 px-4 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="py-2 px-4 bg-orange-500 text-black rounded-full text-sm flex items-center hover:bg-orange-600 transition-colors"
                                    onClick={async () => {
                                        try {
                                            await userService.deleteAccount();
                                            // Redirect to the account deleted page
                                            router.push('/users/deleted');
                                        } catch (err) {
                                            console.error('Error deleting account:', err);
                                            setError(err.message || 'Failed to delete account. Please try again.');
                                            setShowDeleteModal(false);
                                        }
                                    }}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};