import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { TopNav, SocialNav } from './components/index'

export default class App extends Component {
  render() {
    return (
      <div className="Application">
        <Helmet>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
          <title>mrugesh mohapatra</title>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          />
        </Helmet>
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
      </div>
    )
  }
}
