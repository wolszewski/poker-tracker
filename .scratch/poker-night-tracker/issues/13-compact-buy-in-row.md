# 13: Compact Buy-in row on phone cards

**What to build:** On the phone cards, the Buy-in section takes more space than it needs. The "Buy-ins" label above the pills adds a line, and the Total buy-in sits on another line below them. Drop the label, and show the total on the same row as the pills, at the right, as "Total: <amount>" ("Suma: <amount>" in Polish).

- The pills wrap onto more lines as needed, and the total stays at the right of the row.
- With no Buy-ins yet, "None yet." takes the pills' place, with "Total: 0" at the right.
- The pills list keeps "Buy-ins" as its accessible name, so screen readers still announce it.
- The laptop grid is unchanged. Its "Total buy-in" column header stays.

**Blocked by:** 10: Enter amounts in a small dialog

**Status:** done

- [x] Phone cards show no "Buy-ins" label above the pills.
- [x] The total shows as "Total: <amount>" (or "Suma: <amount>") on the same row as the pills.
- [x] With many Buy-ins, the pills wrap and the total stays on the right. With none, the hint and "Total: 0" share the row.
- [x] Editing a Buy-in still works inside the row.
- [x] The page doesn't scroll sideways at 390px, in either language.
- [x] The laptop grid is unchanged.

## Comments

- The row is `.buy-in-row` (flex): the pills list or the hint takes the free space, and `.total` doesn't wrap. The list has `aria-label={t.buyIns}` in place of the removed label. The new dictionary key `total` is "Total" / "Suma". `totalBuyIn` is still used by the grid header.
- Checked by hand in headless Firefox (puppeteer script) at 390 × 844, in English and Polish, with 3 Players on 1, 9 and 0 Buy-ins, and with a Buy-in's inline editor open. The editor wraps in the space to the left of the total. It's a bit tight, but it works.
