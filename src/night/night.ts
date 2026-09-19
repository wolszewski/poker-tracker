// The Night module: every rule about a poker Night lives here.
// A Night is an immutable value. It has no React, browser or storage dependencies.

/** An amount of money, held as whole hundredths so that sums are exact. */
export type Amount = number & { readonly __brand: 'Amount' }

const cents = (value: number) => value as Amount

export type BuyIn = {
  readonly id: string
  readonly amount: Amount
}

export type Player = {
  readonly id: string
  readonly name: string
  readonly buyIns: readonly BuyIn[]
  /** Set once the Player has left and handed back their chips. */
  readonly cashOut: Amount | null
}

export type Night = {
  readonly players: readonly Player[]
  readonly nextId: number
}

/** The result of a change: the new Night, or why the change was rejected. */
export type Change = { ok: true; night: Night } | { ok: false; error: string }

const changed = (night: Night): Change => ({ ok: true, night })

export const emptyNight = (): Night => ({ players: [], nextId: 1 })

const rejected = (error: string): Change => ({ ok: false, error })

export const addPlayer = (night: Night, name: string): Change => {
  const trimmed = name.trim()
  if (trimmed === '') return rejected('Enter a name.')
  return changed({
    players: [...night.players, { id: `p${night.nextId}`, name: trimmed, buyIns: [], cashOut: null }],
    nextId: night.nextId + 1,
  })
}

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** Whether a Player with this name is already in the Night. Duplicates are allowed, but worth a warning. */
export const isNameInNight = (night: Night, name: string): boolean =>
  night.players.some((player) => sameName(player.name, name))

/** Removes a Player together with their Buy-ins and Cash-out. */
export const removePlayer = (night: Night, playerId: string): Change => {
  if (!findPlayer(night, playerId)) return rejected('That Player is not in the Night.')
  return changed({ ...night, players: night.players.filter((player) => player.id !== playerId) })
}

type Parsed = { ok: true; amount: Amount } | { ok: false; error: string }

/** Reads an amount typed by the Host: 0 or more, with up to 2 decimal places. */
const parseAmount = (text: string): Parsed => {
  const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(text.trim())
  if (!match) return { ok: false, error: 'Enter an amount like 50 or 301.5, with up to 2 decimal places.' }
  const [, whole, fraction = ''] = match
  const value = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  if (!Number.isSafeInteger(value)) return { ok: false, error: 'That amount is too large.' }
  return { ok: true, amount: cents(value) }
}

const parseBuyIn = (text: string): Parsed => {
  const parsed = parseAmount(text)
  if (parsed.ok && parsed.amount === 0) return { ok: false, error: 'A Buy-in must be more than 0.' }
  return parsed
}

const sum = (amounts: readonly Amount[]): Amount =>
  cents(amounts.reduce((total, amount) => total + amount, 0))

const findPlayer = (night: Night, playerId: string): Player | undefined =>
  night.players.find((player) => player.id === playerId)

const updatePlayer = (night: Night, playerId: string, update: (player: Player) => Player) =>
  night.players.map((player) => (player.id === playerId ? update(player) : player))

export const addBuyIn = (night: Night, playerId: string, amountText: string): Change => {
  if (!findPlayer(night, playerId)) return rejected('That Player is not in the Night.')
  const parsed = parseBuyIn(amountText)
  if (!parsed.ok) return rejected(parsed.error)
  return changed({
    players: updatePlayer(night, playerId, (player) => ({
      ...player,
      buyIns: [...player.buyIns, { id: `b${night.nextId}`, amount: parsed.amount }],
    })),
    nextId: night.nextId + 1,
  })
}

const hasBuyIn = (night: Night, buyInId: string) =>
  night.players.some((player) => player.buyIns.some((buyIn) => buyIn.id === buyInId))

const updateBuyIns = (night: Night, update: (buyIns: readonly BuyIn[]) => readonly BuyIn[]): Night => ({
  ...night,
  players: night.players.map((player) => ({ ...player, buyIns: update(player.buyIns) })),
})

export const editBuyIn = (night: Night, buyInId: string, amountText: string): Change => {
  if (!hasBuyIn(night, buyInId)) return rejected('That Buy-in is not in the Night.')
  const parsed = parseBuyIn(amountText)
  if (!parsed.ok) return rejected(parsed.error)
  return changed(
    updateBuyIns(night, (buyIns) =>
      buyIns.map((buyIn) => (buyIn.id === buyInId ? { ...buyIn, amount: parsed.amount } : buyIn)),
    ),
  )
}

export const deleteBuyIn = (night: Night, buyInId: string): Change => {
  if (!hasBuyIn(night, buyInId)) return rejected('That Buy-in is not in the Night.')
  return changed(updateBuyIns(night, (buyIns) => buyIns.filter((buyIn) => buyIn.id !== buyInId)))
}

