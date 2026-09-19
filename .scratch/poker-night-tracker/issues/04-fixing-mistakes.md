# 04: Fixing mistakes

**What to build:** The Host can correct any entry. Each Buy-in in a Player's list can be edited or deleted. A Player can be removed, which also removes their Buy-ins and Cash-out, but only after the Host confirms. Adding a Player whose name is already in the Night shows a warning but is still allowed, because edits and deletes work by ID, not by name.

**Blocked by:** 03: Players and Buy-ins

**Status:** ready-for-agent

- [ ] A Buy-in's amount can be edited, with the same validation as adding one.
- [ ] A Buy-in can be deleted, and all totals update.
- [ ] A Player can be removed after confirming, and their Buy-ins (and Cash-out, if any) disappear from all totals.
- [ ] Adding a duplicate name shows a warning but is allowed, and edits and deletes affect only the Player being changed.
- [ ] Night module tests cover edit, delete, removing a Player together with their data, and duplicate names.
