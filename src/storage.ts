// Thin adapter over the browser's local storage. The Night module owns the saved format.

const KEY = 'poker-tracker/night'

export const readSaved = (): string | null => {
  try {
    return window.localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export const writeSaved = (saved: string): void => {
  try {
    window.localStorage.setItem(KEY, saved)
  } catch {
    // Storage can be full or blocked (private windows). The Night stays usable in memory.
  }
}
