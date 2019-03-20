import React from 'react';
import renderer from 'react-test-renderer';

import { PureHomeContent as HomeContent } from '../HomeContent';

describe(`HomeContent`, () => {
  it(`renders correctly`, () => {
    const data = {
      profileImage: {
        childImageSharp: {
          fluid: {
            tracedSVG: `random-2b80985b4264e4cb34b1850de91c6911`,
            aspectRatio: 1,
            src: `random-2b80985b4264e4cb34b1850de91c6911`,
            srcSet: `random-2b80985b4264e4cb34b1850de91c6911`,
            srcWebp: `random-2b80985b4264e4cb34b1850de91c6911`,
            srcSetWebp: `random-2b80985b4264e4cb34b1850de91c6911`,
            sizes: `(max-width: 300px) 100vw, 300px`
          }
        }
      }
    };
    const tree = renderer.create(<HomeContent data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
