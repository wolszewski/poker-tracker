import { describe, expect, it } from 'vitest'
import {
  addBuyIn,
  addPlayer,
  discrepancy,
  type Change,
  type Night,
  emptyNight,
  formatAmount,
  totalBuyIn,
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

const ok = (change: Change): Night => {
  if (!change.ok) throw new Error(`expected the change to succeed: ${change.error}`)
  return change.night
}

describe('adding Players', () => {
  it('adds a Player by name', () => {
    const night = ok(addPlayer(emptyNight(), 'Alice'))
    expect(night.players.map((p) => p.name)).toEqual(['Alice'])
  })

  it('rejects an empty or blank name', () => {
    expect(addPlayer(emptyNight(), '').ok).toBe(false)
    expect(addPlayer(emptyNight(), '   ').ok).toBe(false)
  })

  it('trims spaces around the name', () => {
    const night = ok(addPlayer(emptyNight(), '  Bob '))
    expect(night.players[0].name).toBe('Bob')
  })

  it('gives each Player a different ID', () => {
    const night = ok(addPlayer(ok(addPlayer(emptyNight(), 'Alice')), 'Bob'))
    const [alice, bob] = night.players
    expect(alice.id).not.toBe(bob.id)
  })
})

/** A Night with one Player per name, in order. */
const nightWith = (...names: string[]): Night =>
  names.reduce((night, name) => ok(addPlayer(night, name)), emptyNight())

const idOf = (night: Night, index: number) => night.players[index].id

describe('Buy-ins', () => {
  it('records a Buy-in and adds it to the Total buy-in', () => {
    let night = nightWith('Alice')
    night = ok(addBuyIn(night, idOf(night, 0), '50'))
    expect(formatAmount(totalBuyIn(night, idOf(night, 0)))).toBe('50')
  })
})

const buyIns = (night: Night, playerIndex: number, ...amounts: string[]): Night =>
  amounts.reduce((n, amount) => ok(addBuyIn(n, idOf(n, playerIndex), amount)), night)

describe('Total buy-ins', () => {
  it('lists every Buy-in of a Player and sums them', () => {
    const night = buyIns(nightWith('Alice'), 0, '50', '100', '50')
    expect(night.players[0].buyIns.map((b) => formatAmount(b.amount))).toEqual(['50', '100', '50'])
    expect(formatAmount(totalBuyIn(night, idOf(night, 0)))).toBe('200')
  })

  it('sums the Buy-ins of every Player for the Night', () => {
    let night = nightWith('Alice', 'Bob')
    night = buyIns(night, 0, '50', '100')
    night = buyIns(night, 1, '50')
    expect(formatAmount(totalBuyIns(night))).toBe('200')
  })

  it('adds decimal amounts exactly', () => {
    const night = buyIns(nightWith('Alice'), 0, '0.1', '0.2')
    expect(formatAmount(totalBuyIn(night, idOf(night, 0)))).toBe('0.3')
  })

  it('accepts two decimal places and drops trailing zeros when shown', () => {
    const night = buyIns(nightWith('Alice'), 0, '301.50', '0.05')
    expect(night.players[0].buyIns.map((b) => formatAmount(b.amount))).toEqual(['301.5', '0.05'])
  })
})

describe('Buy-in amount validation', () => {
  it.each(['0', '0.00', '-50', '10.555', 'abc', '', '  ', '1e3', '12abc', 'Infinity'])(
    'rejects %j with a message',
    (amount) => {
      const night = nightWith('Alice')
      const change = addBuyIn(night, idOf(night, 0), amount)
      expect(change.ok).toBe(false)
      if (!change.ok) expect(change.error).not.toBe('')
    },
  )

  it('accepts a decimal comma, as phone keyboards in some languages type it', () => {
    const night = buyIns(nightWith('Alice'), 0, '12,5')
    expect(formatAmount(totalBuyIn(night, idOf(night, 0)))).toBe('12.5')
  })

  it('ignores spaces around the amount', () => {
    const night = buyIns(nightWith('Alice'), 0, ' 75 ')
    expect(formatAmount(totalBuyIn(night, idOf(night, 0)))).toBe('75')
  })

  it('rejects a Buy-in for a Player who is not in the Night', () => {
    expect(addBuyIn(nightWith('Alice'), 'nobody', '50').ok).toBe(false)
  })
})
