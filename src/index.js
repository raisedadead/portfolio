import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import registerServiceWorker from './registerServiceWorker'

import 'uikit/dist/css/uikit.min.css'

import App from './App'

const Main = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
        <title>mrugesh mohapatra</title>
      </Helmet>
      <App />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
