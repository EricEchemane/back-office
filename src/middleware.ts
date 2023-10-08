import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { restrictedRoutes } from './config/restricted_routes';

export async function middleware(request: NextRequest) {
  const { pathname: currentPath, searchParams } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.SECRET,
  });

  const accessibleToPublic = ['/login', '/signup'];

  if (!token) {
    if (accessibleToPublic.includes(currentPath)) {
      return NextResponse.next();
    }

    const prevLocation = `${currentPath}?${searchParams.toString()}`;
    return loginRedirect(prevLocation, request);
  }

  // when user is logged in, restrict access to login and signup pages
  if (accessibleToPublic.includes(currentPath)) {
    return indexRedirect(request);
  }

  const restrictedRoute = restrictedRoutes.find(
    (restricted) => restricted.path === currentPath
  );
  // do nothing if not restricted
  if (!restrictedRoute) return NextResponse.next();

  const userPermissions = new Set(token.permissions);
  const isPermitted = userPermissions.has(restrictedRoute.permission);
  if (!isPermitted) return indexRedirect(request);

  // everything is fine, let the user through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

function loginRedirect(prevLocation: string, req: NextRequest) {
  const response = NextResponse.redirect(
    new URL(`/login?redirect-to=${encodeURIComponent(prevLocation)}`, req.url)
  );
  return response;
}

function indexRedirect(req: NextRequest) {
  return NextResponse.redirect(new URL('/', req.url));
}
