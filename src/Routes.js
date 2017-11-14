import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'

const LoadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>
  } else if (error) {
    // Handle the error state
    return <div>Sorry, there was a problem loading the page.</div>
  } else {
    return null
  }
}

const AsyncHome = Loadable({
  loader: () => import('./containers/Home'),
  loading: LoadingComponent
})
const AsyncResume = Loadable({
  loader: () => import('./containers/Resume'),
  loading: LoadingComponent
})
const AsyncContact = Loadable({
  loader: () => import('./containers/Contact'),
  loading: LoadingComponent
})
const AsyncNotFound = Loadable({
  loader: () => import('./containers/NotFound'),
  loading: LoadingComponent
})

export default () => (
  <Switch>
    <Route path="/" exact component={AsyncHome} />
    <Route path="/resume" exact component={AsyncResume} />
    <Route path="/contact" exact component={AsyncContact} />
    <Route component={AsyncNotFound} />
  </Switch>
)
