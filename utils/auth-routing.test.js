import { describe, expect, it } from 'vitest'
import {
  isProtectedPath,
  normalizePathname,
  shouldRedirectAuthenticatedUser,
  shouldRedirectToAuth,
} from './auth-routing'

describe('auth routing helpers', () => {
  it('normalizes repeated slashes', () => {
    expect(normalizePathname('//auth')).toBe('/auth')
    expect(normalizePathname('/meals//share')).toBe('/meals/share')
  })

  it('detects protected paths', () => {
    expect(isProtectedPath('/')).toBe(true)
    expect(isProtectedPath('/meals')).toBe(true)
    expect(isProtectedPath('/meals/share')).toBe(true)
    expect(isProtectedPath('/community')).toBe(true)
    expect(isProtectedPath('/my-meals')).toBe(true)
    expect(isProtectedPath('/auth')).toBe(false)
  })

  it('redirects anonymous users to auth only for protected paths', () => {
    expect(shouldRedirectToAuth({ user: null, pathname: '/' })).toBe(true)
    expect(shouldRedirectToAuth({ user: null, pathname: '/meals' })).toBe(true)
    expect(shouldRedirectToAuth({ user: null, pathname: '/auth' })).toBe(false)
  })

  it('redirects authenticated users away from auth pages', () => {
    expect(shouldRedirectAuthenticatedUser({ user: { id: '1' }, pathname: '/auth' })).toBe(true)
    expect(shouldRedirectAuthenticatedUser({ user: { id: '1' }, pathname: '/auth/login' })).toBe(true)
    expect(shouldRedirectAuthenticatedUser({ user: { id: '1' }, pathname: '/meals' })).toBe(false)
  })
})
