/**
 * Vite plugin: the content pipeline.
 *
 * Reads every letter in /content/{when,on}/*.md, validates it with the rules in
 * src/content/schema.ts, renders the Markdown body to HTML, and serves the result
 * to the app as the virtual module `virtual:letters`. Parsing happens here, at
 * build time, so the YAML/Markdown parsers never ship to her phone.
 *
 *   - `vite build`: any problem aborts the build with a readable list.
 *   - `vite dev`:   problems are printed in the terminal, shown in the browser
 *                   error overlay, and exported as `contentProblems` so the app
 *                   renders a "letter needs fixing" screen. Any change under
 *                   /content (add/edit/delete) re-runs everything and reloads.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { marked } from 'marked'
import type { Plugin, ViteDevServer } from 'vite'
import {
  checkCollection,
  formatProblems,
  parseLetter,
  sortLetters,
  type Letter,
  type Section,
} from '../src/content/schema.ts'

const VIRTUAL_ID = 'virtual:letters'
const RESOLVED_ID = '\0' + VIRTUAL_ID

interface Collected {
  when: Letter[]
  on: Letter[]
  problems: string[]
}

export function validateContent(): Plugin {
  let root = process.cwd()
  let isBuild = false

  function collect(): Collected {
    const contentDir = resolve(root, 'content')
    const mediaDir = join(contentDir, 'media')
    const mediaExists = (file: string) => {
      const p = resolve(mediaDir, file)
      return p.startsWith(mediaDir + '/') && existsSync(p) && statSync(p).isFile()
    }
    const out: Collected = { when: [], on: [], problems: [] }
    for (const section of ['when', 'on'] as Section[]) {
      const dir = join(contentDir, section)
      if (!existsSync(dir)) {
        out.problems.push(`content/${section}/ folder is missing.`)
        continue
      }
      for (const name of readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
        const full = join(dir, name)
        const r = parseLetter(readFileSync(full, 'utf8'), {
          section,
          sourcePath: relative(root, full).split('\\').join('/'),
          mediaExists,
        })
        if (r.letter) out[section].push(r.letter)
        else out.problems.push(...r.problems)
      }
    }
    out.problems.push(...checkCollection([...out.when, ...out.on]))
    return out
  }

  /** Generates the JS source of `virtual:letters`. */
  function generate({ when, on, problems }: Collected): string {
    // Import only the media files letters actually use → hashed, cache-busted URLs.
    const mediaFiles = [...new Set([...when, ...on].flatMap((l) => [
      ...l.photos.map((p) => p.file),
      ...(l.voiceNote ? [l.voiceNote] : []),
    ]))].sort()
    const imports = mediaFiles.map(
      (f, i) => `import m${i} from ${JSON.stringify('/content/media/' + f + '?url')}`,
    )
    const mediaMap = `{${mediaFiles.map((f, i) => `${JSON.stringify(f)}: m${i}`).join(', ')}}`
    const withHtml = (ls: Letter[]) =>
      JSON.stringify(
        sortLetters(ls).map((l) => ({
          ...l,
          bodyHtml: marked.parse(l.body, { async: false, gfm: true, breaks: true }),
        })),
      )
    return [
      ...imports,
      `export const media = ${mediaMap}`,
      `export const whenLetters = ${withHtml(when)}`,
      `export const onLetters = ${withHtml(on)}`,
      `export const contentProblems = ${JSON.stringify(problems)}`,
    ].join('\n')
  }

  function report(server: ViteDevServer, problems: string[]) {
    if (!problems.length) return
    const message = formatProblems(problems)
    server.config.logger.error(`\n${message}\n`, { timestamp: true })
    server.ws.send({ type: 'error', err: { message, stack: '', plugin: 'validate-content' } })
  }

  return {
    name: 'validate-content',
    configResolved(config) {
      root = config.root
      isBuild = config.command === 'build'
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      const data = collect()
      if (isBuild && data.problems.length) this.error(formatProblems(data.problems))
      return generate(data)
    },
    configureServer(server) {
      const contentDir = resolve(root, 'content')
      let problems = collect().problems
      if (problems.length) server.config.logger.error(`\n${formatProblems(problems)}\n`)
      server.ws.on('connection', () => report(server, problems))
      server.watcher.add(contentDir)
      server.watcher.on('all', (_event, file) => {
        if (!resolve(file).startsWith(contentDir + '/')) return
        problems = collect().problems
        const graph = server.environments.client.moduleGraph
        const mod = graph.getModuleById(RESOLVED_ID)
        if (mod) graph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
        report(server, problems)
      })
    },
  }
}
