# 03: Players and Buy-ins

**What to build:** The Host can add Players by name and record Buy-ins for each one. Each Player has a quick-add 50 (the default), a quick-add 100, and a way to enter any other amount. Each Player card shows the list of Buy-ins and the Total buy-in, and the totals bar shows total Buy-ins for the Night. Amounts are exact and allow up to 2 decimal places; they're stored as whole hundredths, with no currency. Display drops trailing zeros, so 301.50 shows as `301.5`. All rules live in the Night module and are built test-first. The React components only display what the module returns. See the spec's Money and Identity decisions.

**Blocked by:** 01: Walking skeleton

**Status:** ready-for-agent

- [ ] The Host can add a Player; an empty name is rejected.
- [ ] Players can be added at any point in the Night.
- [ ] A Buy-in can be recorded with one tap for 50 or 100, or for a custom amount.
- [ ] A Player can have any number of Buy-ins, and they're listed on the Player's card.
- [ ] The Total buy-in per Player and total Buy-ins for the Night are correct, including decimals (0.1 + 0.2 comes out as exactly 0.3).
- [ ] Buy-in amounts that are 0, negative, have more than 2 decimal places or aren't numbers are rejected with a visible message.
- [ ] Players and Buy-ins have generated IDs.
- [ ] Night module tests cover every rule above.
