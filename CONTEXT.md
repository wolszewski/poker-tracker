# Poker Tracker

Records the money side of a home cash-game poker night: what each player bought in for, what they left with, and who owes whom.

## Language

**Night**:
One cash-game evening, from the first buy-in to settling up. The app tracks a single Night at a time.
_Avoid_: Session, game, event

**Host**:
The one person who enters everything into the app during a Night, usually whoever is hosting and holding the money.
_Avoid_: Banker, admin, dealer

**Player**:
Someone taking part in a Night, identified by name.
_Avoid_: User, participant

**Buy-in**:
One purchase of chips by a Player for a given amount. A Player can have any number of Buy-ins in a Night, whether first buy-ins, rebuys or top-ups; they aren't told apart.
_Avoid_: Rebuy, top-up, add-on (as separate concepts)

**Total buy-in**:
The sum of all of a Player's Buy-ins in a Night.

**Cash-out**:
The value of the chips a Player hands back at the end of their Night.
_Avoid_: Final chips, final stack, chip count

**Net result**:
A Player's Cash-out minus their Total buy-in. Positive means they won, negative means they lost.
_Avoid_: Profit, balance, win/loss

**Discrepancy**:
The sum of all Cash-outs minus the sum of all Buy-ins in a Night. Usually small and non-zero, because Players round their Cash-outs.
_Avoid_: Difference, mismatch, error

**Settlement**:
The set of Transfers that squares everyone's Net results after the Night.

**Transfer**:
One payment from a losing Player to a winning Player, as part of a Settlement.
_Avoid_: Payout, debt
