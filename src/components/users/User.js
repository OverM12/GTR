"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Payment from '../payment/Payment'
import MenuUser from '../layout/MenuUser'
import { useContext } from 'react'
import { NavbarContext } from '@/context/NavbarProvider'
import { userService } from '@/services/userService'
import TermsOfUseModal from './Terms';
import PrivacyPolicyModal from './Privacy';

function User() {
  const { activeTab, setActiveTab } = useContext(NavbarContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        setUserProfile(response.data.data);
        //console.log("User profile fetched:", response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  //console.log("User profile:", userProfile);

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http")
      ? path
      : `${process.env.NEXT_PUBLIC_BASE_URL}/${path}`;
  };
  

  const EditProfileIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  )

  const EditProfileButton = () => (
    <Link href="/edit" className="flex items-center gap-2 border rounded-full px-4 py-2 text-[14px] hover:bg-gray-50">
      <EditProfileIcon />
      Edit Profile
    </Link>
  )

  const ProfileSection = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
    </div>
    }

    if (error) {
      return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (!userProfile) {
      return <div className="text-center p-4">No profile data available</div>;
    }

    // Get user initials for display when no profile pic is available
    const getUserInitials = () => {
      if (!userProfile || !userProfile.name) return "U";
      const nameParts = userProfile.name.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`;
      }
      return nameParts[0][0];
    };

    return (
      <div>
        <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-[24px] font-bold">User Profile</h2>
          <EditProfileButton />
        </div>

        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#9CA0B0]">
          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden relative">
            {/* {userProfile.profilePicturePath ? (
              <Image
                src={getProfileImageUrl(userProfile.profilePicturePath)}
                alt="Profile"
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">{getUserInitials()}</span>
              </div>
            )} */}
            <div className="absolute top-1 right-1 cursor-pointer sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15.7279 9.57678L14.3137 8.16256L5 17.4763V18.8905H6.41421L15.7279 9.57678ZM17.1421 8.16256L18.5563 6.74835L17.1421 5.33414L15.7279 6.74835L17.1421 8.16256ZM7.24264 20.8905H3V16.6479L16.435 3.21282C16.8256 2.82229 17.4587 2.82229 17.8492 3.21282L20.6777 6.04124C21.0682 6.43177 21.0682 7.06493 20.6777 7.45546L7.24264 20.8905Z" fill="#31363F" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-[18px] sm:text-xl font-bold">{userProfile.name}</h3>
            <p className="text-[16px] text-gray-600">{userProfile.email}</p>
          </div>
        </div>

        <div className="p-4 mb-4 mt-4 border-b border-[#9CA0B0]">
          <h3 className="font-bold text-[24px] mb-4">Personal Information</h3>
          <div className='flex gap-4'>
            <div className='space-y-4'>
              {['Date of birth', 'Gender', 'Nationality', 'Living'].map((label) => (
                <p key={label} className='text-[14px]'>{label}</p>
              ))}
            </div>
            <div className='flex flex-col space-y-4'>
              <p className='font-bold text-[14px]'>{userProfile.yearOfBirth}</p>
              <p className='font-bold text-[14px]'>{userProfile.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : 'Not specified'}</p>
              <p className='font-bold text-[14px]'>{userProfile.countryOfOrigin || 'Not specified'}</p>
              <p className='font-bold text-[14px]'>
                {userProfile.currentCity && userProfile.currentCountry
                  ? `${userProfile.currentCity}, ${userProfile.currentCountry}`
                  : userProfile.currentCountry || userProfile.currentCity || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 mb-4">
          <h3 className="font-bold text-[24px] mb-4">Consent</h3>
          <div className='flex gap-4'>
            <div className='space-y-4'>
              {['Terms and condition', 'Privacy policy'].map((label) => (
                <p key={label} className='text-[14px]'>{label}</p>
              ))}
            </div>
            <div className='flex flex-col space-y-4'>
              {userProfile.termsConsent !== undefined && userProfile.dataPrivacyConsent !== undefined && userProfile.privacyPolicyConsent !== undefined ? (
                <>
                  <div className='flex items-center gap-2'>
                    <p className='font-bold text-[14px]'>{userProfile.termsConsent ? 'Accepted' : 'Not accepted'}</p>
                    <button
                      className='underline font-bold text-sm'
                      onClick={() => setTermsModalOpen(true)}
                      type="button"
                    >
                      Read
                    </button>
                  </div>
                  <div className='flex items-center gap-2'>
                    <p className='font-bold text-[14px]'>{userProfile.privacyPolicyConsent ? 'Accepted' : 'Not accepted'}</p>
                    <button
                      className='underline font-bold text-sm'
                      onClick={() => setPrivacyModalOpen(true)}
                      type="button"
                    >
                      Read
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    className='underline font-bold text-sm'
                    onClick={() => setTermsModalOpen(true)}
                    type="button"
                  >
                    Read
                  </button>
                  <button
                    className='underline font-bold text-sm'
                    onClick={() => setPrivacyModalOpen(true)}
                    type="button"
                  >
                    Read
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1">
      <div className='px-4 sm:px-12 h-screen bg-[#F0F1F5] overflow-auto'>
        <h1 className="hidden sm:flex flex-col sm:flex-row px-4 sm:px-12 mt-5 mb-5 py-4 text-2xl sm:text-3xl font-bold">
          User Account
        </h1>

        <div className="flex justify-between items-center mt-4 mb-4 sm:hidden">
          <h2 className="text-xl font-bold">Profile</h2>
          <EditProfileButton />
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm h-auto sm:h-auto overflow-auto">
          <div className="flex flex-col h-full">
            <div className="hidden sm:flex sticky top-0 bg-white z-10 text-base">
              <MenuUser activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'profile' ? <ProfileSection /> : <Payment />}
            </div>
          </div>
        </div>
      </div>
      <TermsOfUseModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
    </div>
  )
}

export default User