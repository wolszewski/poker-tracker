# 12: Hide the totals bar while Players are still playing

**What to build:** The totals bar (Buy-ins, Cash-outs, Discrepancy, Still playing) clutters the page during the Night, and its numbers only mean something once everyone has cashed out. Hide it until every Player has a Cash-out, the same way the Settlement panel is hidden (08). With no Players, it stays hidden too.

- Once shown, "Still playing" would always be 0, so drop that cell. The bar shows Buy-ins, Cash-outs and the Discrepancy in one row of three, at phone width as well.
- Clearing a Cash-out (Back to playing) hides the bar again.
- The Discrepancy is still highlighted when it's not 0. This replaces 05's "the Discrepancy is visible at all times" and "the count of Players still playing is shown"; each Player's status still shows who is playing.
- The bar is no longer sticky at the bottom of the screen. It only shows once the Night is over, and pinned there it would cover the Settlement panel.
- Copy summary is unchanged.

**Blocked by:** 05: Cash-outs, Net results and Discrepancy

**Status:** done

- [x] With no Players, or any Player still playing, the totals bar isn't shown.
- [x] Once every Player has a Cash-out, the bar shows Buy-ins, Cash-outs and the Discrepancy, highlighted when not 0.
- [x] Back to playing on any Player hides the bar again.
- [x] The "Still playing" cell and its dictionary key are gone, in both languages.
- [x] The three cells fit on one row at phone width (390px) without scrolling sideways.

## Comments

- `TotalsBar` returns `null` while `stillPlaying(night)` isn't empty, like `SettlementPanel`. The grid is now 3 columns at every width (the 2-column phone rule is gone), and `position: sticky` is removed. The `stillPlaying` summary line in the Night module's `SummaryWords` is separate and untouched.
- Checked by hand in headless Firefox (puppeteer script), in Polish at 390 × 844 (cards) and 1280 × 800 (grid): with no Players, with Players playing, and with one Player left, there's no bar. With everyone cashed out it shows Wpisowe 200, Wypłaty 190, Rozbieżność −10 (highlighted) on one row, below the Settlement panel with nothing overlapping, and the page doesn't scroll sideways. Back to playing hides it again.
