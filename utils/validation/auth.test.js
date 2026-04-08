import { describe, expect, it } from 'vitest'
import { LoginFormSchema, SignupFormSchema } from './auth'

describe('auth validation schemas', () => {
  it('accepts valid login payload', () => {
    const result = LoginFormSchema.safeParse({
      email: 'user@example.com',
      password: 'abc123!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid login payload', () => {
    const result = LoginFormSchema.safeParse({
      email: 'bad-email',
      password: '123',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid signup payload', () => {
    const result = SignupFormSchema.safeParse({
      name: 'Ikram Hlel',
      email: 'ikram@example.com',
      password: 'Foodapp!1',
    })
    expect(result.success).toBe(true)
  })

  it('rejects signup password without special char', () => {
    const result = SignupFormSchema.safeParse({
      name: 'Ikram Hlel',
      email: 'ikram@example.com',
      password: 'Foodapp11',
    })
    expect(result.success).toBe(false)
  })
})
