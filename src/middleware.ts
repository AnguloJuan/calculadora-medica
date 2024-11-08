import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './utils/sessions';

const protectedRoutes = ['/dashboard', 'nueva-calculadora', '/calculadoras', '/parametros', '/unidades']
const publicRoutes = ['/iniciar-sesion', '/calculadoras:path*', '/']

export default async function middleware(request: NextRequest) {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.nextUrl))
  }

  // if (request.nextUrl.pathname.startsWith('/nueva-calculadora') && !session) return NextResponse.redirect(new URL('/iniciar-sesion', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ],
};