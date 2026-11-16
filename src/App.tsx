import { HashRouter, Route, Routes } from 'react-router'
import { contentProblems } from './content'
import ContentProblems from './pages/ContentProblems'
import Home from './pages/Home'

/*
 * HashRouter (URLs look like /#/open-on): the site is pure static files, and hash
 * routing means every deep link and every home-screen launch resolves to
 * index.html on ANY host with zero rewrite rules. See CLAUDE.md → "Routing".
 */
export default function App() {
  if (contentProblems.length) return <ContentProblems problems={contentProblems} />
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Planned: /open-when, /open-on, /letter/:id */}
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}
