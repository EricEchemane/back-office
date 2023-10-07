import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { routePermissions } from './config/route-permissions';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === '/login') {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.SECRET,
  });
  if (!token) {
    const destination = `${pathname}?${searchParams.toString()}`;
    const response = NextResponse.redirect(
      new URL(
        `/login?redirect-to=${encodeURIComponent(destination)}`,
        request.url
      )
    );
    return response;
  }

  const restrictedRoute = routePermissions.find(
    (route) => route.path === pathname
  );
  // do nothing if not restricted
  if (!restrictedRoute) return NextResponse.next();

  const userPermissions = new Set(token.permissions);
  const permitted = userPermissions.has(restrictedRoute.permission);
  if (!permitted) {
    const response = NextResponse.redirect(new URL('/', request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
