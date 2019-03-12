import AllSitePages from '../components/allsitepages'
import Footer from '../components/footer'
import React from 'react'
import { css } from '@emotion/core'
import { rhythm } from '../utils/typography'

class Template extends React.Component {
  render() {
    const { children } = this.props
    return (
      <>
        <div
          css={css`
          display:flex;
          flex-direction:column;
          height:100%;
          min-height:100vh;
        `}>
          <div css={css`
            flex-basis: auto;
            flex-grow: 1;
            header {
              border-bottom: solid 1px;
              padding: ${rhythm(2)};
            }
            main {
              flex-grow:1;
              padding: ${rhythm(2)};
            }
          `}>
             <header>
              <h1>Mrugesh Mohapatra</h1>
            </header>
            <div css={css`
              @media all and (min-width: 768px) {
                display:flex;
              }
            `}>
              <div className='nav' css={css`
                border-left: solid 1px;
                order:2;
                padding: ${rhythm(2)};
                width:20vw;
                min-width:330px;
                nav ul {
                  list-style:none;
                  margin:0;
                }
              `}>
                <AllSitePages />
              </div>
              {children}
            </div>
          </div>
          <Footer css={css`
            flex:none;
            border-top: solid 1px;
            padding: ${rhythm(2)};
            font-size: 75%;
            text-align: center;
          `} />
        </div>
      </>
    )
  }
}

export default Template
