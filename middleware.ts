// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   // ตรวจสอบ accessToken จาก cookies หรือ headers
//   const accessToken = req.cookies.get('accessToken') || req.headers.get('authorization');

//   // Log the request URL and accessToken
//   console.log("Request URL:", req.url);
//   console.log("Access Token:", accessToken);

//   // ถ้าไม่มี accessToken ให้ redirect ไปที่ /auth/signup
//   if (!accessToken) {
//     console.log("No access token, redirecting to /auth/signup");
//     return NextResponse.redirect(new URL('/auth/signup', req.url));
//   }

//   // ถ้ามี accessToken ก็ให้ให้ request ผ่านไป
//   console.log("Access token found, allowing request to continue.");
//   return NextResponse.next();
// }

// // กำหนด paths ที่ middleware นี้จะทำงาน
// export const config = {
//   matcher: ['/dashboard/:path*', '/insights/:path*', '/development/:path*'],
// };
