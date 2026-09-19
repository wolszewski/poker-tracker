import { useText } from './i18n/text'
import type { Rejection } from './night/night'

/** Why the Night module turned a change down, in the Host's language. Renders nothing when there's no rejection. */
export function RejectionMessage({ rejection }: { rejection: Rejection | undefined }) {
  const t = useText()
  return rejection ? <p className="error">{t.errors[rejection]}</p> : null
}
