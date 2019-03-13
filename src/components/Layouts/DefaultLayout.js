import Footer from '../Footer';
import React from 'react';

class Template extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <div>
          <header>
            <p>Mrugesh Mohapatra</p>
          </header>
          <div>{children}</div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Template;
