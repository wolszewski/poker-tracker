# 14: Two columns of cards on landscape phones

**What to build:** A phone turned sideways still shows the Player cards one per row. For example, a Galaxy A56 in landscape is about 890 CSS px wide, below the 69rem (1104px) grid breakpoint, so each card stretches across the whole width and the Host scrolls a lot. The grid isn't a good fit there, because a landscape phone is only about 350px tall. From 50rem (800px) up to the grid breakpoint, show the cards two per row instead, and widen the page to use the space.

- Below 50rem, one column of cards as today. At 50rem and above, two columns. At 69rem and above, the laptop grid as today.
- Each card is only as tall as its content (no stretching to match its neighbour).
- The page's max width goes from 40rem to 64rem in this range. The laptop grid keeps 80rem.

**Blocked by:** 09: Compact grid layout; 13: Compact Buy-in row on phone cards

**Status:** done

- [x] Below 800px wide, cards show one per row.
- [x] From 800px up to 1103px, cards show two per row.
- [x] At 1104px and above, the grid shows, unchanged.
- [x] The page doesn't scroll sideways at any of these widths, in either language.

## Comments

- CSS only: a `min-width: 50rem` media query in `src/index.css` sets `.players` to two columns with `align-items: start` and `.app` to `max-width: 64rem`. The laptop query after it still overrides `.app` to 80rem. `App.tsx` is unchanged, because the cards vs grid switch is still the single `LAPTOP` breakpoint.
- Checked by hand in headless Firefox (puppeteer script) with 5 Players, one on 6 Buy-ins: 412 × 900 and 799 × 400 give 1 column. 800 × 400, 800 × 360 (Polish), 891 × 360 and 1103 × 700 give 2 columns. 1104 × 700 gives the grid. There's no sideways scroll at any of them.
