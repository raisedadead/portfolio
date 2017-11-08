import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { TopNav, SocialNav } from './components/index';

class App extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <TopNav />
            <Col>
              <h1>mrugesh mohapatra</h1>
            </Col>
            <Col>
              <p>
                developer. music addict. open source enthusiast. noob
                photographer.
              </p>
            </Col>
            <SocialNav />
            <Col>
              <span>COPYRIGHT &copy; 2017 MRUGESH MOHAPATRA.</span>
            </Col>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
