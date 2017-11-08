import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/fontawesome-free-solid';

export default class TopNav extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar expand="md">
          <NavbarBrand href="/">
            <FontAwesomeIcon icon={faHome} />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/resume/">résumé</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/raisedadead/ama/">
                  ama
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/contact/">contact</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