export const setCashOut = (night: Night, playerId: string, amountText: string): Change => {
  if (!findPlayer(night, playerId)) return rejected('That Player is not in the Night.')
  const parsed = parseAmount(amountText)
  if (!parsed.ok) return rejected(parsed.error)
  return changed({
    ...night,
    players: updatePlayer(night, playerId, (player) => ({ ...player, cashOut: parsed.amount })),
  })
}

/** Clears a Player's Cash-out, putting them back to still playing. */
export const clearCashOut = (night: Night, playerId: string): Change => {
  if (!findPlayer(night, playerId)) return rejected('That Player is not in the Night.')
  return changed({
    ...night,
    players: updatePlayer(night, playerId, (player) => ({ ...player, cashOut: null })),
  })
}

export const isFinished = (night: Night, playerId: string): boolean =>
  findPlayer(night, playerId)?.cashOut != null

/** Cash-out minus Total buy-in; undefined while the Player is still playing. */
export const netResult = (night: Night, playerId: string): Amount | undefined => {
  const cashOut = findPlayer(night, playerId)?.cashOut
  if (cashOut == null) return undefined
  return cents(cashOut - totalBuyIn(night, playerId))
}

export const totalBuyIn = (night: Night, playerId: string): Amount =>
  sum(findPlayer(night, playerId)?.buyIns.map((buyIn) => buyIn.amount) ?? [])

export const totalBuyIns = (night: Night): Amount =>
  sum(night.players.map((player) => totalBuyIn(night, player.id)))

/** The sum of the Cash-outs recorded so far. */
export const totalCashOuts = (night: Night): Amount =>
  sum(night.players.flatMap((player) => (player.cashOut == null ? [] : [player.cashOut])))

export const discrepancy = (night: Night): Amount =>
  cents(totalCashOuts(night) - totalBuyIns(night))

/** Players who have no Cash-out yet. */
export const stillPlaying = (night: Night): readonly Player[] =>
  night.players.filter((player) => player.cashOut == null)

/** Shows an amount as a plain number with no currency, dropping trailing zeros: 300, 301.5, 0.05. */
export const formatAmount = (amount: Amount): string => {
  const sign = amount < 0 ? '-' : ''
  const whole = Math.floor(Math.abs(amount) / 100)
  const fraction = String(Math.abs(amount) % 100).padStart(2, '0').replace(/0+$/, '')
  return `${sign}${whole}${fraction ? `.${fraction}` : ''}`
}

/** Like formatAmount, with a + on positive amounts, as used for Net results. */
export const formatSigned = (amount: Amount): string =>
  amount > 0 ? `+${formatAmount(amount)}` : formatAmount(amount)

// Settlement: who pays whom, once every Player is finished and the Discrepancy is 0.

/** One payment from a losing Player to a winning Player. */
export type Transfer = { readonly from: string; readonly to: string; readonly amount: Amount }

export type Settlement =
  | { available: true; transfers: readonly Transfer[] }
  | {
      available: false
      reason:
        | { kind: 'still-playing'; players: readonly Player[] }
        | { kind: 'discrepancy'; discrepancy: Amount }
    }

type Balance = { id: string; net: number }

/** Biggest loser pays biggest winner, repeated. Ties go to the Player added first. */
const greedyTransfers = (balances: readonly Balance[]): Transfer[] => {
  const open = balances.map((balance) => ({ ...balance }))
  const transfers: Transfer[] = []
  const biggest = (sign: 1 | -1) =>
    open.reduce<Balance | undefined>(
      (best, balance) => (balance.net * sign > 0 && (!best || balance.net * sign > best.net * sign) ? balance : best),
      undefined,
    )
  for (;;) {
    const loser = biggest(-1)
    const winner = biggest(1)
    if (!loser || !winner) return transfers
    const amount = Math.min(-loser.net, winner.net)
    transfers.push({ from: loser.id, to: winner.id, amount: cents(amount) })
    loser.net += amount
    winner.net -= amount
  }
}

/**
 * Splits the balances into the largest number of groups that each sum to 0.
 * A group of k Players can then be squared with k − 1 Transfers, which is the minimum overall.
 * Exhaustive over subsets, so only for small Nights.
 */
const zeroSumGroups = (balances: readonly Balance[]): Balance[][] => {
  const n = balances.length
  const full = (1 << n) - 1
  const sums = new Array<number>(full + 1).fill(0)
  // most[mask]: the most zero-sum groups the Players in mask can be split into, when mask sums to 0.
  const most = new Array<number>(full + 1).fill(0)
  for (let mask = 1; mask <= full; mask++) {
    const lowest = 31 - Math.clz32(mask & -mask)
    sums[mask] = sums[mask & (mask - 1)] + balances[lowest].net
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) most[mask] = Math.max(most[mask], most[mask ^ (1 << i)])
    }
    if (sums[mask] === 0) most[mask] += 1
  }
  // Walk back from everyone, peeling off Players in an order where each group's members are adjacent.
  const order: Balance[] = []
  let mask = full
  while (mask) {
    const bonus = sums[mask] === 0 ? 1 : 0
    let i = 0
    while (!(mask & (1 << i)) || most[mask ^ (1 << i)] + bonus !== most[mask]) i++
    order.push(balances[i])
    mask ^= 1 << i
  }
  order.reverse()
  const groups: Balance[][] = []
  let group: Balance[] = []
  let running = 0
  for (const balance of order) {
    group.push(balance)
    running += balance.net
    if (running === 0) {
      groups.push(group)
      group = []
    }
  }
  return groups
}

