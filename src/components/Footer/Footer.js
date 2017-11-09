import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <span>
          Copyright &copy; {new Date().getFullYear()} Mrugesh Mohapatra.
        </span>
      </footer>
    )
  }
}
