import { describe, it, expect, vi } from 'vitest'
import { notify } from '@/lib/toast'

vi.mock('react-hot-toast', () => {
  return {
    toast: {
      success: vi.fn((m: string) => m),
      error: vi.fn((m: string) => m),
      dismiss: vi.fn(),
      promise: vi.fn(),
    },
  }
})

describe('notify wrapper', () => {
  it('llama a toast.success sin recursión', () => {
    const msg = 'Toast OK'
    const result = notify.success(msg)
    expect(result).toBe(msg)
  })
  it('llama a toast.error', () => {
    const msg = 'Error X'
    const result = notify.error(msg)
    expect(result).toBe(msg)
  })
})