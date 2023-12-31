import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Logger } from './config/logger';
import { ELogMessage } from './constants/log_message';
import { Routes } from './app/(private)/_sidebar/routes';

export async function middleware(request: NextRequest) {
  const { pathname: currentPath, searchParams } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.SECRET,
  });

  const accessibleToPublic = ['/login', '/signup'];

  if (!token) {
    if (accessibleToPublic.includes(currentPath)) {
      // let the user come in to gain token
      return NextResponse.next();
    }

    // if no token and wants to access restricted page, redirect to login
    const prevLocation = `${currentPath}?${searchParams.toString()}`;
    return loginRedirect(prevLocation, request);
  }

  // here user is logged in, restrict access to login and signup pages
  if (accessibleToPublic.includes(currentPath)) {
    const prevLocation = `${currentPath}?${searchParams.toString()}`;
    const decodedPrevUri = decodeURIComponent(prevLocation);
    const redirectPathPrefix = '/login?redirect-to=';
    // redirect if the prev location contains redirect-to query param
    if (decodedPrevUri.startsWith(redirectPathPrefix)) {
      return NextResponse.redirect(
        new URL(decodedPrevUri.replace(redirectPathPrefix, ''), request.url)
      );
    }
    // else redirect to index
    return indexRedirect(request);
  }

  const routes = Routes.flat(1);
  const restrictedRoute = routes.find(
    (restricted) => restricted.pathname === currentPath
  );
  // do nothing if not restricted
  if (!restrictedRoute) return NextResponse.next();

  const userPermissions = new Set(token.permissions);
  let isPermitted = false;
  if (Array.isArray(restrictedRoute.permission)) {
    isPermitted = restrictedRoute.permission.every((permission) =>
      userPermissions.has(permission)
    );
  } else if (typeof restrictedRoute.permission === 'string') {
    isPermitted = userPermissions.has(restrictedRoute.permission);
  }

  // insufficient permission, redirect to index
  if (!isPermitted) {
    Logger.warn(request, ELogMessage.UserTryAccessWithoutPermission);
    return indexRedirect(request);
  }

  // everything is fine, let the user through
  Logger.info(request);
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
