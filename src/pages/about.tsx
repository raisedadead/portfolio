import type { NextPage } from 'next';
import Layout from '@/components/layouts';
import Email from '@/components/email';
import { MetaHead } from '@/components/head';
import { Social } from '@/components/social';

const About: NextPage = () => (
  <>
    <MetaHead pageTitle='Legal - About & Contact' />
    <Layout>
      <section>
        <div className='prose prose-sm prose-slate max-w-none'>
          <h1 className='py-2 text-center font-bold text-slate-700'>
            About & Contact
          </h1>
        </div>
      </section>
      <section>
        <div className='prose prose-sm prose-slate max-w-none'>
          <p className='text-center text-slate-500'>
            Legal stuff that you should know about.
          </p>
        </div>
      </section>
      <section className='mt-10 border-2 border-black bg-blue-100 p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
        <div className='prose prose-sm prose-slate max-w-none'>
          <h3 className='text-center font-bold text-slate-700'>About</h3>
          <p>
            Mrugesh Mohapatra is a software & cloud infrastructure consultant,
            operating as a sole proprietor of{' '}
            <strong>Mrugesh Mohapatra Co.</strong> (&quot;the business&quot;)
            based in Bhubaneswar & Bengaluru, India.
          </p>
          <p>
            The business is registered with Ministry of Micro Small and Medium
            Enterprises, Government of India under the &quot;Udyam&quot; scheme.
          </p>
          <h3 className='text-center font-bold text-slate-700'>
            Business, Billing & Tax
          </h3>
          <h4 className='text-center font-bold text-slate-700'>
            <strong>Udyam Registration Number: UDYAM-OD-19-0026052</strong>
          </h4>
          <p>
            <span>
              GSTIN, HSN Codes for services, PAN, and other business-related
              information is available in the documents, such as the pro-forma
              invoice, billing invoice, etc., sent automatically on completion
              of a transaction. Please get in touch if you are still waiting to
              receive them.
            </span>
          </p>
          <p>
            <strong>Tax details for Transactions made outside India: </strong>
            <span>
              Please get in touch, we will accomodate documents where feasible
              as per your needs.
            </span>
          </p>
          <h3 className='text-center font-bold text-slate-700'>Contact</h3>
          <p className='text-center'>
            <strong>
              Email: <Email />
              <br />
              Text: +91 7799259952 (WhatsApp, Telegram, etc. only)
            </strong>
          </p>
          <p className='text-center'>
            <strong>Correspondence PO Box</strong>
            <br />
            Mrugesh Mohapatra, C/O IndianShoppre Pvt Ltd, SD-15D3-240594,
            #218/190, Outer Ring Road, Agara, Sector 1, H.S.R. Layout,
            Bengaluru, Karnataka 560102, India
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

export default About;
