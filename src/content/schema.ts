/**
 * Letter schema + validation.
 *
 * This file is PURE: no `import.meta`, no `fs`, no DOM. It runs at BUILD TIME in
 *   - the Vite plugin (vite/validate-content.ts), which serves `virtual:letters`.
 * The browser only imports its TYPES (src/content/index.ts), never its code,
 * so the YAML parser never ships to the phone.
 */
import { parse as parseYaml } from 'yaml'

export type Section = 'when' | 'on'

/** Optional full-screen effect shown once a letter is open. */
export const THEMES = ['christmas', 'valentines', 'new-year'] as const
export type Theme = (typeof THEMES)[number]

export interface Photo {
  /** Filename relative to /content/media/, e.g. "christmas-2026/tree.jpg" */
  file: string
  /** Alt text for screen readers. null = author didn't provide one (UI falls back to a generic label). */
  alt: string | null
}

interface LetterBase {
  id: string
  section: Section
  title: string
  teaser: string
  order: number
  photos: Photo[]
  /** Filename relative to /content/media/, or null. */
  voiceNote: string | null
  /** Optional effect once the letter is open: snow + snowman, floating hearts, or fireworks. */
  theme: Theme | null
  /** Raw Markdown body (everything after the frontmatter). */
  body: string
  /** Project-relative path of the source file, for error messages. */
  sourcePath: string
}

export interface WhenLetter extends LetterBase {
  section: 'when'
}

export interface OnLetter extends LetterBase {
  section: 'on'
  /** "YYYY-MM-DD" (unlocks at local midnight on that day), or null = date TBD (stays locked). */
  unlockDate: string | null
}

export type Letter = WhenLetter | OnLetter

export const TEASER_MAX = 90
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const AUDIO_EXT = /\.(m4a|mp3|aac|ogg|oga|opus|wav|webm)$/i
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i

const ALLOWED_KEYS: Record<Section, readonly string[]> = {
  when: ['id', 'title', 'teaser', 'order', 'photos', 'voiceNote', 'theme'],
  on: ['id', 'title', 'teaser', 'order', 'unlockDate', 'photos', 'voiceNote', 'theme'],
}

export class ContentError extends Error {
  readonly problems: string[]
  constructor(problems: string[]) {
    super(formatProblems(problems))
    this.name = 'ContentError'
    this.problems = problems
  }
}

export function formatProblems(problems: string[]): string {
  return [
    `💌 ${problems.length} problem${problems.length === 1 ? '' : 's'} found in /content letters:`,
    '',
    ...problems.map((p) => `  • ${p}`),
    '',
    'Fix the file(s) above — see CLAUDE.md → "How to add a letter".',
  ].join('\n')
}

