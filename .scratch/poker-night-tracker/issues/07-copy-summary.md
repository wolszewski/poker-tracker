# 07: Copy summary

**What to build:** A **Copy summary** button puts a plain-text summary of the Night on the clipboard, ready to paste into the group chat. It has a title line, then one line per Player (name, Total buy-in, Cash-out or "still playing", and Net result with a sign), then total Buy-ins, total Cash-outs and the Discrepancy. The text is produced by the Night module, and the button only copies it and confirms that it was copied.

**Blocked by:** 05: Cash-outs, Net results and Discrepancy

**Status:** done

- [x] Copy summary puts the summary text on the clipboard and shows a short confirmation.
- [x] The summary includes every Player, their Total buy-in, Cash-out (or "still playing") and signed Net result, plus the totals and the Discrepancy.
- [x] Amounts in the summary use the same format as the screen, with no currency.
- [x] Night module tests check the summary text for a typical Night, including one with a Player still playing and one with a non-zero Discrepancy.
