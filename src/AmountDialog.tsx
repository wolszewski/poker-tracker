import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  title: string
  submitLabel: string
  initialAmount?: string
  /** Tries the amount, returning its error, if any. The dialog closes on success and stays open on an error. */
  onSubmit: (amount: string) => string | undefined
  /** One more button beside Cancel, such as Back to playing. Closes the dialog on success. */
  extraAction?: { label: string; run: () => string | undefined }
  /** Called once the dialog has closed, however it closed. */
  onClose: () => void
}

/** A small modal for typing one amount. Mount it to open it; it calls onClose when done. */
export function AmountDialog({ title, submitLabel, initialAmount = '', onSubmit, extraAction, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [amount, setAmount] = useState(initialAmount)
  const [error, setError] = useState<string>()
  const titleId = useId()

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
    input.current?.select()
  }, [])

  const closeUnlessFailed = (failure: string | undefined) => {
    setError(failure)
    if (!failure) dialog.current?.close()
  }

  // In a portal so the grid's table styles don't reach it.
  return createPortal(
    <dialog ref={dialog} className="amount-dialog" aria-labelledby={titleId} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          closeUnlessFailed(onSubmit(amount))
        }}
      >
        <h2 id={titleId}>{title}</h2>
        <input
          ref={input}
          aria-label="Amount"
          inputMode="decimal"
          enterKeyHint="done"
          autoComplete="off"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <div className="dialog-actions">
          {extraAction && (
            <button type="button" className="extra" onClick={() => closeUnlessFailed(extraAction.run())}>
              {extraAction.label}
            </button>
          )}
          <button type="button" onClick={() => dialog.current?.close()}>
            Cancel
          </button>
          <button type="submit" className="primary">
            {submitLabel}
          </button>
        </div>
      </form>
    </dialog>,
    document.body,
  )
}
