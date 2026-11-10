import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({ prisma: {} }))
vi.mock('@/lib/seed/sample-seed', () => ({ resetSampleData: vi.fn() }))

import { resetSampleData } from '@/lib/seed/sample-seed'
import { GET } from '@/app/api/cron/reseed-demo/route'

const reset = resetSampleData as unknown as ReturnType<typeof vi.fn>
const call = (auth?: string) =>
  GET(new Request('http://localhost/api/cron/reseed-demo', { headers: auth ? { authorization: auth } : {} }))

describe('GET /api/cron/reseed-demo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('CRON_SECRET', 's3cret')
  })
  afterEach(() => vi.unstubAllEnvs())

  it('refuses requests without the secret', async () => {
    expect((await call()).status).toBe(401)
    expect((await call('Bearer wrong')).status).toBe(401)
    expect(reset).not.toHaveBeenCalled()
  })

  it('refuses everything when no secret is configured', async () => {
    vi.stubEnv('CRON_SECRET', '')
    expect((await call('Bearer ')).status).toBe(401)
    expect(reset).not.toHaveBeenCalled()
  })

  it('reseeds with the right secret', async () => {
    reset.mockResolvedValue(undefined)
    const res = await call('Bearer s3cret')
    expect(res.status).toBe(200)
    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('reports a failed reseed as 500 without leaking the error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    reset.mockRejectedValue(new Error('db down'))
    const res = await call('Bearer s3cret')
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Reseed failed' })
  })
})
