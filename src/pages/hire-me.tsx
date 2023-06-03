import type { NextPage } from 'next';
import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';
import { Social } from '../components/social';
import { MetaHead } from '../components/head';

const HireMe: NextPage = () => (
  <>
    <MetaHead pageTitle='Hire Me' />
    <Layout>
      <section>
        <div className='prose prose-sm prose-slate max-w-none'>
          <h1 className='py-2 text-center'>Let&apos;s work together!</h1>
          <h2>Hey there! 👋🏽</h2>
          <p>
            I work full-time as a Principal Maintainer at freeCodeCamp.org and
            help manage their cloud infrastructure and open-source platform.
          </p>
          <p>
            I&apos;ve worked for over a decade in the tech industry. I&apos;ve
            advised numerous teams and startups on platform development and
            go-to-market strategies, driving success in their projects.
          </p>
          <p>
            {new Date().getFullYear() > 2023 ? 'In 2022, ' : 'Last year, '} I
            got featured in an article by the renowned publication &quot;Insider
            Business&quot;, titled{' '}
            <Link
              className='text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
              href='https://www.businessinsider.com/cloudverse-100-top-people-building-the-next-generation-internet-2022-11'
            >
              Cloudverse 100: The people building the next generation of the
              internet
            </Link>{' '}
            for my work in the &quot;Cloud Infrastructure&quot; and
            &quot;Open-Source&quot; spaces.
          </p>
          <h3>How can I help you?</h3>
          <p>Broadly, I am happy to help you with these:</p>
          <ul className='list-none'>
            <li>
              <span>&#x1F4BB;</span> Full-stack Platform Development &amp;
              Design
            </li>
            <li>
              <span>&#x2601;</span> Cloud Infrastructure, DevOps &amp; DevSecOps
            </li>
            <li>
              <span>&#x1F310;</span> Open-Source &amp; Community Building
            </li>
            <li>
              <span>&#x1F680;</span> and more...
            </li>
          </ul>
          <p>
            Consider visiting my{' '}
            <Link
              className='text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
              href='https://linkedin.com/in/mrugeshm'
            >
              LinkedIn profile
            </Link>{' '}
            which I keep updated with the latest skills I have been gaining. I
            am a generalist and a curious technologist, never shy of learning
            new things.
          </p>
          <h3>How can we work together?</h3>
          <p>
            I am available for consulting, mentoring, and similar engagements.
            Consider booking a session with me using the button below. I have
            both free and paid sessions listed on the page.
          </p>
          <div className='flex'>
            <Link
              aria-label='Schedule a call'
              className='mx-auto w-[50%] rounded-md bg-white p-2 text-center font-medium text-black no-underline shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800'
              href='https://topmate.io/mrugesh'
              type='button'
            >
              <span className='inline-flex items-center'>Book a 1:1 Call</span>
            </Link>
          </div>
          <p>
            We can walk through your needs, and do as many follow-ups as you
            need (usually at additional no-charge). If you think we could be
            working long-term just go ahead and make an appointment using the
            same link, we can discuss the details on the same call.
          </p>
          <p>
            I am also available for speaking engagements, workshops, and
            conferences. Please reach out to me on{' '}
            <Link
              className='text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
              href='https://twitter.com/mrugeshm'
            >
              Twitter
            </Link>{' '}
            or{' '}
            <Link
              className='text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
              href='https://linkedin.com/in/mrugeshm'
            >
              LinkedIn
            </Link>{' '}
            to discuss.
          </p>
          <h4 className='mt-20 text-center'>Elsewhere on the internet</h4>
          <Social />
        </div>
      </section>
    </Layout>
  </>
);

export default HireMe;
