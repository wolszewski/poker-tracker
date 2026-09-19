import { discrepancy, formatAmount, totalBuyIns, totalCashOuts, type Night } from './night/night'

export function TotalsBar({ night }: { night: Night }) {
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
      <div>
        <span className="label">Discrepancy</span>
        <span className="value">{formatAmount(discrepancy(night))}</span>
      </div>
    </section>
  )
}
