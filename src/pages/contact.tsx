import type { NextPage } from 'next';
import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';
import { Social } from '../components/social';
import Email from '../components/email';

const Blog: NextPage = () => (
  <Layout>
    <section>
      <div className='prose prose-slate max-w-none'>
        <h1 className='py-2 text-center'>Let&apos;s work together!</h1>
        <h2>Hey there! 👋🏽</h2>
        <p>
          I work full-time as the Principal Maintainer at freeCodeCamp.org and
          help manage their cloud infrastructure and open-source platform.
        </p>
        <p>
          I have extensive experience in the tech industry, spanning over 10
          years. During this time, I have guided various teams and startups on
          how to develop platforms and go-to-market strategies, enabling them to
          succeed in their projects.
        </p>
        <p>
          {new Date().getFullYear() > 2023 ? 'In 2022, ' : 'Last year, '} I got
          featured in the{' '}
          <Link href='https://www.businessinsider.com/cloudverse-100-top-people-building-the-next-generation-internet-2022-11'>
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
            <span>&#x1F4BB;</span> Full-stack Platform Development &amp; Design
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
          <Link href='https://linkedin.com/in/mrugeshm'>LinkedIn profile,</Link>{' '}
          where I keep my skills and experiences up to date. As a confident and
          curious technologist, I always seek ways to expand my knowledge and
          abilities.
        </p>
        <h3>How can we work together?</h3>
        <p>
          I am available to offer consulting, mentoring, and similar services.
          You can book a session with me by clicking the button below. On the
          page, you can find both free and paid sessions available.
        </p>
        <div className='flex'>
          <Link
            aria-label='Schedule a call'
            className='mx-auto w-[50%] rounded-md border border-solid border-orange-100 bg-orange-500 p-2 text-center font-medium text-slate-100 no-underline shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800'
            href='https://topmate.io/mrugesh'
            type='button'
          >
            Book a session
          </Link>
        </div>
        <p>
          I am here to assist you with your needs and can provide as many
          follow-ups as necessary at no additional cost. If we establish a
          long-term working relationship, feel free to schedule another
          appointment using the same link. We can discuss the specifics during
          the call.
        </p>
        <p>
          I am open to speaking engagements, workshops, and conferences. If
          you&apos;re interested, contact me on{' '}
          <Link href='https://twitter.com/mrugeshm'>Twitter</Link> or{' '}
          <Link href='https://linkedin.com/in/mrugeshm'>LinkedIn</Link> to
          discuss this.
        </p>
        <h4 className='mt-20 text-center'>Elsewhere on the internet</h4>
        <Social />
        <h4 className='mx-auto mt-16 w-[74%] border-t border-gray-400 pt-8 text-center text-gray-500'>
          Business, Billing & Tax Details
        </h4>
        <div className='mx-auto flex max-w-xl flex-col text-sm text-gray-500'>
          <p>
            <span className='font-medium'>
              For Transactions made within India:
            </span>
            <br />
            <span>
              My GSTIN and other business-related information is available in
              the documentation such as the pro-forma invoice, billing invoice,
              etc. I will email such documents to you once I have received a
              payment.
            </span>
          </p>
          <p>
            <span className='font-medium'>
              For Transactions made outside India:
            </span>
            <br />
            <span>
              Please get in touch after you make a payment and I will provide
              you with the necessary billing and tax information as per your
              needs.
            </span>
          </p>
        </div>
        <p className='mx-auto max-w-lg text-center text-sm text-gray-500'>
          You can reach me below for any queries
          <br />
          Email: <Email />
        </p>
      </div>
    </section>
  </Layout>
);

export default Blog;
