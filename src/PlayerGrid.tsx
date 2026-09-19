import type { Apply } from './App'
import { BuyInItem } from './BuyInItem'
import { CashOut } from './CashOut'
import { formatAmount, formatSigned, isFinished, netResult, totalBuyIn, type Night, type Player } from './night/night'
import { AddBuyIn, PlayerStatus, RemovePlayerButton } from './PlayerParts'

type Props = { night: Night; apply: Apply }

/** The Players as a table, one row per Player, for laptop-sized screens. */
export function PlayerGrid({ night, apply }: Props) {
  const buyInColumns = Math.max(1, ...night.players.map((p) => p.buyIns.length))

  return (
    <div className="player-grid">
      <table>
        <thead>
          <tr>
            <th scope="col" className="name">
              Player
            </th>
            <th scope="colgroup" colSpan={buyInColumns}>
              Buy-ins
            </th>
            <th scope="col" className="amount">
              Total buy-in
            </th>
            <th scope="col" className="amount">
              Cash-out
            </th>
            <th scope="col" className="amount">
              Net result
            </th>
            <th scope="col" className="row-actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {night.players.map((player) => (
            <PlayerRow key={player.id} night={night} player={player} apply={apply} buyInColumns={buyInColumns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PlayerRow({ night, player, apply, buyInColumns }: Props & { player: Player; buyInColumns: number }) {
  const finished = isFinished(night, player.id)
  const net = netResult(night, player.id)
  const emptyCells = buyInColumns - player.buyIns.length

  return (
    <tr className={finished ? 'finished' : ''}>
      <th scope="row" className="name">
        <div className="name-inner">
          <span className="player-name">{player.name}</span>
          <PlayerStatus finished={finished} />
        </div>
      </th>
      {player.buyIns.map((b) => (
        <BuyInItem key={b.id} as="td" buyIn={b} apply={apply} />
      ))}
      {Array.from({ length: emptyCells }, (_, i) => (
        <td key={i} className="buy-in" />
      ))}
      <td className="amount">{formatAmount(totalBuyIn(night, player.id))}</td>
      <td className="amount">{player.cashOut != null ? formatAmount(player.cashOut) : '–'}</td>
      <td className={`amount net ${net === undefined ? '' : net > 0 ? 'win' : net < 0 ? 'loss' : ''}`}>
        {net !== undefined ? formatSigned(net) : '–'}
      </td>
      <td className="row-actions">
        <div className="row-actions-inner">
          <AddBuyIn player={player} apply={apply} />
          <CashOut night={night} player={player} apply={apply} showResult={false} />
          <RemovePlayerButton player={player} apply={apply} />
        </div>
      </td>
    </tr>
  )
}
