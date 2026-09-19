import { useText } from './i18n/text'
import { describeTransfer, formatSigned, settle, type Night } from './night/night'

/** Hidden until every Player has a Cash-out; after that it shows the Transfers, or why the Discrepancy blocks them. */
export function SettlementPanel({ night }: { night: Night }) {
  const t = useText()
  if (night.players.length === 0) return null
  const settlement = settle(night)
  if (!settlement.available && settlement.reason.kind === 'still-playing') return null

  return (
    <section className="settlement" aria-label={t.settlement}>
      <h2>{t.settlement}</h2>
      {!settlement.available ? (
        <p className="hint">
          {settlement.reason.kind === 'discrepancy' &&
            t.settlementNeedsZero(formatSigned(settlement.reason.discrepancy))}
        </p>
      ) : settlement.transfers.length === 0 ? (
        <p>{t.summary.nobodyOwes}</p>
      ) : (
        <ul className="transfers">
          {settlement.transfers.map((transfer) => (
            <li key={`${transfer.from}-${transfer.to}`}>{describeTransfer(night, transfer, t.summary)}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
