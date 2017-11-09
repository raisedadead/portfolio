import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import 'uikit/dist/css/uikit.min.css'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

import { Head } from './components'
import App from './App'

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

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
