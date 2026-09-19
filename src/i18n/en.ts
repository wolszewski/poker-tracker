// English wording for everything the app shows. pl.ts must have the same keys.

import type { Rejection, SummaryWords } from '../night/night'

const summary: SummaryWords = {
  title: 'Poker Night',
  stillPlaying: (name, boughtIn) => `${name}: bought in ${boughtIn}, still playing`,
  finished: (name, boughtIn, cashOut, net) => `${name}: bought in ${boughtIn}, cashed out ${cashOut}, net ${net}`,
  totalBuyIns: (amount) => `Total buy-ins: ${amount}`,
  totalCashOuts: (amount) => `Total cash-outs: ${amount}`,
  discrepancy: (amount) => `Discrepancy: ${amount}`,
  settlement: 'Settlement:',
  nobodyOwes: 'Nobody owes anything.',
  transfer: (from, to, amount) => `${from} pays ${to} ${amount}`,
}

const errors: Record<Rejection, string> = {
  'name-required': 'Enter a name.',
  'amount-format': 'Enter an amount like 50 or 301.5, with up to 2 decimal places.',
  'amount-too-large': 'That amount is too large.',
  'buy-in-zero': 'A Buy-in must be more than 0.',
  'player-missing': 'That Player is not in the Night.',
  'buy-in-missing': 'That Buy-in is not in the Night.',
}

export const en = {
  title: 'Poker Night',
  language: 'Language',
  noPlayers: 'No Players yet.',
  newNight: 'New Night',
  confirmNewNight: 'Start a New Night? This clears every Player, Buy-in and Cash-out.',

  playerName: 'Player name',
  addPlayer: 'Add Player',
  alreadyInNight: (name: string) => `${name} is already in the Night. You can still add them again.`,

  amount: 'Amount',
  add: 'Add',
  save: 'Save',
  delete: 'Delete',
  cancel: 'Cancel',

  player: 'Player',
  playing: 'Playing',
  finished: 'Finished',
  remove: 'Remove',
  confirmRemove: (name: string) => `Remove ${name} and all their Buy-ins and Cash-out?`,
  actions: 'Actions',

  buyIns: 'Buy-ins',
  noBuyIns: 'None yet.',
  totalBuyIn: 'Total buy-in',
  otherBuyIn: 'Other…',
  addBuyInFor: (name: string) => `Add Buy-in for ${name}`,
  changeBuyIn: (amount: string) => `Change Buy-in of ${amount}`,
  buyInAmount: 'Buy-in amount',

  cashOut: 'Cash-out',
  cashOutButton: 'Cash out',
  changeCashOut: 'Change Cash-out',
  cashOutFor: (name: string) => `Cash-out for ${name}`,
  backToPlaying: 'Back to playing',
  netResult: 'Net result',

  totals: 'Totals',
  cashOuts: 'Cash-outs',
  discrepancy: 'Discrepancy',
  stillPlaying: 'Still playing',

  settlement: 'Settlement',
  settlementNeedsZero: (discrepancy: string) =>
    `Available once the Discrepancy is 0. It's ${discrepancy}, so fix the Cash-outs or Buy-ins first.`,

  copySummary: 'Copy summary',
  copied: 'Copied!',
  copyFailed: "Couldn't copy automatically. Select the text below and copy it.",

  errors,
  summary,
}

export type Dictionary = typeof en
