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
