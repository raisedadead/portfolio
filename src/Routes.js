import React from 'react'
import { Route, Switch } from 'react-router-dom'
import asyncComponent from './components/AsyncComponent'
import AppliedRoute from './components/AppliedRoute'

const AsyncHome = asyncComponent(() => import('./containers/Home'))
const AsyncResume = asyncComponent(() => import('./containers/Resume'))
const AsyncContact = asyncComponent(() => import('./containers/Contact'))
const AsyncNotFound = asyncComponent(() => import('./containers/NotFound'))

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />
    <AppliedRoute
      path="/resume"
      exact
      component={AsyncResume}
      props={childProps}
    />
    <AppliedRoute
      path="/contact"
      exact
      component={AsyncContact}
      props={childProps}
    />
    <Route component={AsyncNotFound} />
  </Switch>
)
