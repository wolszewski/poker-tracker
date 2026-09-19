import { describe, expect, it } from 'vitest'
import {
  discrepancy,
  emptyNight,
  formatAmount,
  totalBuyIns,
  totalCashOuts,
} from './night'

describe('an empty Night', () => {
  it('has no Players and all totals at 0', () => {
    const night = emptyNight()
    expect(night.players).toEqual([])
    expect(formatAmount(totalBuyIns(night))).toBe('0')
    expect(formatAmount(totalCashOuts(night))).toBe('0')
    expect(formatAmount(discrepancy(night))).toBe('0')
  })
})
