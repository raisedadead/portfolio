import type { NextPage } from 'next';
import Layout from '../components/layouts';
import Email from '../components/email';

const Blog: NextPage = () => (
  <Layout>
    <section>
      <div className='prose prose-sm max-w-none'>
        <h1 className='text-center'>About and Contact</h1>
        <h4 className='text-center'>About</h4>
        <p>
          Mrugesh Mohapatra is a software & cloud infrastructure consultant,
          operating as a sole proprietor of{' '}
          <strong>Mrugesh Mohapatra Co.</strong> (&quot;the business&quot;)
          based in Bhubaneswar & Bengaluru, India.
        </p>
        <p>
          The business is registered under the &quot;Udyam&quot; scheme from
          Ministry of Micro Small and Medium Enterprises, Government of India.
        </p>
        <h4 className='text-center'>Business, Billing & Tax</h4>
        <p className='text-center'>
          <strong>Udyam Registration Number: UDYAM-OD-19-0026052</strong>
        </p>
        <p>
          <strong>Tax details for Transactions made within India:</strong>
          <br />
          <span>
            My GSTIN and other business-related information is available in the
            documentation such as the pro-forma invoice, billing invoice, etc. I
            will email such documents to you once I have received a payment.
          </span>
        </p>
        <p>
          <strong>Tax details for Transactions made outside India:</strong>
          <br />
          <span>
            Please get in touch after you make a payment and I will provide you
            with the necessary billing and tax information as per your needs.
          </span>
        </p>
        <h4 className='text-center'>Contact</h4>
        <p className='text-center'>
          <strong>Email</strong>
          <br />
          <Email />
        </p>
        <p className='text-center'>
          <strong>Correspondence PO Box</strong>
          <br />
          Mrugesh Mohapatra, C/O IndianShoppre Pvt Ltd, SD-15D3-240594,
          #218/190, Outer Ring Road, Agara, Sector 1, H.S.R. Layout, Bengaluru,
          Karnataka 560102, India
        </p>
      </div>
    </section>
  </Layout>
);

export default Blog;
