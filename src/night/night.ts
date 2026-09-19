// The Night module: every rule about a poker Night lives here.
// A Night is an immutable value. It has no React, browser or storage dependencies.

/** An amount of money, held as whole hundredths so that sums are exact. */
export type Amount = number & { readonly __brand: 'Amount' }

const cents = (value: number) => value as Amount

export type Player = {
  readonly id: string
  readonly name: string
}

export type Night = {
  readonly players: readonly Player[]
}

export const emptyNight = (): Night => ({ players: [] })

export const totalBuyIns = (_night: Night): Amount => cents(0)

export const totalCashOuts = (_night: Night): Amount => cents(0)

export const discrepancy = (night: Night): Amount =>
  cents(totalCashOuts(night) - totalBuyIns(night))

export const formatAmount = (amount: Amount): string => String(amount / 100)
