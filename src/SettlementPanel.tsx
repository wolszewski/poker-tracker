import { describeTransfer, formatSigned, settle, type Night } from './night/night'

/** Hidden until every Player has a Cash-out; after that it shows the Transfers, or why the Discrepancy blocks them. */
export function SettlementPanel({ night }: { night: Night }) {
  if (night.players.length === 0) return null
  const settlement = settle(night)
  if (!settlement.available && settlement.reason.kind === 'still-playing') return null

  return (
    <section className="settlement" aria-label="Settlement">
      <h2>Settlement</h2>
      {!settlement.available ? (
        <p className="hint">
          {settlement.reason.kind === 'discrepancy' &&
            `Available once the Discrepancy is 0. It's ${formatSigned(settlement.reason.discrepancy)}, so fix the Cash-outs or Buy-ins first.`}
        </p>
      ) : settlement.transfers.length === 0 ? (
        <p>Nobody owes anything.</p>
      ) : (
        <ul className="transfers">
          {settlement.transfers.map((transfer) => (
            <li key={`${transfer.from}-${transfer.to}`}>{describeTransfer(night, transfer)}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
