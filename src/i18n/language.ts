// Which language the page is shown in. Pure, so the browser and storage are passed in.

export const LANGUAGES = ['en', 'pl'] as const

export type Language = (typeof LANGUAGES)[number]

const isLanguage = (value: string | null): value is Language => LANGUAGES.some((language) => language === value)

/** The Host's saved choice if there is one, else Polish for a Polish browser, else English. */
export const pickLanguage = (saved: string | null, browserLanguages: readonly string[]): Language => {
  if (isLanguage(saved)) return saved
  return browserLanguages[0]?.toLowerCase().startsWith('pl') ? 'pl' : 'en'
}
