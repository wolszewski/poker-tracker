// Polish wording. Glossary terms follow ticket 11: Wieczór, Gracz, Wpisowe, Wypłata, Wynik, Rozbieżność, Rozliczenie, Przelew.

import type { Dictionary } from './en'

export const pl: Dictionary = {
  title: 'Wieczór pokerowy',
  language: 'Język',
  noPlayers: 'Nie ma jeszcze graczy.',
  newNight: 'Nowy wieczór',
  confirmNewNight: 'Zacząć nowy wieczór? Wszyscy gracze, wpisowe i wypłaty zostaną usunięte.',

  playerName: 'Imię gracza',
  addPlayer: 'Dodaj gracza',
  alreadyInNight: (name) => `${name} jest już w tym wieczorze. Mimo to możesz dodać tę osobę jeszcze raz.`,

  amount: 'Kwota',
  add: 'Dodaj',
  save: 'Zapisz',
  delete: 'Usuń',
  cancel: 'Anuluj',

  player: 'Gracz',
  playing: 'W grze',
  finished: 'Po grze',
  remove: 'Usuń',
  confirmRemove: (name) => `Usunąć gracza ${name} razem z całym wpisowym i wypłatą?`,
  actions: 'Akcje',

  buyIns: 'Wpisowe',
  noBuyIns: 'Jeszcze brak.',
  totalBuyIn: 'Suma wpisowego',
  otherBuyIn: 'Inne…',
  addBuyInFor: (name) => `Dodaj wpisowe: ${name}`,
  changeBuyIn: (amount) => `Zmień wpisowe ${amount}`,
  buyInAmount: 'Kwota wpisowego',

  cashOut: 'Wypłata',
  cashOutButton: 'Wpisz wypłatę',
  changeCashOut: 'Zmień wypłatę',
  cashOutFor: (name) => `Wypłata: ${name}`,
  backToPlaying: 'Wróć do gry',
  netResult: 'Wynik',

  totals: 'Sumy',
  cashOuts: 'Wypłaty',
  discrepancy: 'Rozbieżność',
  stillPlaying: 'W grze',

  settlement: 'Rozliczenie',
  settlementNeedsZero: (discrepancy) =>
    `Dostępne, gdy rozbieżność wynosi 0. Teraz wynosi ${discrepancy}, więc najpierw popraw wypłaty lub wpisowe.`,

  copySummary: 'Kopiuj podsumowanie',
  copied: 'Skopiowano!',
  copyFailed: 'Nie udało się skopiować automatycznie. Zaznacz tekst poniżej i skopiuj go.',

  errors: {
    'name-required': 'Wpisz imię.',
    'amount-format': 'Wpisz kwotę, np. 50 albo 301.5, z najwyżej 2 miejscami po przecinku.',
    'amount-too-large': 'Ta kwota jest za duża.',
    'buy-in-zero': 'Wpisowe musi być większe od 0.',
    'player-missing': 'Tego gracza nie ma w tym wieczorze.',
    'buy-in-missing': 'Tego wpisowego nie ma w tym wieczorze.',
  },

  summary: {
    title: 'Wieczór pokerowy',
    stillPlaying: (name, boughtIn) => `${name}: wpisowe ${boughtIn}, nadal gra`,
    finished: (name, boughtIn, cashOut, net) => `${name}: wpisowe ${boughtIn}, wypłata ${cashOut}, wynik ${net}`,
    totalBuyIns: (amount) => `Suma wpisowego: ${amount}`,
    totalCashOuts: (amount) => `Suma wypłat: ${amount}`,
    discrepancy: (amount) => `Rozbieżność: ${amount}`,
    settlement: 'Rozliczenie:',
    nobodyOwes: 'Nikt nikomu nic nie jest winien.',
    // An arrow, because Polish would decline the payee's name (płaci Alicji), which the app can't do.
    transfer: (from, to, amount) => `${from} → ${to}: ${amount}`,
  },
}
