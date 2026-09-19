import { useEffect, useState } from 'react'
import { summary, type Night } from './night/night'

type Status = { kind: 'idle' } | { kind: 'copied' } | { kind: 'failed'; text: string }

export function CopySummary({ night }: { night: Night }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  useEffect(() => {
    if (status.kind !== 'copied') return
    const timer = window.setTimeout(() => setStatus({ kind: 'idle' }), 2000)
    return () => window.clearTimeout(timer)
  }, [status])

  const copy = async () => {
    const text = summary(night)
    try {
      await navigator.clipboard.writeText(text)
      setStatus({ kind: 'copied' })
    } catch {
      setStatus({ kind: 'failed', text })
    }
  }

  return (
    <>
      <button type="button" className="primary" onClick={copy}>
        {status.kind === 'copied' ? 'Copied!' : 'Copy summary'}
      </button>
      {status.kind === 'failed' && (
        <div className="copy-fallback">
          <p className="warning">Couldn't copy automatically. Select the text below and copy it.</p>
          <textarea readOnly value={status.text} rows={status.text.split('\n').length} onFocus={(e) => e.target.select()} />
        </div>
      )}
    </>
  )
}
