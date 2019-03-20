import HomeContent from '../components/HomeContent';
import HtmlHead from '../components/HTMLHead';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import React from 'react';
import { graphql } from 'gatsby';

export const IndexMarkup = ({ data }) => (
  <DefaultLayout>
    <HtmlHead title="Home" />
    <main>
      <HomeContent data={data} />
    </main>
  </DefaultLayout>
);

export default IndexMarkup;

export const query = graphql`
  query {
    file(relativePath: { eq: "profile.png" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
  }
`;
