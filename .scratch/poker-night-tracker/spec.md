# Spec: Poker night tracker

Status: ready-for-agent

## Problem Statement

At a home cash-game Night, the Host keeps track of money on paper or in their head: who bought in, how many times and for how much, and what everyone cashed out for. At the end of the Night, working out each Player's Net result, spotting that the totals don't add up, and deciding who should pay whom is slow and error-prone. It's usually done late at night, by someone who has been playing for hours.

## Solution

A simple single-page website that the Host opens on a phone or laptop. The Host adds Players, taps to record each Buy-in (50 by default, 100 one tap away, or any other amount), and enters each Player's Cash-out when they leave. The app always shows each Player's Total buy-in and Net result, and the Night's Discrepancy, so miscounts are obvious. At the end, the Host copies a plain-text summary into the group chat and starts a New Night. As a bonus once everything else works, the app shows a Settlement: the fewest Transfers that square everyone's Net results, available only when the Discrepancy is exactly 0.

The Night is saved in the browser it was started in, and survives reloads and closed tabs. There is no sync between devices (see ADR 0001).

## User Stories

1. As a Host, I want to open the app from a URL on my phone or laptop, so that I don't need to install anything.
2. As a Host, I want the app to work comfortably on a phone screen, so that I can use it at the table.
3. As a Host, I want the app to work on a laptop screen too, so that I can use whichever device is to hand.
4. As a Host, I want to add a Player by name, so that I can start tracking their money.
5. As a Host, I want to add Players at any point during the Night, so that latecomers can join.
6. As a Host, I want a Player name to be required, so that I don't end up with blank rows.
7. As a Host, I want to be warned when I add a Player whose name is already in the Night, so that I don't track the same person twice by accident.
8. As a Host, I want to remove a Player added by mistake, so that the Night only lists people who actually played.
9. As a Host, I want removing a Player to also remove their Buy-ins and Cash-out after I confirm, so that the totals stay correct and I don't delete someone by accident.
10. As a Host, I want to record a Buy-in of 50 with one tap, so that the most common case is as quick as possible.
11. As a Host, I want to record a Buy-in of 100 with one tap, so that the second most common case is also quick.
12. As a Host, I want to record a Buy-in of any other amount, so that unusual buy-ins and top-ups can be recorded.
13. As a Host, I want to record as many Buy-ins per Player as needed, so that rebuys and top-ups are all counted.
14. As a Host, I want to see each Player's Buy-ins as a list of amounts, so that I can check what was recorded.
15. As a Host, I want to edit the amount of a Buy-in, so that I can fix a wrong entry.
16. As a Host, I want to delete a Buy-in, so that I can undo a mis-tap.
17. As a Host, I want to see each Player's Total buy-in, so that I know how much they've put in.
18. As a Host, I want to record a Player's Cash-out whenever they leave, so that early leavers can be settled while others keep playing.
19. As a Host, I want to edit a Player's Cash-out, so that I can fix a miscount.
20. As a Host, I want to clear a Player's Cash-out, so that a Player recorded as leaving too early can go back to playing.
21. As a Host, I want to record a Cash-out of 0, so that a Player who lost everything can be marked as finished.
22. As a Host, I want to enter amounts with up to 2 decimal places, such as 301.5, so that exact chip values can be recorded.
23. As a Host, I want amounts that are negative, have more than 2 decimal places or aren't numbers to be rejected, so that bad data can't get into the Night.
24. As a Host, I want Buy-in amounts to be greater than 0, so that meaningless Buy-ins can't be recorded.
25. As a Host, I want Players who have a Cash-out to be clearly marked as finished, so that I can see who is still playing.
26. As a Host, I want to see each finished Player's Net result, with winners and losers clearly told apart, so that everyone knows where they stand.
27. As a Host, I want to see the Night's total Buy-ins and total Cash-outs, so that I can check them against the money on the table.
28. As a Host, I want to see the Discrepancy at all times, so that I notice miscounts or missing Buy-ins straight away.
29. As a Host, I want the Discrepancy to be a warning and not block anything, so that I can accept a small rounding gap and go home.
30. As a Host, I want to see which Players still have no Cash-out, so that I know the Discrepancy isn't final yet.
31. As a Host, I want every change to be saved automatically in the browser, so that I never lose the Night.
32. As a Host, I want the Night to be restored when I reopen or reload the page, so that a locked phone or closed tab doesn't lose my work.
33. As a Host, I want to copy a plain-text summary of the Night, so that I can paste it into the group chat.
34. As a Host, I want the summary to list each Player's Total buy-in, Cash-out and Net result, so that everyone can check their own numbers.
35. As a Host, I want the summary to include the Discrepancy, so that everyone can see the totals were checked.
36. As a Host, I want to start a New Night, which clears everything, so that I can use the app again next week.
37. As a Host, I want to confirm before a New Night clears the current one, so that I don't wipe a Night by accident.
38. As a Host, I want amounts shown as plain numbers with no currency, so that the app works whatever we play for.
39. As a Host, I want to see a Settlement once every Player has a Cash-out and the Discrepancy is exactly 0, so that I know who should pay whom. (Bonus)
40. As a Host, I want the Settlement to use the fewest possible Transfers, so that as few payments as possible have to be made. (Bonus)
41. As a Host, I want to be told why no Settlement is shown (Players without a Cash-out, or a non-zero Discrepancy), so that I know what to fix. (Bonus)
42. As a Host, I want the Settlement's Transfers included in the copied summary, so that everyone sees who pays whom. (Bonus)
43. As a Player, I want to read my Net result from the summary in the group chat, so that I know what I won or lost.

## Implementation Decisions

