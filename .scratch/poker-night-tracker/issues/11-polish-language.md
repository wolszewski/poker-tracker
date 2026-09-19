# 11: Polish version of the page

**What to build:** Make the whole page available in Polish as well as English. Two small flag buttons in the top right corner, 🇬🇧 English and 🇵🇱 Polish, switch the language straight away, with no reload and no change to the Night.

- **Switcher:** two flag buttons in the top right corner of the page, on the same line as the "Poker Night" heading, in both the phone cards and the laptop grid layouts. The current language's flag is marked as selected (`aria-pressed`, plus a visible style such as full opacity or an outline). The others are dimmed. Each button has an accessible name in its own language ("English", "Polski"). Draw the flags as small inline SVGs, not emoji, because Windows doesn't render flag emoji.
- **What gets translated:** every piece of text the app shows: the heading, buttons, labels, hints, dialog titles, confirm prompts, Player status (Playing or Finished), totals, the Settlement panel, validation messages, and the Copy summary text. Player names and amounts stay as the Host typed them.
- **Which language on first visit:** Polish if the browser's language starts with `pl`, English otherwise.
- **Remembering the choice:** the chosen language is saved in local storage, under its own key and separate from the saved Night, so it persists across reloads. It isn't part of the Night, and New Night doesn't reset it.
- **Document language:** `<html lang>` follows the chosen language (`en` or `pl`).

Where the text lives:
- Keep all UI text in one translation dictionary per language (for example `src/i18n/en.ts` and `src/i18n/pl.ts`), with typed keys so a key missing from Polish fails `tsc`. No i18n library is needed.
- The Night module is where validation messages and the Copy summary lines are built today (`src/night/night.ts`). Its rules stay the same, but it must not hard-code English. Either it returns error codes and summary data that components translate, or the functions that build text take the dictionary as an argument. Pick whichever keeps the module simplest. Existing tests may be updated to cover this change, but not to change behaviour.
- The app shows no counts today. If one is added, Polish needs the right plural form (1 gracz, 2 graczy, 5 graczy), for example from `Intl.PluralRules`.
- Amounts keep their current format (`301.5`) in both languages, so what the Host types and what they see still look the same.

Polish words to use for the glossary terms (see `CONTEXT.md`), so the Polish text is consistent:

| English | Polish |
| --- | --- |
| Night | Wieczór |
| Player | Gracz |
| Buy-in | Wpisowe |
| Total buy-in | Suma wpisowego |
| Cash-out | Wypłata |
| Net result | Wynik |
| Discrepancy | Rozbieżność |
| Settlement | Rozliczenie |
| Transfer | Przelew |

**Blocked by:** None

**Status:** ready-for-agent

- [ ] Two flag buttons show in the top right corner in both layouts. Clicking one switches all visible text to that language at once, with no reload, and the Night is unchanged.
- [ ] The selected flag is marked visually and with `aria-pressed`. Each button has an accessible name.
- [ ] In Polish, no English text is left: heading, buttons, labels, hints, dialogs, confirm prompts, statuses, totals, the Settlement panel and validation messages.
- [ ] Copy summary produces Polish text when Polish is selected.
- [ ] On a first visit, the language follows the browser (`pl*` gives Polish, anything else gives English). After a choice, a reload keeps it. New Night doesn't reset it.
- [ ] `<html lang>` matches the chosen language.
- [ ] A key missing from the Polish dictionary is a type error.
- [ ] The flags fit at phone width (390px) without pushing the heading onto two lines, and the page doesn't scroll sideways.
- [ ] Night module tests still pass, and the Night rules are unchanged.
