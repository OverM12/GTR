"use client"
import React from 'react'
import Image from 'next/image'

function Payment() {
  return (
    <>
      <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6">
        <h3 className="text-xl lg:text-2xl font-bold mb-4 sm:mb-6">Subscription Plan</h3>
        <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center w-full">
            <div className="flex flex-col p-3 sm:p-4 gap-3 flex-1 rounded-2xl bg-[#F0F1F5] w-full lg:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#ff9933] rounded-full w-fit">
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z" fill="#151B2A" />
                  </svg>
                </div>
                <div className="text-[#151B2A] text-sm font-bold">Premium Plan</div>
              </div>
              <p className="text-sm text-gray-600">1 assessments for free. Log in as many time as you want.</p>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 sm:gap-4 flex-1 p-3 sm:p-4 mt-3 lg:mt-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-bold">10</span>
                  <span className="text-sm sm:text-base -mt-4 sm:-mt-5">USD</span>
                </div>
                <div className="text-sm leading-relaxed text-[#151B2A]">
                  Per month <br />
                  (120.0 USD per year)
                </div>
              </div>
              <div className='px-2 sm:px-4'>
                <button className="w-full lg:w-auto border border-gray-300 rounded-full py-2 px-4 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M3.75 14.1674H4.81066L11.7959 7.1821L10.7353 6.12143L3.75 13.1067V14.1674ZM15.75 15.6674H2.25V12.4854L12.3262 2.40913C12.6192 2.11623 13.094 2.11623 13.3869 2.40913L15.5083 4.53044C15.8012 4.82334 15.8012 5.29821 15.5083 5.59111L6.93198 14.1674H15.75V15.6674ZM11.7959 5.06077L12.8566 6.12143L13.9172 5.06077L12.8566 4.00012L11.7959 5.06077Z" fill="black" />
                  </svg>
                  Update Plan
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-[300px] p-3 sm:p-4 items-start self-stretch bg-white rounded-2xl shadow-sm">
            <div className="text-sm text-gray-600">Next Payment Due</div>
            <div className="text-base sm:text-lg font-medium mt-2">20 April, 2025</div>
          </div>
        </div>
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl lg:text-2xl font-bold mb-4 sm:mb-6">Billing History</h3>
          <div className="overflow-x-auto border border-[#E6E7F0] rounded-2xl">
            <div className="min-w-full overflow-hidden">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Header</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Header</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Header</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Header</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 sm:gap-4">
            <h3 className="text-xl lg:text-2xl font-bold">Payment Method</h3>
            <div className="flex text-sm text-gray-500 px-3 py-2 rounded-lg bg-[#F0F1F5]">
              Manage payment by
              <div className="flex items-center gap-2 px-2">
                <Image src='/your-gtr/your-gtr/users_img/stripe.svg' alt='Stripe' className="w-[30px] h-[12px]" width={1920} height={1080} />
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-[460px] p-3 sm:p-4 items-center gap-3 rounded-2xl bg-[#F0F1F5]">
            <div className="flex items-center justify-between w-full flex-wrap md:flex-nowrap">
              <div className="flex items-center gap-3">
                <div className="text-blue-600">
                  <Image src="/your-gtr/your-gtr/users_img/visa.svg" alt="Payment Icon" className="w-[40px] h-[40px]" width={1920} height={1080} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Payment Method</div>
                  <div className="font-medium">•••• •••• 1234 1234</div>
                  <div className="text-sm text-gray-500">03/27</div>
                </div>
              </div>
              <button className="border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-2 mt-3 md:mt-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Payment
