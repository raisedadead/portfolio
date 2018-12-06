import React from 'react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'uikit/dist/css/uikit.min.css'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

import App from './App'

import registerServiceWorker from './registerServiceWorker'

UIkit.use(Icons)
const Main = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

const rootElement = document.getElementById('root')
if (rootElement.hasChildNodes()) {
  hydrate(<Main />, rootElement)
} else {
  render(<Main />, rootElement)
}

registerServiceWorker()

export default Main
