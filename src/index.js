import React from 'react'
import ReactDOM from 'react-dom'
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

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()

export default Main
