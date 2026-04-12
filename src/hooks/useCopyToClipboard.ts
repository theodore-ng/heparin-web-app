import { useState, useCallback } from 'react'

/**
 * Custom hook that copies text to clipboard with automatic fallback
 * for non-secure contexts (HTTP). Returns [copied, copyFn].
 */
export function useCopyToClipboard(timeoutMs = 2000): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (text: string) => {
      const onSuccess = () => {
        setCopied(true)
        setTimeout(() => setCopied(false), timeoutMs)
      }

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
          fallbackCopy(text)
          onSuccess()
        })
      } else {
        fallbackCopy(text)
        onSuccess()
      }
    },
    [timeoutMs],
  )

  return [copied, copy]
}

/** Fallback for non-secure contexts (HTTP, older browsers) */
function fallbackCopy(text: string) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}
