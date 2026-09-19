// Thin adapter over the browser's local storage: the saved Night, whose format the Night module owns, and the chosen language.

const NIGHT_KEY = 'poker-tracker/night'
/** Kept apart from the Night, so New Night doesn't reset it. */
const LANGUAGE_KEY = 'poker-tracker/language'

const read = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const write = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage can be full or blocked (private windows). The app stays usable in memory.
  }
}

export const readNight = (): string | null => read(NIGHT_KEY)

export const writeNight = (saved: string): void => write(NIGHT_KEY, saved)

export const readLanguage = (): string | null => read(LANGUAGE_KEY)

export const writeLanguage = (language: string): void => write(LANGUAGE_KEY, language)
