/**
 * Content API for the app. All parsing, validation, sorting and Markdown
 * rendering already happened at build time in vite/validate-content.ts, which
 * serves the result as `virtual:letters`. Nothing here parses YAML or Markdown,
 * so those libraries never ship to the browser.
 *
 * Only `import type` from ./schema here: a value import would bundle the YAML parser.
 */
import { contentProblems, media, onLetters, whenLetters } from 'virtual:letters'
import type { Letter } from './schema'

export type { Letter, OnLetter, WhenLetter, Photo, Section } from './schema'
export { isUnlocked, daysUntil, easternToday, msUntilEasternMidnight, UNLOCK_TIME_ZONE } from './unlock'

/** Already sorted by `order`, then title. */
export { whenLetters, onLetters, contentProblems }

if (contentProblems.length) console.error(contentProblems.join('\n'))

/** Resolve a media filename from frontmatter (e.g. "xmas/tree.jpg") to a servable URL. */
export function mediaUrl(file: string): string {
  const url = media[file]
  if (!url) throw new Error(`Media file not found: content/media/${file}`)
  return url
}

const byId = new Map<string, Letter>([...whenLetters, ...onLetters].map((l) => [l.id, l]))
export function getLetter(id: string): Letter | undefined {
  return byId.get(id)
}

const htmlById = new Map([...whenLetters, ...onLetters].map((l) => [l.id, l.bodyHtml]))
/**
 * Letter body as HTML (rendered from Markdown at build time). Letters are written
 * by us (trusted), so raw HTML in Markdown is allowed. Never use this for user input.
 */
export function renderBody(letter: Letter): string {
  return htmlById.get(letter.id) ?? ''
}
