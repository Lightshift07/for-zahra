import { HashRouter, Route, Routes } from 'react-router'
import { contentProblems } from './content'
import AppShell from './layouts/AppShell'
import ContentProblems from './pages/ContentProblems'
import Home from './pages/Home'
import LetterPage from './pages/LetterPage'
import NotFound from './pages/NotFound'
import OpenOn from './pages/OpenOn'
import OpenWhen from './pages/OpenWhen'

/*
 * Hash routing (URLs look like /#/open-on): the site is pure static files, and
 * hash routing means every deep link and every home-screen launch resolves to
 * index.html on ANY host with zero rewrite rules. See CLAUDE.md → "Routing".
 * Plain <HashRouter> (not the data router): ~18 KB gz lighter. Scroll restoration
 * is our own small hook (src/lib/useScrollRestoration.ts).
 */

export default function App() {
  if (contentProblems.length) return <ContentProblems problems={contentProblems} />
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="open-when" element={<OpenWhen />} />
          <Route path="open-on" element={<OpenOn />} />
          <Route path="letter/:id" element={<LetterPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
