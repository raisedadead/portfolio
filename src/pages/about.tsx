import type { NextPage } from 'next';
import Layout from '../components/layouts';
import Email from '../components/email';
import { MetaHead } from '../components/head';

const Blog: NextPage = () => (
  <>
    <MetaHead pageTitle='Legal - About & Contact' />
    <Layout>
      <section className='mt-10 border-2 border-black bg-blue-100 p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
        <div className='prose prose-sm max-w-none'>
          <h1 className='text-center'>About & Contact</h1>
          <h4 className='text-center'>About</h4>
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
          <h4 className='text-center'>Business, Billing & Tax</h4>
          <p className='text-center'>
            <strong>Udyam Registration Number: UDYAM-OD-19-0026052</strong>
          </p>
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
          <h4 className='text-center'>Contact</h4>
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
    </Layout>
  </>
);

export default Blog;
