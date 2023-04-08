import type { NextPage } from 'next';
import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';
import { Social } from '../components/social';
import Email from '../components/email';

const Blog: NextPage = () => (
  <Layout>
    <section>
      <div className='prose prose-stone max-w-none'>
        <h1 className='py-2 text-center'>Let&apos;s work together!</h1>
        <h2>Hey there! 👋🏽</h2>
        <p>
          I work full-time as the Principal Maintainer for Cloud Infrastructure
          and Open-source at freeCodeCamp.org
        </p>
        <p>
          I have spent years gaining tacit knowledge several areas. I have
          advised teams and startups in their platform development and
          go-to-market strategies.
        </p>
        <p>
          {new Date().getFullYear() > 2023 ? 'In 2022, ' : 'Last year, '} I got
          featured in the{' '}
          <Link href='https://www.businessinsider.com/cloudverse-100-top-people-building-the-next-generation-internet-2022-11'>
            Cloudverse 100: The people building the next generation of the
            internet
          </Link>{' '}
          for my work in the Cloud Infrastructure and Open-Source space.
        </p>
        <h3>How can I help you?</h3>
        <p>I am happy to help you with any of the following:</p>
        <ul className='list-none'>
          <li>
            <span>&#x1F4BB;</span> Software Development
          </li>
          <li>
            <span>&#x2601;</span> Cloud Infrastructure, DevOps &amp; DevSecOps
          </li>
          <li>
            <span>&#x1F310;</span> Open-Source &amp; Community building
          </li>
          <li>
            <span>&#x1F680;</span> and more...
          </li>
        </ul>
        <p>
          Consider visiting my{' '}
          <Link href='https://linkedin.com/in/mrugeshm'>LinkedIn profile</Link>{' '}
          which I keep updated with the latest skills I have been gaining.
        </p>
        <h3>How can we work together?</h3>
        <p>
          Please consider booking a slot to receive consulting or mentoring for
          your project using the button below. There are free and paid options
          available.
        </p>
        <div className='flex'>
          <Link
            aria-label='Schedule a call'
            className='mx-auto w-[50%] rounded-md bg-orange-500 p-2 text-center font-medium text-slate-100 no-underline backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800'
            href='https://topmate.io/mrugesh'
            type='button'
          >
            Book a session
          </Link>
        </div>
        <p>
          We can walk through your needs, and do as many follow-ups as you need
          (usually at additional no-charge). If you think we could be working
          long-term just go ahead and make an appointment using the same link,
          we can discuss the details on the same call.
        </p>
        <p>
          I am also available for speaking engagements, workshops, and
          conferences. Please reach out to me on{' '}
          <Link href='https://twitter.com/mrugeshm'>Twitter</Link> or{' '}
          <Link href='https://linkedin.com/in/mrugeshm'>LinkedIn</Link> to
          discuss.
        </p>
        <h4 className='mt-20 text-center'>Elsewhere on the internet</h4>
        <Social />
        <h4 className='mt-10 text-center'>Business, Billing & Tax Details</h4>
        <p className='mx-auto max-w-xl text-center text-sm'>
          <span className='font-bold'>
            [For Transactions made within India]
          </span>{' '}
          <br />
          Details like GSTIN or other business-related information are available
          in the documentation such as the pro-forma invoice, billing invoice,
          etc. that I sent you on your email you provided.
        </p>
        <p className='mx-auto max-w-lg text-center text-sm'>
          <span className='font-bold'>
            [For Transactions made outside India]
          </span>{' '}
          <br />
          Get in touch if you need any details like tax and billing information.
          I will be happy to provide you with the same.
        </p>
        <p className='mx-auto max-w-lg text-center text-sm'>
          You can reach me below for such queries
          <br />
          Email: <Email />
        </p>
      </div>
    </section>
  </Layout>
);

export default Blog;
