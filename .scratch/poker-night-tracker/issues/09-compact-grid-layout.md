# 09: Grid layout on laptop screens

**What to build:** On laptop-sized screens, show the Players as a compact grid instead of cards, so a Night with 7 or more Players fits on screen with little or no scrolling. Today each Player card takes a lot of height, and the cards use only a narrow column in the middle of a wide screen. On phone-sized screens, keep the current Player cards as they are.

In the grid, each Player is one row. From left to right the columns are:
- the Player's name, with the finished marker;
- one column per Buy-in, where the Buy-in columns grow to the right as Buy-ins are added;
- the Total buy-in;
- the Cash-out;
- the Net result;
- one actions column on the far right.

The actions column holds the Player's actions:
- quick-add 50 and 100;
- a custom-amount Buy-in;
- set, change or clear the Cash-out;
- remove the Player.

Clicking a Buy-in cell edits or deletes that Buy-in, as clicking a Buy-in chip does today.

The switch between cards and grid happens at a single width breakpoint, for example 48rem (768px). Pick one that suits the layout. The page may use more of a laptop's width than today's narrow column so that the grid fits.

This refines the "one card per Player" line in the spec's UI decision, which now applies only to phone-sized screens. It changes only the React components and styles. The Night module and its rules stay the same. The add-Player form, the totals bar, the Settlement panel, Copy summary and New Night keep working on both layouts.

**Blocked by:** None (tickets 01–08 are done)

**Status:** done

- [x] At laptop widths, above the breakpoint, the Players show as a grid with one row per Player. A Night of 7 Players, each with 3 Buy-ins, fits on one screen of a 1280 × 800 window.
- [x] Each Buy-in is its own column, in the order recorded. A Player with fewer Buy-ins than others leaves the extra cells empty.
- [x] The Total buy-in, Cash-out and Net result columns sit after the Buy-in columns. Net results keep their sign and their winner and loser colours, and finished Players stay clearly marked.
- [x] The actions column is on the far right of every row. It has quick-add 50 and 100, custom Buy-in, Cash-out (set, change, clear) and remove Player, and remove still asks for confirmation.
- [x] Clicking a Buy-in cell lets the Host edit or delete it, with the same validation messages as today.
- [x] If there are more Buy-in columns than fit the width, the grid scrolls sideways inside its own area, and the name and actions columns stay in view. The page itself never scrolls sideways.
- [x] At phone widths, below the breakpoint, the current Player cards are unchanged.
- [x] No business logic moves into components. The existing Night module tests still pass unchanged.
- [x] Checked by hand with a 7-Player Night in a phone-sized window (cards) and a laptop-sized window (grid).

## Comments

- Breakpoint is 78rem (1248px), not the suggested 48rem. The actions column is about 38rem wide, and at 64rem the sticky actions column hid the Total buy-in, Cash-out and Net result columns. At 78rem a 7-Player Night with 3 Buy-ins each, two of them finished, fits with no sideways scrolling. Narrower screens keep the cards. The value lives in `LAPTOP` in `src/App.tsx` and in the media query in `src/index.css`, which must match.
- In the grid, the custom Buy-in field and button read "Buy-in" and "Add", shortened from "Other amount" and "Add Buy-in" to save width.
- Checked by hand in headless Firefox. At 1280 × 800 with 7 Players × 3 Buy-ins, the grid ends at 567px and the page doesn't scroll sideways. With 15 Buy-ins on one Player, the grid scrolls sideways inside its own area, with the name and actions columns sticky. Buy-in cell edit and delete work, and the validation message shows. Cash-out set, change and clear update the columns. Remove confirm: cancel keeps the Player, OK removes them. At 390px wide, the 7 cards show as before.
- Clicking the Buy-in chip in a cell opens the editor. Clicking the cell's padding around the chip doesn't.
