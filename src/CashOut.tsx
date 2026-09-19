import { useState } from 'react'
import { AmountDialog } from './AmountDialog'
import type { Apply } from './App'
import { useText } from './i18n/text'
import { clearCashOut, formatAmount, formatSigned, isFinished, netResult, setCashOut, type Night, type Player } from './night/night'

type Props = { night: Night; player: Player; apply: Apply; showResult?: boolean }

/** Set, change or clear a Player's Cash-out through a dialog. The grid shows the Cash-out and Net result in their own columns, so it hides them here. */
export function CashOut({ night, player, apply, showResult = true }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const t = useText()
  const net = netResult(night, player.id)
  const finished = isFinished(night, player.id)

  return (
    <div className="cash-out">
      {showResult && player.cashOut != null && net !== undefined && (
        <p className="result">
          <span>
            {t.cashOut} <strong>{formatAmount(player.cashOut)}</strong>
          </span>
          <span className={`net ${net > 0 ? 'win' : net < 0 ? 'loss' : ''}`}>
            {t.netResult} <strong>{formatSigned(net)}</strong>
          </span>
        </p>
      )}
      <button type="button" className={finished ? 'small' : undefined} onClick={() => setDialogOpen(true)}>
        {finished ? t.changeCashOut : t.cashOutButton}
      </button>
      {dialogOpen && (
        <AmountDialog
          title={t.cashOutFor(player.name)}
          submitLabel={t.save}
          initialAmount={player.cashOut != null ? formatAmount(player.cashOut) : ''}
          onSubmit={(amount) => apply((n) => setCashOut(n, player.id, amount))}
          extraAction={
            finished ? { label: t.backToPlaying, run: () => apply((n) => clearCashOut(n, player.id)) } : undefined
          }
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  )
}
