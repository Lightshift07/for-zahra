/**
 * The letter-opening duration in ms, read from the --envelope-duration token so
 * CSS and JS share one source of truth. It's 0 under prefers-reduced-motion.
 */
export function envelopeDurationMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--envelope-duration').trim()
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return 0
  return raw.endsWith('ms') ? n : raw.endsWith('s') ? n * 1000 : n
}
