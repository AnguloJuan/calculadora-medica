import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession, getSessionData } from './utils/sessions';
import { cerrarSesionAction } from './utils/actions';

export async function middleware(request: NextRequest) {
    const sesion = await getSessionData(request);
    

    if (request.nextUrl.pathname.startsWith('/nueva-calculadora') && !sesion) return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    // if (request.nextUrl.pathname.startsWith('/cerrar-sesion')) {
    //     await cerrarSesionAction(request);
    //     return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/nueva-calculadora',
        // '/cerrar-sesion',
    ]
};