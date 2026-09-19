import type { ReactNode } from 'react'
import { LANGUAGES, type Language } from './i18n/language'
import { useText } from './i18n/text'

/** Each language named in itself, so a Host who can't read the current one still finds theirs. */
const NAMES: Record<Language, string> = { en: 'English', pl: 'Polski' }

type Props = { language: Language; onChange: (language: Language) => void }

/** Flag buttons for switching the page's language. Inline SVG, because Windows doesn't draw flag emoji. */
export function LanguageSwitcher({ language, onChange }: Props) {
  const t = useText()

  return (
    <div className="language-switcher" role="group" aria-label={t.language}>
      {LANGUAGES.map((option) => (
        <button
          key={option}
          type="button"
          className="flag"
          lang={option}
          aria-label={NAMES[option]}
          title={NAMES[option]}
          aria-pressed={option === language}
          onClick={() => onChange(option)}
        >
          {FLAGS[option]}
        </button>
      ))}
    </div>
  )
}

function UnionFlag() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <clipPath id="union-flag-diagonals">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#union-flag-diagonals)" stroke="#c8102e" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  )
}

function PolishFlag() {
  return (
    <svg viewBox="0 0 16 10" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="16" height="5" fill="#fff" />
      <rect y="5" width="16" height="5" fill="#dc143c" />
    </svg>
  )
}

const FLAGS: Record<Language, ReactNode> = { en: <UnionFlag />, pl: <PolishFlag /> }
