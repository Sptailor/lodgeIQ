import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/auth', () => ({ auth: vi.fn() }))

import { auth } from '@/auth'
import { HttpError, requireUser, requireWriter, toErrorResponse } from '@/lib/auth-utils'

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>

async function statusOf(p: Promise<unknown>) {
  try {
    await p
    return 'ok'
  } catch (e) {
    return (e as HttpError).status
  }
}

describe('access helpers', () => {
  beforeEach(() => mockAuth.mockReset())

  it('rejects a signed out visitor with 401', async () => {
    mockAuth.mockResolvedValue(null)
    expect(await statusOf(requireUser())).toBe(401)
    expect(await statusOf(requireWriter())).toBe(401)
  })

  it('lets the demo account read but not write', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'demo', isDemo: true } })
    expect(await statusOf(requireUser())).toBe('ok')
    expect(await statusOf(requireWriter())).toBe(403)
  })

  it('lets a real account write', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1', isDemo: false } })
    await expect(requireWriter()).resolves.toMatchObject({ id: 'u1' })
  })
})

describe('toErrorResponse', () => {
  it('passes HttpError status and message through', async () => {
    const res = toErrorResponse(new HttpError(404, 'Property not found'))
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Property not found' })
  })

  it('hides unexpected errors behind a generic 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = toErrorResponse(new Error('connection string leaked'))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Something went wrong' })
  })
})
