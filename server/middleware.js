import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // CORS 헤더 설정
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, PATCH, OPTIONS',
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
