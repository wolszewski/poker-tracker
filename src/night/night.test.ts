import { describe, expect, it } from 'vitest'
import {
  addBuyIn,
  addPlayer,
  clearCashOut,
  deleteBuyIn,
  discrepancy,
  editBuyIn,
  type Change,
  type Night,
  emptyNight,
  formatAmount,
  formatSigned,
  isNameInNight,
  isFinished,
  loadNight,
  netResult,
  removePlayer,
  saveNight,
  setCashOut,
  settle,
  stillPlaying,
  summary,
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

describe('fixing Buy-ins', () => {
  it('edits the amount of one Buy-in', () => {
    let night = buyIns(nightWith('Alice'), 0, '50', '50')
    const second = night.players[0].buyIns[1].id
    night = ok(editBuyIn(night, second, '100'))
    expect(night.players[0].buyIns.map((b) => formatAmount(b.amount))).toEqual(['50', '100'])
    expect(formatAmount(totalBuyIns(night))).toBe('150')
  })

  it.each(['0', '-5', '1.234', 'x'])('rejects editing a Buy-in to %j', (amount) => {
    const night = buyIns(nightWith('Alice'), 0, '50')
    expect(editBuyIn(night, night.players[0].buyIns[0].id, amount).ok).toBe(false)
  })

  it('deletes one Buy-in and updates the totals', () => {
    let night = buyIns(nightWith('Alice'), 0, '50', '100')
    night = ok(deleteBuyIn(night, night.players[0].buyIns[0].id))
    expect(night.players[0].buyIns.map((b) => formatAmount(b.amount))).toEqual(['100'])
    expect(formatAmount(totalBuyIns(night))).toBe('100')
  })

  it('rejects editing or deleting a Buy-in that is not in the Night', () => {
    const night = buyIns(nightWith('Alice'), 0, '50')
    expect(editBuyIn(night, 'missing', '10').ok).toBe(false)
    expect(deleteBuyIn(night, 'missing').ok).toBe(false)
  })
})

describe('removing Players', () => {
  it('removes a Player together with their Buy-ins', () => {
    let night = nightWith('Alice', 'Bob')
    night = buyIns(night, 0, '50', '100')
    night = buyIns(night, 1, '50')
    night = ok(removePlayer(night, idOf(night, 0)))
    expect(night.players.map((p) => p.name)).toEqual(['Bob'])
    expect(formatAmount(totalBuyIns(night))).toBe('50')
  })

  it('rejects removing a Player who is not in the Night', () => {
    expect(removePlayer(nightWith('Alice'), 'nobody').ok).toBe(false)
  })
})

describe('duplicate names', () => {
  it('tells whether a name is already in the Night, ignoring case and spaces', () => {
    const night = nightWith('Alice')
    expect(isNameInNight(night, ' alice ')).toBe(true)
    expect(isNameInNight(night, 'Bob')).toBe(false)
  })

  it('still allows adding a second Player with the same name', () => {
    const night = nightWith('Alice', 'Alice')
    expect(night.players.map((p) => p.name)).toEqual(['Alice', 'Alice'])
  })

  it('changes only the Player being changed when two share a name', () => {
    let night = nightWith('Alice', 'Alice')
    night = buyIns(night, 0, '50')
    night = buyIns(night, 1, '100')
    night = ok(editBuyIn(night, night.players[1].buyIns[0].id, '75'))
    expect(formatAmount(totalBuyIn(night, idOf(night, 0)))).toBe('50')
    expect(formatAmount(totalBuyIn(night, idOf(night, 1)))).toBe('75')

    night = ok(removePlayer(night, idOf(night, 0)))
    expect(night.players).toHaveLength(1)
    expect(formatAmount(totalBuyIn(night, idOf(night, 0)))).toBe('75')
  })
})

const cashOut = (night: Night, playerIndex: number, amount: string): Night =>
  ok(setCashOut(night, idOf(night, playerIndex), amount))

describe('Cash-outs', () => {
  it('marks a Player with a Cash-out as finished', () => {
    let night = buyIns(nightWith('Alice', 'Bob'), 0, '100')
    expect(isFinished(night, idOf(night, 0))).toBe(false)
    night = cashOut(night, 0, '150')
    expect(isFinished(night, idOf(night, 0))).toBe(true)
    expect(isFinished(night, idOf(night, 1))).toBe(false)
  })

  it('accepts a Cash-out of 0 for a Player who lost everything', () => {
    const night = cashOut(buyIns(nightWith('Alice'), 0, '100'), 0, '0')
    expect(isFinished(night, idOf(night, 0))).toBe(true)
  })

  it.each(['-1', '1.001', 'lots', ''])('rejects a Cash-out of %j', (amount) => {
    const night = nightWith('Alice')
    expect(setCashOut(night, idOf(night, 0), amount).ok).toBe(false)
  })

  it('edits a Cash-out by setting it again', () => {
    let night = cashOut(buyIns(nightWith('Alice'), 0, '100'), 0, '150')
    night = cashOut(night, 0, '120')
    expect(formatAmount(totalCashOuts(night))).toBe('120')
  })

  it('clears a Cash-out so the Player is playing again', () => {
    let night = cashOut(buyIns(nightWith('Alice'), 0, '100'), 0, '150')
    night = ok(clearCashOut(night, idOf(night, 0)))
    expect(isFinished(night, idOf(night, 0))).toBe(false)
    expect(formatAmount(totalCashOuts(night))).toBe('0')
  })

  it('rejects a Cash-out for a Player who is not in the Night', () => {
    expect(setCashOut(nightWith('Alice'), 'nobody', '10').ok).toBe(false)
    expect(clearCashOut(nightWith('Alice'), 'nobody').ok).toBe(false)
  })

  it('removes a Player together with their Cash-out', () => {
    let night = buyIns(nightWith('Alice', 'Bob'), 0, '100')
    night = cashOut(night, 0, '150')
    night = ok(removePlayer(night, idOf(night, 0)))
    expect(formatAmount(totalCashOuts(night))).toBe('0')
  })
})

describe('Net results', () => {
  it('is Cash-out minus Total buy-in for a finished Player', () => {
    let night = nightWith('Alice', 'Bob', 'Carol')
    night = buyIns(night, 0, '50', '50')
    night = buyIns(night, 1, '100')
    night = buyIns(night, 2, '100')
    night = cashOut(night, 0, '180.5')
    night = cashOut(night, 1, '19.5')
    night = cashOut(night, 2, '100')
    expect(formatAmount(netResult(night, idOf(night, 0))!)).toBe('80.5')
    expect(formatAmount(netResult(night, idOf(night, 1))!)).toBe('-80.5')
    expect(formatAmount(netResult(night, idOf(night, 2))!)).toBe('0')
  })

  it('does not exist for a Player still playing', () => {
    const night = buyIns(nightWith('Alice'), 0, '50')
    expect(netResult(night, idOf(night, 0))).toBeUndefined()
  })
})

describe('the Discrepancy', () => {
  it('is total Cash-outs minus total Buy-ins while some Players are still playing', () => {
    let night = nightWith('Alice', 'Bob')
    night = buyIns(night, 0, '100')
    night = buyIns(night, 1, '50')
    night = cashOut(night, 0, '120')
    expect(formatAmount(totalCashOuts(night))).toBe('120')
    expect(formatAmount(discrepancy(night))).toBe('-30')
  })

  it('is 0 when every Player is finished and the money adds up', () => {
    let night = nightWith('Alice', 'Bob')
    night = buyIns(night, 0, '100')
    night = buyIns(night, 1, '100')
    night = cashOut(night, 0, '150.25')
    night = cashOut(night, 1, '49.75')
    expect(formatAmount(discrepancy(night))).toBe('0')
  })

  it('shows a small rounding Discrepancy exactly', () => {
    let night = nightWith('Alice', 'Bob')
    night = buyIns(night, 0, '0.1')
    night = buyIns(night, 1, '0.2')
    night = cashOut(night, 0, '0.3')
    night = cashOut(night, 1, '0.1')
    expect(formatAmount(discrepancy(night))).toBe('0.1')
  })
})

describe('Players still playing', () => {
  it('lists the Players with no Cash-out yet', () => {
    let night = nightWith('Alice', 'Bob', 'Carol')
    expect(stillPlaying(night).map((p) => p.name)).toEqual(['Alice', 'Bob', 'Carol'])
    night = cashOut(night, 1, '0')
    expect(stillPlaying(night).map((p) => p.name)).toEqual(['Alice', 'Carol'])
  })
})

describe('formatting amounts', () => {
  it.each([
    ['300', '300'],
    ['301.50', '301.5'],
    ['0.05', '0.05'],
    ['1234.56', '1234.56'],
  ])('shows %s as %s', (typed, shown) => {
    const night = buyIns(nightWith('Alice'), 0, typed)
    expect(formatAmount(totalBuyIns(night))).toBe(shown)
  })

  it('shows a sign on Net results', () => {
    let night = nightWith('Alice', 'Bob', 'Carol')
    night = buyIns(night, 0, '100')
    night = buyIns(night, 1, '100')
    night = buyIns(night, 2, '100')
    night = cashOut(night, 0, '150.5')
    night = cashOut(night, 1, '49.5')
    night = cashOut(night, 2, '100')
    expect(formatSigned(netResult(night, idOf(night, 0))!)).toBe('+50.5')
    expect(formatSigned(netResult(night, idOf(night, 1))!)).toBe('-50.5')
    expect(formatSigned(netResult(night, idOf(night, 2))!)).toBe('0')
  })
})

describe('saving and loading', () => {
  const fullNight = () => {
    let night = nightWith('Alice', 'Bob', 'Carol')
    night = buyIns(night, 0, '50', '100')
    night = buyIns(night, 1, '301.5')
    night = cashOut(night, 0, '0')
    night = cashOut(night, 1, '400')
    return night
  }

  it('loads back the same Players, Buy-ins and Cash-outs', () => {
    const night = fullNight()
    const loaded = loadNight(saveNight(night))
    expect(loaded).toEqual(night)
    expect(formatAmount(totalBuyIns(loaded))).toBe('451.5')
    expect(stillPlaying(loaded).map((p) => p.name)).toEqual(['Carol'])
  })

  it('keeps generating new IDs after loading', () => {
    let night = loadNight(saveNight(fullNight()))
    night = ok(addPlayer(night, 'Dave'))
    night = buyIns(night, 3, '50')
    const ids = night.players.flatMap((p) => [p.id, ...p.buyIns.map((b) => b.id)])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each([
    ['nothing saved', null],
    ['an empty string', ''],
    ['text that is not JSON', '{not json'],
    ['JSON that is not a Night', '{"version":1,"night":{"players":"lots"}}'],
    ['a Player with a bad Buy-in', '{"version":1,"night":{"nextId":3,"players":[{"id":"p1","name":"A","buyIns":[{"id":"b2","amount":-5}],"cashOut":null}]}}'],
    ['an unknown version', '{"version":99,"night":{"nextId":1,"players":[]}}'],
    ['JSON null', 'null'],
  ])('starts an empty Night from %s', (_, saved) => {
    expect(loadNight(saved)).toEqual(emptyNight())
  })

  it('starts an empty Night when a saved Night from an unknown version would otherwise load', () => {
    const saved = JSON.parse(saveNight(fullNight()))
    saved.version = 2
    expect(loadNight(JSON.stringify(saved))).toEqual(emptyNight())
  })
})

describe('the summary', () => {
  it('lists every finished Player, the totals, a Discrepancy of 0 and the Settlement', () => {
    let night = nightWith('Alice', 'Bob')
    night = buyIns(night, 0, '50', '50')
    night = buyIns(night, 1, '100')
    night = cashOut(night, 0, '150.5')
    night = cashOut(night, 1, '49.5')
    expect(summary(night)).toBe(
      [
        'Poker Night',
        'Alice: bought in 100, cashed out 150.5, net +50.5',
        'Bob: bought in 100, cashed out 49.5, net -50.5',
        'Total buy-ins: 200',
        'Total cash-outs: 200',
        'Discrepancy: 0',
        '',
        'Settlement:',
        'Bob pays Alice 50.5',
      ].join('\n'),
    )
  })

  it('shows Players still playing and a non-zero Discrepancy', () => {
    let night = nightWith('Alice', 'Bob', 'Carol')
    night = buyIns(night, 0, '100')
    night = buyIns(night, 1, '50')
    night = buyIns(night, 2, '50')
    night = cashOut(night, 0, '120')
    night = cashOut(night, 2, '0')
    expect(summary(night)).toBe(
      [
        'Poker Night',
        'Alice: bought in 100, cashed out 120, net +20',
        'Bob: bought in 50, still playing',
        'Carol: bought in 50, cashed out 0, net -50',
        'Total buy-ins: 200',
        'Total cash-outs: 120',
        'Discrepancy: -80',
      ].join('\n'),
    )
  })
})

/** A Night where every Player bought in 100 and cashed out 100 plus their Net result. */
const finishedNight = (nets: Record<string, number>): Night => {
  let night = nightWith(...Object.keys(nets))
  Object.values(nets).forEach((net, index) => {
    night = buyIns(night, index, '100')
    night = cashOut(night, index, String(100 + net))
  })
  return night
}

const nameOf = (night: Night, id: string) => night.players.find((p) => p.id === id)!.name

const transfersOf = (night: Night) => {
  const settlement = settle(night)
  if (!settlement.available) throw new Error('expected a Settlement')
  return settlement.transfers.map((t) => `${nameOf(night, t.from)} pays ${nameOf(night, t.to)} ${formatAmount(t.amount)}`)
}

describe('Settlement availability', () => {
  it('is not available while Players are still playing, and says who', () => {
    let night = finishedNight({ Alice: 50, Bob: -50 })
    night = buyIns(ok(addPlayer(night, 'Carol')), 2, '50')
    const settlement = settle(night)
    expect(settlement.available).toBe(false)
    if (!settlement.available && settlement.reason.kind === 'still-playing') {
      expect(settlement.reason.players.map((p) => p.name)).toEqual(['Carol'])
    } else {
      throw new Error('expected the still-playing reason')
    }
  })

  it('is not available with a non-zero Discrepancy, and says how much', () => {
    const night = finishedNight({ Alice: 50, Bob: -40 })
    const settlement = settle(night)
    if (!settlement.available && settlement.reason.kind === 'discrepancy') {
      expect(formatSigned(settlement.reason.discrepancy)).toBe('+10')
    } else {
      throw new Error('expected the discrepancy reason')
    }
  })

  it('has one Transfer from the loser to the winner of a two-Player Night', () => {
    expect(transfersOf(finishedNight({ Alice: 50.5, Bob: -50.5 }))).toEqual(['Bob pays Alice 50.5'])
  })
})

/** Checks that the Transfers bring every Player's Net result to exactly 0. */
const expectSquared = (night: Night) => {
  const settlement = settle(night)
  if (!settlement.available) throw new Error('expected a Settlement')
  for (const player of night.players) {
    const paid = settlement.transfers.filter((t) => t.from === player.id).reduce((s, t) => s + t.amount, 0)
    const received = settlement.transfers.filter((t) => t.to === player.id).reduce((s, t) => s + t.amount, 0)
    expect(received - paid).toBe(netResult(night, player.id))
  }
  for (const transfer of settlement.transfers) expect(transfer.amount).toBeGreaterThan(0)
  return settlement.transfers
}

describe('Settlement Transfers', () => {
  it('uses the fewest Transfers when two Players exactly cancel out alongside others', () => {
    // Greedy would pay Carol's 4 to Alice first and need 4 Transfers; the minimum is 3.
    const night = finishedNight({ Alice: 5, Bob: 4, Carol: -4, Dave: -3, Erin: -2 })
    expect(expectSquared(night)).toHaveLength(3)
    expect(transfersOf(night)).toContain('Carol pays Bob 4')
  })

  it('finds the most groups that cancel out', () => {
    // Three pairs that each cancel out: one Transfer per pair.
    const night = finishedNight({ A: 7, B: -6, C: 6, D: -1, E: 1, F: -7 })
    expect(expectSquared(night)).toHaveLength(3)
  })

  it('leaves Players with a Net result of 0 out of every Transfer', () => {
    const night = finishedNight({ Alice: 30, Bob: 0, Carol: -30 })
    const bob = idOf(night, 1)
    expect(expectSquared(night).some((t) => t.from === bob || t.to === bob)).toBe(false)
    expect(transfersOf(night)).toEqual(['Carol pays Alice 30'])
  })

  it('has no Transfers when nobody won or lost', () => {
    expect(transfersOf(finishedNight({ Alice: 0, Bob: 0 }))).toEqual([])
  })

  it('squares decimal Net results exactly', () => {
    const night = finishedNight({ Alice: 10.1, Bob: 20.2, Carol: -30.3 })
    expect(expectSquared(night)).toHaveLength(2)
  })

  it('gives the same Transfers every time for the same Night', () => {
    const night = finishedNight({ A: 12, B: 8, C: -5, D: -5, E: -10 })
    expect(transfersOf(loadNight(saveNight(night)))).toEqual(transfersOf(night))
    expect(transfersOf(night)).toEqual(transfersOf(night))
  })

  it('uses the greedy method above 10 Players', () => {
    // The Night that needs 3 Transfers at 5 Players, plus 6 Players at 0: greedy now uses 4.
    const night = finishedNight({ Alice: 5, Bob: 4, Carol: -4, Dave: -3, Erin: -2, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0 })
    expect(expectSquared(night)).toHaveLength(4)
  })

  it('still squares everyone with the greedy method above 10 Players', () => {
    const nets = [25, -10, 17, -3, -8, 40, -21, 6, -30, 12, -19, -9]
    const night = finishedNight(Object.fromEntries(nets.map((net, i) => [`P${i + 1}`, net])))
    expect(expectSquared(night).length).toBeLessThanOrEqual(nets.length - 1)
  })
})

describe('the summary with a Settlement', () => {
  it('adds the Transfers once the Settlement is available', () => {
    const night = finishedNight({ Alice: 30, Bob: -10, Carol: -20 })
    expect(summary(night)).toBe(
      [
        'Poker Night',
        'Alice: bought in 100, cashed out 130, net +30',
        'Bob: bought in 100, cashed out 90, net -10',
        'Carol: bought in 100, cashed out 80, net -20',
        'Total buy-ins: 300',
        'Total cash-outs: 300',
        'Discrepancy: 0',
        '',
        'Settlement:',
        'Carol pays Alice 20',
        'Bob pays Alice 10',
      ].join('\n'),
    )
  })

  it('says nobody pays anyone when every Net result is 0', () => {
    expect(summary(finishedNight({ Alice: 0 }))).toMatch(/\n\nSettlement:\nNobody owes anything\.$/)
  })

  it('leaves the Settlement out while it is not available', () => {
    expect(summary(finishedNight({ Alice: 30, Bob: -20 }))).not.toContain('Settlement')
  })
})
