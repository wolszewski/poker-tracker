import { describeTransfer, formatSigned, settle, type Night } from './night/night'

export function SettlementPanel({ night }: { night: Night }) {
  if (night.players.length === 0) return null
  const settlement = settle(night)

  return (
    <section className="settlement" aria-label="Settlement">
      <h2>Settlement</h2>
      {!settlement.available ? (
        <p className="hint">
          {settlement.reason.kind === 'still-playing'
            ? `Available once everyone has a Cash-out. Still playing: ${settlement.reason.players.map((p) => p.name).join(', ')}.`
            : `Available once the Discrepancy is 0. It's ${formatSigned(settlement.reason.discrepancy)}, so fix the Cash-outs or Buy-ins first.`}
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
