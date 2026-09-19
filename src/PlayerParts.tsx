// Pieces of a Player shared by the phone cards (PlayerCard) and the laptop grid (PlayerGrid).

import { useState } from 'react'
import { AmountDialog } from './AmountDialog'
import type { Apply } from './App'
import { useText } from './i18n/text'
import { addBuyIn, removePlayer, type Player, type Rejection } from './night/night'
import { RejectionMessage } from './RejectionMessage'

type Props = { player: Player; apply: Apply }

/** Quick-add 50 and 100, and an Other… button that asks for any other amount in a dialog. */
export function AddBuyIn({ player, apply }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<Rejection>()
  const t = useText()

  const buyIn = (amount: string) => apply((n) => addBuyIn(n, player.id, amount))

  return (
    <div className="add-buy-in">
      <button type="button" className="primary" onClick={() => setError(buyIn('50'))}>
        +50
      </button>
      <button type="button" onClick={() => setError(buyIn('100'))}>
        +100
      </button>
      <button
        type="button"
        onClick={() => {
          setError(undefined)
          setDialogOpen(true)
        }}
      >
        {t.otherBuyIn}
      </button>
      <RejectionMessage rejection={error} />
      {dialogOpen && (
        <AmountDialog
          title={t.addBuyInFor(player.name)}
          submitLabel={t.add}
          onSubmit={buyIn}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  )
}

export function RemovePlayerButton({ player, apply }: Props) {
  const t = useText()
  return (
    <button
      type="button"
      className="small danger"
      onClick={() => {
        if (window.confirm(t.confirmRemove(player.name))) {
          apply((n) => removePlayer(n, player.id))
        }
      }}
    >
      {t.remove}
    </button>
  )
}

export function PlayerStatus({ finished }: { finished: boolean }) {
  const t = useText()
  return <span className={`status ${finished ? 'done' : ''}`}>{finished ? t.finished : t.playing}</span>
}
