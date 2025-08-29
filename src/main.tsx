import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Error } from './pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '*',
    element: <Error />,
  },
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
