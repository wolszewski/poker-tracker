# 06: Save in browser and New Night

**What to build:** Every change to the Night is saved in the browser's local storage straight away, and restored when the page is opened or reloaded, so a locked phone or closed tab never loses the Night. There's no sync between devices (ADR 0001). The Night module turns a Night into a string and back, with a format version number. Missing, corrupt or unknown-version data comes back as an empty Night instead of crashing. A **New Night** button clears everything after the Host confirms.

**Blocked by:** 05: Cash-outs, Net results and Discrepancy

**Status:** ready-for-agent

- [ ] After any change, reloading the page restores the same Night: Players, Buy-ins and Cash-outs.
- [ ] Corrupt or unknown-version saved data starts an empty Night without an error screen.
- [ ] New Night asks for confirmation and then clears the Night, including what's saved.
- [ ] Night module tests cover saving and loading a full Night, corrupt data and an unknown version.
- [ ] The local storage wrapper is a thin adapter with no business logic.
