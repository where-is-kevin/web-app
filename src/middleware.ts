import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get('access_token');

    if (accessToken && req.url === 'http://localhost:3000/') {
        return NextResponse.redirect(new URL('/user/profile', req.url));
    }

    // If no access token is found, redirect to login
    if (!accessToken && !req.url.includes('/login') && !req.url.includes('/register')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Continue the request if the token is found
    return NextResponse.next();
}

// Define routes to apply middleware to
export const config = {
    matcher: ['/home/:path', '/dashboard/:path*', '/profile/:path*', '/user/:path*', '/login/:path', '/register/:path', '/questionnaire'],  // Protected routes
};
