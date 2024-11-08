import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './utils/sessions';

export default async function middleware(request: NextRequest) {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (request.nextUrl.pathname.startsWith('/nueva-calculadora') && !session) return NextResponse.redirect(new URL('/iniciar-sesion', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/nueva-calculadora',
    '/dashboard',
  ]
};