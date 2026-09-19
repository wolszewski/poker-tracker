import { useText } from './i18n/text'
import { discrepancy, formatAmount, formatSigned, stillPlaying, totalBuyIns, totalCashOuts, type Night } from './night/night'

/** Hidden until every Player has a Cash-out, since the totals only mean something once the Night is over. */
export function TotalsBar({ night }: { night: Night }) {
  const t = useText()
  if (night.players.length === 0 || stillPlaying(night).length > 0) return null
  const nightDiscrepancy = discrepancy(night)

  return (
    <section className="totals" aria-label={t.totals}>
      <div>
        <span className="label">{t.buyIns}</span>
        <span className="value">{formatAmount(totalBuyIns(night))}</span>
      </div>
      <div>
        <span className="label">{t.cashOuts}</span>
        <span className="value">{formatAmount(totalCashOuts(night))}</span>
      </div>
      <div className={nightDiscrepancy !== 0 ? 'off' : ''}>
        <span className="label">{t.discrepancy}</span>
        <span className="value">{formatSigned(nightDiscrepancy)}</span>
      </div>
    </section>
  )
}
