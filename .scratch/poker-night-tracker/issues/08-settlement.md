# 08: Settlement (bonus)

**What to build:** A Settlement panel shows who pays whom, using the fewest possible Transfers. It's only available when every Player has a Cash-out and the Discrepancy is exactly 0. Otherwise the panel explains why (which Players are still playing, or the Discrepancy amount). Players with a Net result of 0 take no part. Up to 10 Players, the minimum is found exactly: split the Players into the largest number of groups whose Net results sum to 0, and a group of k Players needs k − 1 Transfers. Above 10 Players, it falls back to the greedy method (biggest loser pays biggest winner, repeat). Output is the same every time for the same Night. The Settlement's Transfers are added to the Copy summary. This is the bonus feature; build it only after the rest of the app works.

**Blocked by:** 05: Cash-outs, Net results and Discrepancy; 07: Copy summary

**Status:** ready-for-agent

- [ ] With every Player finished and the Discrepancy at 0, the panel lists Transfers (from Player, to Player, amount) that bring every Net result to 0.
- [ ] The number of Transfers is the minimum, including cases where greedy would use more (for example, two Players whose Net results exactly cancel each other out, alongside others).
- [ ] With Players still playing, or a non-zero Discrepancy, no Transfers are shown, and the reason is.
- [ ] Players with a Net result of 0 don't appear in any Transfer.
- [ ] Above 10 Players, the greedy fallback is used and is still correct.
- [ ] Results are the same for the same Night.
- [ ] Copy summary includes the Transfers when a Settlement is available.
- [ ] Night module tests cover all of the above.
