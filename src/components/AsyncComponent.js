import React, { Component } from 'react'
import { DoubleBounce } from 'better-react-spinkit'
import { StylesHelper } from './Utils'

const content = StylesHelper('uk-position-center', 'uk-text-center')
export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)
      this.state = { component: null }
    }

    async componentDidMount() {
      const { default: component } = await importComponent()
      this.setState({ component: component })
    }

    render() {
      const C = this.state.component
      return C ? (
        <C {...this.props} />
      ) : (
        <DoubleBounce size={50} className={content} />
      )
    }
  }

  return AsyncComponent
}
