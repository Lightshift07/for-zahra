import { createHashRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
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
 */
const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'open-when', element: <OpenWhen /> },
      { path: 'open-on', element: <OpenOn /> },
      { path: 'letter/:id', element: <LetterPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  if (contentProblems.length) return <ContentProblems problems={contentProblems} />
  return <RouterProvider router={router} />
}
