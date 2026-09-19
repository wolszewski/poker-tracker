# 05: Cash-outs, Net results and Discrepancy

**What to build:** The Host can record a Player's Cash-out whenever they leave, and edit or clear it later. Clearing it puts the Player back to still playing. A Player with a Cash-out is marked as finished and shows their Net result (Cash-out − Total buy-in), with winners and losers clearly told apart. The totals bar shows total Buy-ins, total Cash-outs, the Discrepancy (total Cash-outs − total Buy-ins), and how many Players are still playing. The Discrepancy is highlighted when it's not 0, but it never blocks anything.

**Blocked by:** 03: Players and Buy-ins

**Status:** ready-for-agent

- [ ] A Cash-out can be set, edited and cleared; 0 is allowed, while negative amounts, more than 2 decimal places and non-numbers are rejected.
- [ ] Finished Players are clearly marked and show their Net result with a sign.
- [ ] Total Cash-outs and the Discrepancy are correct at any point, including when some Players are still playing and when decimals are involved.
- [ ] The Discrepancy is visible at all times and highlighted when not 0.
- [ ] The count of Players still playing is shown.
- [ ] Night module tests cover Cash-outs, Net results, the Discrepancy and the count of Players still playing.
