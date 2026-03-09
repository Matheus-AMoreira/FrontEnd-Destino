import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { setTokenGetter, setAuthHandlers } from './lib/api'
import { useSession } from './store/sessionStore'

setTokenGetter(() => useSession.getState().usuario?.accessToken)
setAuthHandlers(
  () => useSession.getState().checkSession(),
  () => useSession.getState().logout()
)

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
