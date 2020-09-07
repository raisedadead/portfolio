import React, { useEffect, useState } from 'react';
import tw, { styled, css } from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTwitter,
  faGithub,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';

const FourOhFourLayout = styled.div`
  ${tw`font-poppins antialiased container w-screen min-h-screen mx-auto flex flex-col justify-center items-center`}
`;

const Footer = styled.footer`
  ${tw`bottom-0 w-screen text-gray-800 shadow-inner`}
  background: #a0f6d2;
`;

export const FourOhFourMarkup = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const query = `{
      user(username: "raisedadead") {
        publication {
          posts(page: 0) {
            title
            brief
            slug
            cuid
          }
        }
      }
    }`;

    async function fetchPosts() {
      const response = await fetch(`https://api.hashnode.com`, {
        method: `post`,
        headers: {
          'Content-Type': `application/json`
        },
        body: JSON.stringify({ query: query })
      });
      const results = await response.json();
      const fetchedPosts = results?.data?.user?.publication?.posts;
      console.log(`posts retrieved: `, fetchedPosts);
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);

  return (
    <FourOhFourLayout>
      <main
        css={css`
          ${tw`flex-grow mb-8`}
        `}
      >
        <div
          css={css`
            ${tw`text-center text-gray-700 font-bold p-8 md:p-12 lg:p-16`}
          `}
        >
          <h1
            css={css`
              ${tw`text-2xl md:text-4xl mb-8`}
            `}
          >
            404 | Page not found.
          </h1>

          <p
            css={css`
              ${tw`text-base mb-8`}
            `}
          >
            Uh - Oh! Apologies, looks like the something you were looking for
            has been lost to oblivion.
          </p>

          <a href="/" aria-label="home">
            <button
              css={css`
                ${tw`bg-green-400 hover:bg-green-400 text-white font-bold py-2 px-4 rounded`}
              `}
            >
              <FontAwesomeIcon
                css={css`
                  ${tw`mr-4`}
                `}
                size="lg"
                icon={faArrowLeft}
              />
              Take me home.
            </button>
          </a>
        </div>
        <div
          css={css`
            ${tw`container w-3/4 mx-auto px-0 py-2`}
          `}
        >
          {posts?.length ? (
            <div>
              <h2
                css={css`
                  ${tw`text-gray-700 font-bold`}
                `}
              >
                Some interesting reads from my blog:
              </h2>

              <ul>
                {posts.map((post) => (
                  <li key={post.cuid}>
                    <div
                      css={css`
                        ${tw`text-gray-700 text-lg mt-4 mb-2`}
                      `}
                    >
                      <a
                        css={css`
                          ${tw`border-dashed border-gray-500 border-b-2 no-underline`}
                        `}
                        href={`https://devlog.sh/${post.slug}`}
                        aria-label={post.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.title}.
                      </a>
                    </div>

                    <p
                      css={css`
                        ${tw`leading-loose text-gray-600 text-xs md:text-sm`}
                      `}
                    >
                      {post.brief}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <div
                css={css`
                  ${tw`text-gray-700 text-xl mt-4 mb-2`}
                `}
              >
                <Skeleton />
              </div>

              <p
                css={css`
                  ${tw`text-gray-600 text-base`}
                `}
              >
                <Skeleton count={3} />
              </p>
            </div>
          )}
        </div>
      </main>
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
                  ${tw`ml-4`}
                `}
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
                  ${tw`ml-4`}
                `}
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
                  ${tw`ml-4`}
                `}
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
                  ${tw`ml-4`}
                `}
                icon={faInstagram}
              />
            </a>
          </div>
        </div>
      </Footer>
    </FourOhFourLayout>
  );
};

FourOhFourMarkup.displayName = `FourOhFourMarkup`;
export default FourOhFourMarkup;
