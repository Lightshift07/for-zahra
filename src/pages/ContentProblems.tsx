/** Full-screen list of content validation problems (dev only in practice — the build refuses to ship them). */
export default function ContentProblems({ problems }: { problems: string[] }) {
  return (
    <main role="alert" style={{ padding: 'var(--space-5) var(--gutter)', maxWidth: '48rem', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>A letter needs fixing</h1>
      <ul>
        {problems.map((p) => (
          <li key={p} style={{ whiteSpace: 'pre-wrap', marginBottom: 'var(--space-3)' }}>
            {p}
          </li>
        ))}
      </ul>
      <p>See CLAUDE.md → “How to add a letter”.</p>
    </main>
  )
}
