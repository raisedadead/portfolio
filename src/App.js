import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { TopNav, SocialNav } from './components/index';

class App extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <header>
              <TopNav />
              <h1>mrugesh mohapatra</h1>
              <p>
                developer. music addict. open source enthusiast. noob
                photographer.
              </p>
              <SocialNav />
            </header>
            <footer>
              <span>COPYRIGHT &copy; 2017 MRUGESH MOHAPATRA.</span>
            </footer>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
