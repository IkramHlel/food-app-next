export function normalizePathname(pathname) {
  return pathname.replace(/\/{2,}/g, '/')
}

export function isProtectedPath(pathname) {
  return pathname === '/' || pathname.startsWith('/meals') || pathname.startsWith('/community')
}

export function shouldRedirectToAuth({ user, pathname }) {
  return !user && isProtectedPath(pathname)
}

export function shouldRedirectAuthenticatedUser({ user, pathname }) {
  return Boolean(user) && pathname.startsWith('/auth')
}
