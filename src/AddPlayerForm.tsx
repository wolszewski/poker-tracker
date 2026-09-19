import { useState } from 'react'
import type { Apply } from './App'
import { addPlayer, type Night } from './night/night'

export function AddPlayerForm({ apply }: { night: Night; apply: Apply }) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string>()

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
        <span className="label">Player name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
        />
      </label>
      <button type="submit" className="primary">
        Add Player
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
