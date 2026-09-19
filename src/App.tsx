import { useEffect, useState } from 'react'
import { AddPlayerForm } from './AddPlayerForm'
import { CopySummary } from './CopySummary'
import { pickLanguage, type Language } from './i18n/language'
import { dictionaries, TextContext } from './i18n/text'
import { LanguageSwitcher } from './LanguageSwitcher'
import { emptyNight, loadNight, saveNight, type Change, type Night, type Rejection } from './night/night'
import { PlayerCard } from './PlayerCard'
import { PlayerGrid } from './PlayerGrid'
import { SettlementPanel } from './SettlementPanel'
import { readLanguage, readNight, writeLanguage, writeNight } from './storage'
import { TotalsBar } from './TotalsBar'
import { useMediaQuery } from './useMediaQuery'

/** Applies a change from the Night module, returning why it was rejected, if it was, for the form that made it. */
export type Apply = (change: (night: Night) => Change) => Rejection | undefined

/** Above this width the Players show as a grid; below it, as cards. Keep in step with the media query in index.css. */
const LAPTOP = '(min-width: 69rem)'

export default function App() {
  const [night, setNight] = useState(() => loadNight(readNight()))
  const [language, setLanguage] = useState<Language>(() => pickLanguage(readLanguage(), navigator.languages ?? []))
  const laptop = useMediaQuery(LAPTOP)
  const t = dictionaries[language]

  useEffect(() => writeNight(saveNight(night)), [night])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.title
  }, [language, t])

  const chooseLanguage = (chosen: Language) => {
    setLanguage(chosen)
    writeLanguage(chosen)
  }

  const apply: Apply = (change) => {
    const result = change(night)
    if (!result.ok) return result.error
    setNight(result.night)
  }

  return (
    <TextContext value={t}>
      <main className="app">
        <header className="app-header">
          <h1>{t.title}</h1>
          <LanguageSwitcher language={language} onChange={chooseLanguage} />
        </header>
        <AddPlayerForm night={night} apply={apply} />
        {night.players.length === 0 ? (
          <p className="hint">{t.noPlayers}</p>
        ) : laptop ? (
          <PlayerGrid night={night} apply={apply} />
        ) : (
          <ul className="players">
            {night.players.map((player) => (
              <PlayerCard key={player.id} night={night} player={player} apply={apply} />
            ))}
          </ul>
        )}
        <SettlementPanel night={night} />
        <TotalsBar night={night} />

        <div className="night-actions">
          <CopySummary night={night} />
          <button
            type="button"
            className="danger"
            onClick={() => {
              if (window.confirm(t.confirmNewNight)) {
                setNight(emptyNight())
              }
            }}
          >
            {t.newNight}
          </button>
        </div>
      </main>
    </TextContext>
  )
}
