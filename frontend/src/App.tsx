import { BrowserRouter } from 'react-router-dom'

import Router from './Router'
import './assets/tailwind-generated.css'

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
