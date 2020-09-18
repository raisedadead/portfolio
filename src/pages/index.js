import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import tw, { styled, css } from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTwitter,
  faGithub,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import BackgroundImage from 'gatsby-background-image';

import { HTMLHead } from '../components/html-head';

const dashedLinkStyle = css`
  ${tw`border-dashed border-gray-500 border-b-2 no-underline`}
`;

const HomeLayout = styled.div`
  ${tw`font-poppins antialiased w-screen h-screen mx-auto flex flex-col justify-center items-center`}
  background-color: #a0f6d2;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Crect stroke='%23a0f6d2' stroke-width='.5' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cuse fill='%239df1ce' href='%23s' y='2'/%3E%3Cuse fill='%239df1ce' href='%23s' x='1' y='2'/%3E%3Cuse fill='%239aecca' href='%23s' x='2' y='2'/%3E%3Cuse fill='%239aecca' href='%23s'/%3E%3Cuse fill='%2396e7c5' href='%23s' x='2'/%3E%3Cuse fill='%2396e7c5' href='%23s' x='1' y='1'/%3E%3C/pattern%3E%3Cpattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cg fill='%2393e2c1'%3E%3Cuse href='%23s'/%3E%3Cuse href='%23s' y='5' /%3E%3Cuse href='%23s' x='1' y='10'/%3E%3Cuse href='%23s' x='2' y='1'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='8'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='5' y='2'/%3E%3Cuse href='%23s' x='5' y='6'/%3E%3Cuse href='%23s' x='6' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cg fill='%2393e2c1'%3E%3Cuse href='%23s' y='5'/%3E%3Cuse href='%23s' y='8'/%3E%3Cuse href='%23s' x='1' y='1'/%3E%3Cuse href='%23s' x='1' y='9'/%3E%3Cuse href='%23s' x='1' y='12'/%3E%3Cuse href='%23s' x='2'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='2'/%3E%3Cuse href='%23s' x='3' y='6'/%3E%3Cuse href='%23s' x='3' y='11'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='4' y='10'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cg fill='%2390ddbd'%3E%3Cuse href='%23s' y='11'/%3E%3Cuse href='%23s' x='2' y='9'/%3E%3Cuse href='%23s' x='5' y='12'/%3E%3Cuse href='%23s' x='9' y='4'/%3E%3Cuse href='%23s' x='12' y='1'/%3E%3Cuse href='%23s' x='16' y='6'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cg fill='%23a0f6d2'%3E%3Cuse href='%23s' y='9'/%3E%3Cuse href='%23s' x='16' y='5'/%3E%3Cuse href='%23s' x='14' y='2'/%3E%3Cuse href='%23s' x='11' y='11'/%3E%3Cuse href='%23s' x='6' y='14'/%3E%3C/g%3E%3Cg fill='%238dd8b9'%3E%3Cuse href='%23s' x='3' y='13'/%3E%3Cuse href='%23s' x='9' y='7'/%3E%3Cuse href='%23s' x='13' y='10'/%3E%3Cuse href='%23s' x='15' y='4'/%3E%3Cuse href='%23s' x='18' y='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cg fill='%23f0fff4'%3E%3Cuse href='%23s' x='2' y='5'/%3E%3Cuse href='%23s' x='16' y='38'/%3E%3Cuse href='%23s' x='46' y='42'/%3E%3Cuse href='%23s' x='29' y='20'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cg fill='%23f0fff4'%3E%3Cuse href='%23s' x='33' y='13'/%3E%3Cuse href='%23s' x='27' y='54'/%3E%3Cuse href='%23s' x='55' y='55'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='scale(21.25) translate(-952.94 -714.71)'%3E%3Cg fill='%23f0fff4'%3E%3Cuse href='%23s' x='11' y='8'/%3E%3Cuse href='%23s' x='51' y='13'/%3E%3Cuse href='%23s' x='17' y='73'/%3E%3Cuse href='%23s' x='99' y='57'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23b)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23h)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23c)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23d)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23e)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23f)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23g)' width='100%25' height='100%25'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
`;

const HomeCard = ({ children }) => (
  <div
    css={css`
      ${tw`container rounded-lg bg-gray-200 w-4/5 md:w-2/3 lg:w-1/2`}
      box-shadow: 50px 50px 100px #000;
    `}
  >
    <div
      css={css`
        ${tw`text-center text-gray-700 font-bold p-4 md:p-8 md:p-12 lg:p-16`}
      `}
    >
      {children}
    </div>
  </div>
);

