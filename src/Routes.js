import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Home, Resume, Contact } from './containers'

export default () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/resume" exact component={Resume} />
    <Route path="/contact" exact component={Contact} />
  </Switch>
)