/** Largest Night for which the fewest Transfers are found exactly; above it, greedy is used. */
const EXACT_SETTLEMENT_LIMIT = 10

export const settle = (night: Night): Settlement => {
  const playing = stillPlaying(night)
  if (playing.length > 0) return { available: false, reason: { kind: 'still-playing', players: playing } }
  const gap = discrepancy(night)
  if (gap !== 0) return { available: false, reason: { kind: 'discrepancy', discrepancy: gap } }
  const balances = night.players
    .map((player) => ({ id: player.id, net: netResult(night, player.id) ?? 0 }))
    .filter((balance) => balance.net !== 0)
  if (night.players.length > EXACT_SETTLEMENT_LIMIT) {
    return { available: true, transfers: greedyTransfers(balances) }
  }
  // Keep each group in the order the Players were added, so the output reads naturally.
  const position = (balance: Balance) => balances.indexOf(balance)
  const groups = zeroSumGroups(balances)
    .map((group) => [...group].sort((a, b) => position(a) - position(b)))
    .sort((a, b) => position(a[0]) - position(b[0]))
  return { available: true, transfers: groups.flatMap(greedyTransfers) }
}

const summaryLine = (night: Night, player: Player): string => {
  const boughtIn = `${player.name}: bought in ${formatAmount(totalBuyIn(night, player.id))}`
  const net = netResult(night, player.id)
  if (player.cashOut == null || net === undefined) return `${boughtIn}, still playing`
  return `${boughtIn}, cashed out ${formatAmount(player.cashOut)}, net ${formatSigned(net)}`
}

/** Describes a Transfer for people, for example "Bob pays Alice 20". */
export const describeTransfer = (night: Night, transfer: Transfer): string =>
  `${findPlayer(night, transfer.from)?.name} pays ${findPlayer(night, transfer.to)?.name} ${formatAmount(transfer.amount)}`

const settlementLines = (night: Night): string[] => {
  const settlement = settle(night)
  if (night.players.length === 0 || !settlement.available) return []
  const transfers = settlement.transfers.map((transfer) => describeTransfer(night, transfer))
  return ['', 'Settlement:', ...(transfers.length > 0 ? transfers : ['Nobody owes anything.'])]
}

/** The plain-text summary of the Night that the Host pastes into the group chat. */
export const summary = (night: Night): string =>
  [
    'Poker Night',
    ...night.players.map((player) => summaryLine(night, player)),
    `Total buy-ins: ${formatAmount(totalBuyIns(night))}`,
    `Total cash-outs: ${formatAmount(totalCashOuts(night))}`,
    `Discrepancy: ${formatSigned(discrepancy(night))}`,
    ...settlementLines(night),
  ].join('\n')

// Saving: a Night as a string, with a format version so the format can change later.

const SAVE_VERSION = 1

export const saveNight = (night: Night): string => JSON.stringify({ version: SAVE_VERSION, night })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isCents = (value: unknown, minimum: number): value is Amount =>
  Number.isSafeInteger(value) && (value as number) >= minimum

const isBuyIn = (value: unknown): value is BuyIn =>
  isRecord(value) && typeof value.id === 'string' && isCents(value.amount, 1)

const isPlayer = (value: unknown): value is Player =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  value.name.trim() !== '' &&
  Array.isArray(value.buyIns) &&
  value.buyIns.every(isBuyIn) &&
  (value.cashOut === null || isCents(value.cashOut, 0))

const isNight = (value: unknown): value is Night =>
  isRecord(value) &&
  Number.isSafeInteger(value.nextId) &&
  Array.isArray(value.players) &&
  value.players.every(isPlayer)

/** Reads a saved Night back. Missing, corrupt or unknown-version data gives an empty Night. */
export const loadNight = (saved: string | null): Night => {
  if (!saved) return emptyNight()
  let parsed: unknown
  try {
    parsed = JSON.parse(saved)
  } catch {
    return emptyNight()
  }
  if (!isRecord(parsed) || parsed.version !== SAVE_VERSION || !isNight(parsed.night)) return emptyNight()
  const { players, nextId } = parsed.night
  return {
    players: players.map(({ id, name, buyIns, cashOut }) => ({
      id,
      name,
      buyIns: buyIns.map(({ id, amount }) => ({ id, amount })),
      cashOut,
    })),
    nextId,
  }
}
