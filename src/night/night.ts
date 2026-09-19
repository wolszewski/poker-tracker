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
    players: [...night.players, { id: `p${night.nextId}`, name: trimmed, buyIns: [] }],
    nextId: night.nextId + 1,
  })
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

export const totalBuyIn = (night: Night, playerId: string): Amount =>
  sum(findPlayer(night, playerId)?.buyIns.map((buyIn) => buyIn.amount) ?? [])

export const totalBuyIns = (night: Night): Amount =>
  sum(night.players.map((player) => totalBuyIn(night, player.id)))

export const totalCashOuts = (_night: Night): Amount => cents(0)

export const discrepancy = (night: Night): Amount =>
  cents(totalCashOuts(night) - totalBuyIns(night))

export const formatAmount = (amount: Amount): string => String(amount / 100)
