import { useState } from 'react'
import type { Apply } from './App'
import { useText } from './i18n/text'
import { addPlayer, isNameInNight, type Night, type Rejection } from './night/night'
import { RejectionMessage } from './RejectionMessage'

export function AddPlayerForm({ night, apply }: { night: Night; apply: Apply }) {
  const [name, setName] = useState('')
  const [error, setError] = useState<Rejection>()
  const t = useText()

  return (
    <form
      className="add-player"
      onSubmit={(event) => {
        event.preventDefault()
        const failure = apply((night) => addPlayer(night, name))
        setError(failure)
        if (!failure) setName('')
      }}
    >
      <label className="field">
        <span className="label">{t.playerName}</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
        />
      </label>
      <button type="submit" className="primary">
        {t.addPlayer}
      </button>
      {isNameInNight(night, name) && (
        <p className="warning">{t.alreadyInNight(name.trim())}</p>
      )}
      <RejectionMessage rejection={error} />
    </form>
  )
}
