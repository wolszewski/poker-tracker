import { useText } from './i18n/text'
import { discrepancy, formatAmount, formatSigned, stillPlaying, totalBuyIns, totalCashOuts, type Night } from './night/night'

export function TotalsBar({ night }: { night: Night }) {
  const t = useText()
  const nightDiscrepancy = discrepancy(night)
  const playing = stillPlaying(night).length

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
      <div>
        <span className="label">{t.stillPlaying}</span>
        <span className="value">{playing}</span>
      </div>
    </section>
  )
}
