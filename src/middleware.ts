import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './utils/sessions';

const protectedRoutes = ['/calculadoras', '/parametros', '/unidades', '/registrar-usuario'];
const publicRoutes = ['/iniciar-sesion', '/calculadoras:path*', '/'];

export default async function middleware(request: NextRequest) {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ],
};