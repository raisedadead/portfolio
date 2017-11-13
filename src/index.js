import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'uikit/dist/css/uikit.min.css'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

import { Head } from './components'
import App from './App'

import registerServiceWorker from './registerServiceWorker'

// loads the Icon plugin
UIkit.use(Icons)

const Main = () => {
  return (
    <div>
      <Head />
      <App />
    </div>
  )
}

ReactDOM.render(
  <Router>
    <Main />
  </Router>,
  document.getElementById('root')
)
registerServiceWorker()
