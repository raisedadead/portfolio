import React, { Component } from 'react'
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

export default class TopNav extends Component {
  render() {
    return (
      <div>
        <Navbar expand="md">
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/resume/">résumé</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/raisedadead/ama/">ama</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contact/">contact</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}