- **Platform.** A static single-page website built with Vite, TypeScript and React. There is no backend and there are no accounts. It's deployed to GitHub Pages from a private repo by a GitHub Actions workflow on push to `main`. The Vite base path must match the Pages URL of the repo.
- **Storage (ADR 0001).** The current Night is saved in the browser's local storage after every change and loaded when the app starts. There's no sync between devices. If the saved data is missing or unreadable, the app starts with an empty Night and doesn't crash. The saved format carries a version number so that it can change later.
- **Night module: the only deep module.** A plain TypeScript module with no React, browser or storage dependencies holds all the rules. The Night is an immutable value, and changes are functions that take a Night and return a new one, or a validation error.
  - Changes: add a Player, remove a Player (together with their Buy-ins and Cash-out), add a Buy-in, edit a Buy-in's amount, delete a Buy-in, set or edit a Cash-out, and clear a Cash-out.
  - Queries: Total buy-in per Player, whether a Player is finished (has a Cash-out), Net result per finished Player, total Buy-ins, total Cash-outs, and the Discrepancy (total Cash-outs − total Buy-ins, counting only the Cash-outs recorded so far).
  - Summary: turning a Night into the plain-text Copy summary.
  - Saving: turning a Night into a string and back, with the version number. Reading back returns an empty Night for missing, corrupt or unknown-version data.
  - Settlement (bonus): available only when every Player is finished and the Discrepancy is exactly 0. Otherwise it returns the reason it isn't available. It returns a list of Transfers (from Player, to Player, amount) using the fewest Transfers. Players with a Net result of 0 take no part.
- **Money.** Amounts are stored internally as whole hundredths (integer cents), so sums and the Discrepancy check for 0 are exact. Input accepts up to 2 decimal places, and output formats with no currency symbol. Trailing zeros are dropped where that reads naturally, so 300 shows as `300` and 301.50 as `301.5`. Buy-ins must be greater than 0 and Cash-outs 0 or more.
- **Identity.** Players and Buy-ins have generated IDs, so duplicate names and repeated amounts can't confuse edits and deletes. Duplicate Player names are allowed after a warning.
- **Settlement algorithm (bonus).** It finds the minimum number of Transfers exactly by splitting the Players into the largest possible number of groups whose Net results sum to 0. Each group of k Players then needs k − 1 Transfers. This is exhaustive and exponential, but fine for home-game sizes. Above 10 Players, it falls back to the greedy method (biggest loser pays biggest winner, repeat), which needs at most (Players − 1) Transfers. Results are deterministic for the same Night.
- **UI.** One screen, designed for phones first:
  - A form to add a Player.
  - One card per Player showing their name, Buy-in list (with edit and delete on each), quick-add 50 and 100 buttons, a custom-amount Buy-in, a Cash-out field, their Total buy-in and Net result, a finished marker and a remove button.
  - A totals bar showing total Buy-ins, total Cash-outs, the Discrepancy (highlighted when not 0) and how many Players have no Cash-out yet.
  - **Copy summary** and **New Night** buttons.
  - A Settlement panel (bonus).

  The React components only display what the Night module returns and pass the Host's actions to it. They hold no business logic.
- **Summary format.** A title line, one line per Player (name, Total buy-in, Cash-out or "still playing", Net result with a sign), the totals, and the Discrepancy. Transfers are added once the Settlement exists.

## Testing Decisions

- **One test seam: the Night module.** Tests use Vitest and call the Night module's public functions the same way the UI does. They check the returned Night, query results, Settlement and summary text. There are no mocks and nothing looks at internal representation. Tests shouldn't depend on how amounts are stored; they check the numbers a Host would see.
- **Covered through the seam:**
  - Adding, removing, editing and deleting Players, Buy-ins and Cash-outs, including removing a Player together with their data.
  - Amount validation: negative amounts, 0 for Buy-ins, 3 decimal places and non-numeric input are rejected, and 301.5 is accepted.
  - Exact decimal arithmetic, such as 0.1 + 0.2 giving exactly 0.3.
  - The Discrepancy with some or all Players finished, and Net results.
  - Summary text for typical Nights.
  - Saving and loading, including corrupt and unknown-version data.
  - Settlement: shown only when all Players are finished and the Discrepancy is 0, minimum Transfer count on cases where greedy isn't optimal, Players at 0 left out, and deterministic output.
- **Not covered automatically:** React components, the local storage wrapper, clipboard and deployment. These stay thin and are checked by hand in a phone-sized and a laptop-sized browser window.
- **Prior art.** None; the repo is empty. These are the first tests.
- **Approach.** Build test-first (`/tdd`), one red-green slice per behaviour.

## Out of Scope

- Syncing a Night between devices, or several people editing at once (ADR 0001).
- History of past Nights, running totals per Player, and a Player list carried over between Nights.
- Tournaments, and any game format other than a cash game.
- Currencies, currency symbols and chip denominations.
- Accounts, logins, and access control on the site.
- Settling up with a non-zero Discrepancy (for example, the biggest winner absorbing the gap). The Host fixes Cash-outs until the Discrepancy is 0.
- Undo history beyond editing and deleting individual entries.
- Exporting to files, and sharing by link.
- Installing it as an app (PWA) and offline caching beyond what the browser already does.

## Further Notes

- Vocabulary follows `CONTEXT.md`: Night, Host, Player, Buy-in, Total buy-in, Cash-out, Net result, Discrepancy, Settlement, Transfer.
- Settlement is the bonus feature. Build it after the rest of the app works end to end.
- GitHub Pages on the owner's paid plan can publish from a private repo, but the published site is publicly reachable. That's acceptable because each browser only ever holds its own Night.
