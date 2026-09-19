# 10: Enter amounts in a small dialog

**What to build:** Make each Player's controls less cluttered. Today every Player shows two always-visible amount fields: the custom-amount Buy-in field with its **Add Buy-in** button, and the Cash-out field with its **Cash out** button. Replace each field-and-button pair with a single button that opens a small dialog where the Host types the amount.

- **Buy-in:** the custom-amount field and its button become one **Add** button. It opens a dialog titled with the Player's name ("Add Buy-in for Alice"), with one amount field and **Add** and **Cancel** buttons. Quick-add +50 and +100 stay as they are, one tap and no dialog.
- **Cash-out, still playing:** the Cash-out field and its button become one **Cash out** button. It opens a dialog ("Cash-out for Alice") with one amount field and **Save** and **Cancel** buttons.
- **Cash-out, finished:** the **Change Cash-out** and **Back to playing** buttons become one **Change Cash-out** button. It opens the same dialog, with the field filled in with the current Cash-out. The dialog also has a **Back to playing** button that clears the Cash-out. The Player's controls then no longer show an inline edit form or a separate clear button.

How each dialog behaves:
- It opens with the amount field focused. Enter submits and Escape cancels.
- Amounts are checked by the Night module, as today. A validation error shows inside the dialog, and the dialog stays open so the Host can fix the amount. On success, the dialog closes.
- Only one dialog is open at a time. It is small and centred, and it works on a phone (cards) and on a laptop (grid).

This applies to both layouts, the phone cards and the laptop grid from ticket 09. It changes only React components and styles. The Night module and its rules stay the same. Editing and deleting an existing Buy-in by clicking its chip is not part of this ticket, and works as today.

**Blocked by:** None (ticket 09 is done)

**Status:** ready-for-agent

- [ ] Each Player shows **+50**, **+100** and one **Add** button for Buy-ins, with no always-visible amount field, in both the cards and the grid.
- [ ] **Add** opens a dialog for that Player. A valid amount adds the Buy-in and closes the dialog. An invalid amount shows the same validation message as today, and the dialog stays open.
- [ ] A Player still playing shows one **Cash out** button with no always-visible field. It opens a dialog, and a valid amount sets the Cash-out and closes it.
- [ ] A finished Player shows one **Change Cash-out** button. It opens the dialog with the current Cash-out filled in. The dialog can save a new amount or send the Player back to playing, which clears their Cash-out.
- [ ] The dialogs open with the field focused. Enter submits, and Escape and Cancel close them without changing anything.
- [ ] The dialogs fit and work at phone width (390px) and laptop width. The page doesn't scroll sideways.
- [ ] In the grid, the actions column is narrower than before. The breakpoint in `src/App.tsx` and `src/index.css` may be lowered if the grid now fits at smaller widths.
- [ ] No business logic moves into components. The existing Night module tests still pass unchanged.
- [ ] Checked by hand with a 7-Player Night in a phone-sized window (cards) and a laptop-sized window (grid).
