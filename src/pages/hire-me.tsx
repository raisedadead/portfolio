import type { NextPage } from 'next';
import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';
import { MetaHead } from '../components/head';
import { Social } from '../components/social';

const HireMe: NextPage = () => (
  <>
    <MetaHead pageTitle='Hire Me' />
    <Layout>
      <section>
        <div className='prose prose-sm prose-slate max-w-none'>
          <h1 className='py-2 text-center font-bold text-slate-700'>
            Let&apos;s work together!
          </h1>
        </div>
      </section>
      <section>
        <div className='prose prose-sm prose-slate max-w-none'>
          <p className='text-center text-slate-500'>
            Seriously, get in touch. I am happy to help.
          </p>
        </div>
      </section>
      <section className='mt-10 border-2 border-black bg-fuchsia-100 p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
        <div className='prose prose-sm prose-slate max-w-none'>
          <h3 className='font-bold text-slate-700'>Hey there! 👋🏽</h3>
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
          <h3 className='font-bold text-slate-700'>How can I help you?</h3>
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
          <h3 className='font-bold text-slate-700'>
            How can we work together?
          </h3>
          <p>
            I am available for consulting, mentoring, and similar engagements.
            Consider booking a session with me using the button below. I have
            both free and paid sessions listed on the page.
          </p>
          <div className='flex'>
            <Link
              aria-label='Schedule a call'
              className='mx-auto w-[50%] border-2 border-black bg-white p-2.5 text-center text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
              href='https://topmate.io/mrugesh'
              type='button'
            >
              <span className='inline-flex items-center'>Get in touch!</span>
            </Link>
          </div>
          <p>
            We can walk through your needs, and do as many follow-ups as you
            need (usually at no additional fees). If you think we could be
            working long-term just go ahead and make an appointment using the
            same link, we can discuss the details on the call.
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
        </div>
      </section>
      <section>
        <div className='prose prose-sm prose-slate mt-4 max-w-none'>
          <h4 className='text-center font-bold text-slate-700'>
            Elsewhere on the internet
          </h4>
          <Social />
        </div>
      </section>
    </Layout>
  </>
);

export default HireMe;
