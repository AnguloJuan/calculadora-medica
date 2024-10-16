import { NextRequest, NextResponse } from 'next/server';
import { getSessionData } from './utils/auth';

export async function middleware(request: NextRequest) {
    const sesion = await getSessionData(request);

    // if (request.nextUrl.pathname.startsWith('/nueva-calculadora') && !session) return NextResponse.redirect(new URL('/iniciar-sesion', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/nueva-calculadora',
    ]
};