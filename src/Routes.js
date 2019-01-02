import React from 'react'
import { Route, Switch } from 'react-router-dom'

import withTracker from './withTracker'
import { Home, Resume, Contact, NotFound } from './containers'

export default () => (
  <Switch>
    <Route path="/" exact component={withTracker(Home)} />
    <Route path="/resume" exact component={withTracker(Resume)} />
    <Route path="/contact" exact component={withTracker(Contact)} />
    <Route component={NotFound} />
  </Switch>
)
