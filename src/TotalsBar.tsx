import { discrepancy, formatAmount, formatSigned, stillPlaying, totalBuyIns, totalCashOuts, type Night } from './night/night'

export function TotalsBar({ night }: { night: Night }) {
  const gap = discrepancy(night)
  const playing = stillPlaying(night).length

  return (
    <section className="totals" aria-label="Totals">
      <div>
        <span className="label">Buy-ins</span>
        <span className="value">{formatAmount(totalBuyIns(night))}</span>
      </div>
      <div>
        <span className="label">Cash-outs</span>
        <span className="value">{formatAmount(totalCashOuts(night))}</span>
      </div>
      <div className={gap !== 0 ? 'off' : ''}>
        <span className="label">Discrepancy</span>
        <span className="value">{formatSigned(gap)}</span>
      </div>
      <div>
        <span className="label">Still playing</span>
        <span className="value">{playing}</span>
      </div>
    </section>
  )
}