/** True if `s` is a real calendar date in YYYY-MM-DD form (rejects 2027-02-30). */
export function isValidIsoDate(s: string): boolean {
  const m = DATE_PATTERN.exec(s)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

/** Splits "---\nyaml\n---\nbody" into its parts. Returns null if there is no frontmatter block. */
function splitFrontmatter(raw: string): { yaml: string; body: string } | null {
  const text = raw.replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  const m = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/.exec(text)
  return m ? { yaml: m[1], body: m[2] } : null
}

export interface ParseContext {
  section: Section
  /** Project-relative path, e.g. "content/when/sad.md". */
  sourcePath: string
  /** Returns true if a file exists at /content/media/<file>. */
  mediaExists: (file: string) => boolean
}

/**
 * Parses + validates one letter file. Never throws: returns either the letter
 * or a list of human-readable problems (each prefixed with the file path).
 */
export function parseLetter(
  raw: string,
  ctx: ParseContext,
): { letter: Letter; problems: [] } | { letter: null; problems: string[] } {
  const { section, sourcePath } = ctx
  const problems: string[] = []
  const fail = (msg: string) => problems.push(`${sourcePath}: ${msg}`)

  const parts = splitFrontmatter(raw)
  if (!parts) {
    fail('missing frontmatter. The file must start with a line containing only "---", then the fields, then another "---".')
    return { letter: null, problems }
  }

  let data: unknown
  try {
    data = parseYaml(parts.yaml)
  } catch (e) {
    fail(`frontmatter is not valid YAML — ${(e as Error).message.split('\n')[0]} Tip: if a value contains ": " or starts with a quote/#/*, wrap the whole value in double quotes.`)
    return { letter: null, problems }
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    fail('frontmatter must be a list of "key: value" fields.')
    return { letter: null, problems }
  }
  const fm = data as Record<string, unknown>

  // Unknown keys are almost always typos ("teasr", "unlock_date") — reject them.
  for (const key of Object.keys(fm)) {
    if (!ALLOWED_KEYS[section].includes(key)) {
      const hint =
        key === 'unlockDate' && section === 'when'
          ? ' "Open When" letters are always open — move this file to content/on/ if it should be date-locked.'
          : ` Allowed fields: ${ALLOWED_KEYS[section].join(', ')}.`
      fail(`unknown field "${key}".${hint}`)
    }
  }

  // id
  const fileStem = sourcePath.split('/').pop()!.replace(/\.md$/, '')
  const id = fm.id
  if (typeof id !== 'string' || !ID_PATTERN.test(id)) {
    fail(`"id" must be lowercase-kebab-case text like "miss-me" (got ${JSON.stringify(id)}).`)
  } else if (id !== fileStem) {
    fail(`"id" ("${id}") must match the filename ("${fileStem}.md").`)
  }

  // title / teaser
  const title = fm.title
  if (typeof title !== 'string' || !title.trim()) fail('"title" is required and must be text.')
  const teaser = fm.teaser
  if (typeof teaser !== 'string' || !teaser.trim()) {
    fail('"teaser" is required and must be text (the short line shown on the card).')
  } else if (teaser.trim().length > TEASER_MAX) {
    fail(`"teaser" is ${teaser.trim().length} characters; keep it to ${TEASER_MAX} or fewer so it fits on the card.`)
  }

  // order
  const order = fm.order
  if (typeof order !== 'number' || !Number.isFinite(order)) {
    fail(`"order" is required and must be a number (got ${JSON.stringify(order)}).`)
  }

  // unlockDate (on only — must be present, may be null)
  let unlockDate: string | null = null
  if (section === 'on') {
    if (!('unlockDate' in fm)) {
      fail('"unlockDate" is required for Open On letters. Use a date like 2026-12-25, or null if the date is not known yet.')
    } else if (fm.unlockDate === null) {
      unlockDate = null
    } else if (typeof fm.unlockDate !== 'string' || !isValidIsoDate(fm.unlockDate)) {
      fail(`"unlockDate" must be a real date written YYYY-MM-DD (e.g. 2027-02-14) or null (got ${JSON.stringify(fm.unlockDate)}).`)
    } else {
      unlockDate = fm.unlockDate
    }
  }

  // photos
  const photos: Photo[] = []
  if (fm.photos !== undefined && fm.photos !== null) {
    if (!Array.isArray(fm.photos)) {
      fail('"photos" must be a list, e.g.\n      photos:\n        - beach.jpg')
    } else {
      fm.photos.forEach((p, i) => {
        let file: unknown
        let alt: unknown = null
        if (typeof p === 'string') file = p
        else if (p && typeof p === 'object' && !Array.isArray(p)) {
          const obj = p as Record<string, unknown>
          file = obj.file
          alt = obj.alt ?? null
          const extra = Object.keys(obj).filter((k) => k !== 'file' && k !== 'alt')
          if (extra.length) fail(`photos[${i}] has unknown field(s): ${extra.join(', ')}. Use "file" and "alt".`)
        }
        if (typeof file !== 'string' || !file.trim()) {
          fail(`photos[${i}] must be a filename, or { file: name.jpg, alt: "description" }.`)
          return
        }
        if (alt !== null && typeof alt !== 'string') fail(`photos[${i}].alt must be text.`)
        if (!IMAGE_EXT.test(file)) fail(`photos[${i}] "${file}" is not an image (jpg, png, webp, avif, gif, svg).`)
        else if (!ctx.mediaExists(file)) fail(`photos[${i}] "${file}" was not found in content/media/.`)
        photos.push({ file, alt: typeof alt === 'string' ? alt : null })
      })
    }
  }

  // voiceNote
  let voiceNote: string | null = null
  if (fm.voiceNote !== undefined && fm.voiceNote !== null) {
    if (typeof fm.voiceNote !== 'string' || !fm.voiceNote.trim()) {
      fail('"voiceNote" must be a filename like "goodnight.m4a".')
    } else if (!AUDIO_EXT.test(fm.voiceNote)) {
      fail(`"voiceNote" "${fm.voiceNote}" is not a supported audio file (m4a, mp3, aac, ogg, opus, wav, webm).`)
    } else if (!ctx.mediaExists(fm.voiceNote)) {
      fail(`"voiceNote" "${fm.voiceNote}" was not found in content/media/.`)
    } else {
      voiceNote = fm.voiceNote
    }
  }

  // theme
  let theme: Theme | null = null
  if (fm.theme !== undefined && fm.theme !== null) {
    if (typeof fm.theme !== 'string' || !(THEMES as readonly string[]).includes(fm.theme)) {
      fail(`"theme" must be one of: ${THEMES.join(', ')} (got ${JSON.stringify(fm.theme)}).`)
    } else {
      theme = fm.theme as Theme
    }
  }

  // body
  const body = parts.body.trim()
  if (!body) fail('the letter has no message. Write it below the closing "---".')

  if (problems.length) return { letter: null, problems }

  const base = {
    id: id as string,
    title: (title as string).trim(),
    teaser: (teaser as string).trim(),
    order: order as number,
    photos,
    voiceNote,
    theme,
    body,
    sourcePath,
  }
  const letter: Letter =
    section === 'on' ? { ...base, section: 'on', unlockDate } : { ...base, section: 'when' }
  return { letter, problems: [] }
}

/** Cross-file checks: ids must be unique across BOTH sections. */
export function checkCollection(letters: Letter[]): string[] {
  const problems: string[] = []
  const seen = new Map<string, string>()
  for (const l of letters) {
    const prev = seen.get(l.id)
    if (prev) problems.push(`${l.sourcePath}: id "${l.id}" is already used by ${prev}. Ids must be unique.`)
    else seen.set(l.id, l.sourcePath)
  }
  return problems
}

/**
 * Display order.
 *   - Open When: by `order`, then title.
 *   - Open On: by unlockDate, earliest first; "date TBD" (null) letters last.
 *     `order` only breaks ties (same date, or several TBD letters), then title.
 */
export function sortLetters<T extends Letter>(letters: T[]): T[] {
  return [...letters].sort((a, b) => {
    if (a.section === 'on' && b.section === 'on' && a.unlockDate !== b.unlockDate) {
      if (a.unlockDate === null) return 1
      if (b.unlockDate === null) return -1
      return a.unlockDate < b.unlockDate ? -1 : 1
    }
    return a.order - b.order || a.title.localeCompare(b.title)
  })
}