const Footer = styled.footer`
  ${tw`absolute bottom-0 w-screen text-gray-800 shadow-inner`}
  background: #a0f6d2;
`;

const ProfileImage = ({ className }) => (
  <StaticQuery
    query={graphql`
      query {
        profile: file(relativePath: { eq: "profile.png" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 800) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    `}
    render={(data) => (
      <BackgroundImage
        className={className}
        fluid={data?.profile?.childImageSharp?.fluid}
      />
    )}
  />
);

export const IndexMarkup = () => (
  <HomeLayout>
    <HTMLHead title="Home" />
    <HomeCard>
      <ProfileImage
        css={css`
          ${tw`rounded-full mx-auto h-32 w-32 -mt-24 mb-12 md:h-48 md:w-48 md:-mt-40 md:mb-16 lg:h-64 lg:w-64 lg:-mt-48 lg:mb-20 border-green-400 border-2`}
          box-shadow: 50px 50px 100px #000;
        `}
        alt="Mrugesh Mohapatra's profile image"
      />

      <h1
        css={css`
          ${tw`text-base md:text-4xl`}
        `}
      >
        mrugesh mohapatra
      </h1>

      <hr
        css={css`
          ${tw`mx-auto w-1/4 mt-2 mb-8 border-green-300 border-4`}
        `}
      />

      <h2
        css={css`
          ${tw`text-sm my-4 md:text-lg md:my-8`}
        `}
      >
        developer 👨‍💻 • music addict 🎸 • open source enthusiast🌟 • photography
        noob 📷 • travel 🥑
      </h2>

      <h3
        css={css`
          ${tw`text-sm my-4 md:text-lg md:my-8`}
        `}
      >
        Technology & Community,{`  `}
        <a
          css={css`
            ${dashedLinkStyle}
          `}
          href="https://www.freecodecamp.org"
          aria-label="freecodecamp.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          freeCodeCamp.org
        </a>
      </h3>

      <p
        css={css`
          ${tw`leading-loose text-xs my-8 md:text-sm md:my-8`}
        `}
      >
        Consider browsing {`  `}
        <a
          css={css`
            ${dashedLinkStyle}
          `}
          href="https://devlog.sh"
          aria-label="blog"
          target="_blank"
          rel="noopener noreferrer"
        >
          my blog 📝
        </a>
        , and buying me {` `}
        <a
          css={css`
            ${dashedLinkStyle}
          `}
          href="https://www.buymeacoffee.com/mrugesh"
          aria-label="buy me a coffee"
          target="_blank"
          rel="noopener noreferrer"
        >
          a beer 🍺
        </a>
        , if you found articles that I wrote or tools that I helped build
        useful.
      </p>
    </HomeCard>
    <Footer>
      <div
        css={css`
          ${tw`container mx-auto px-0 py-2 flex flex-col justify-center items-center md:py-4 md:flex-row md:justify-between md:w-2/3 lg:w-1/2`}
        `}
      >
        <span
          css={css`
            ${tw`mb-2 md:my-auto`}
          `}
        >
          &copy; {new Date().getFullYear()} Mrugesh Mohapatra.
        </span>
        <div
          css={css`
            ${tw`flex flex-row justify-center items-center`}
          `}
        >
          <a
            href="https://twitter.com/raisedadead"
            aria-label="twitter"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`mx-4 my-2`}
              `}
              size="lg"
              icon={faTwitter}
            />
          </a>
          <a
            href="https://github.com/raisedadead"
            aria-label="github"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`mx-4 my-2`}
              `}
              size="lg"
              icon={faGithub}
            />
          </a>
          <a
            href="https://linkedin.com/in/mrugeshm"
            aria-label="linkedin"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`mx-4 my-2`}
              `}
              size="lg"
              icon={faLinkedin}
            />
          </a>
          <a
            href="https://instagram.com/raisedadead"
            aria-label="instagram"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`mx-4 my-2`}
              `}
              size="lg"
              icon={faInstagram}
            />
          </a>
        </div>
      </div>
    </Footer>
  </HomeLayout>
);

IndexMarkup.displayName = `IndexMarkup`;
export default IndexMarkup;
