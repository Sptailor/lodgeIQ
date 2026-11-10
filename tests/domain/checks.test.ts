import { describe, expect, it } from 'vitest'
import { CHECKS, fullScore, isValidAnswers, scoreOf } from '@/lib/domain/checks'

describe('CHECKS', () => {
  it('has nine checks, three per category, with unique slugs', () => {
    expect(CHECKS).toHaveLength(9)
    for (const k of [0, 1, 2]) expect(CHECKS.filter((c) => c.category === k)).toHaveLength(3)
    expect(new Set(CHECKS.map((c) => c.slug)).size).toBe(9)
  })
})

describe('scoreOf', () => {
  it('scores all passes as 5 and all fails as 1', () => {
    expect(scoreOf('ppppppppp'.split(''))).toEqual({ c: [5, 5, 5], s: 5 })
    expect(scoreOf('fffffffff'.split(''))).toEqual({ c: [1, 1, 1], s: 1 })
    expect(scoreOf('nnnnnnnnn'.split(''))).toEqual({ c: [3, 3, 3], s: 3 })
  })

  it('weights checks within a category', () => {
    // Bathroom cleanliness (weight 2 of 5) fails: (2*1 + 1.5*5 + 1.5*5) / 5 = 3.4
    expect(scoreOf('fpppppppp').c[0]).toBe(3.4)
    // Linen quality (weight 1.5 of 5) fails: (2*5 + 1.5*5 + 1.5*1) / 5 = 3.8
    expect(scoreOf('ppfpppppp').c[0]).toBe(3.8)
  })

  it('averages the rounded category scores for the overall score', () => {
    // Fire safety fails: safety = 14.5 / 4.5 = 3.22 -> 3.2, overall (5 + 3.2 + 5) / 3 = 4.4
    expect(scoreOf('pppfppppp')).toEqual({ c: [5, 3.2, 5], s: 4.4 })
    // Mixed: 3.2, 3.4, 3.3 -> 3.3
    expect(scoreOf('pnfpnfpnf')).toEqual({ c: [3.2, 3.4, 3.3], s: 3.3 })
  })

  it('ignores unanswered checks and categories', () => {
    expect(scoreOf(['p'])).toEqual({ c: [5, null, null], s: 5 })
    expect(scoreOf([null, 'f', undefined, '', 'p'])).toEqual({ c: [1, 5, null], s: 3 })
    expect(scoreOf([])).toEqual({ c: [null, null, null], s: null })
  })
})

describe('fullScore', () => {
  it('returns category scores and the overall score', () => {
    expect(fullScore('pnfpnfpnf')).toEqual({ cats: [3.2, 3.4, 3.3], score: 3.3 })
  })

  it('throws when a whole category is unanswered', () => {
    expect(() => fullScore('pppppp')).toThrow('Incomplete answers')
  })
})

describe('isValidAnswers', () => {
  it.each([
    ['ppppppppp', true],
    ['pnfpnfpnf', true],
    ['pppppppp', false], // eight
    ['pppppppppp', false], // ten
    ['ppppppppx', false],
    ['PPPPPPPPP', false],
    [null, false],
    [123456789, false],
  ])('%s -> %s', (input, expected) => {
    expect(isValidAnswers(input)).toBe(expected)
  })
})
