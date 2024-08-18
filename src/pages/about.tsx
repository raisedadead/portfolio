import type { NextPage } from 'next';
import Layout from '@/components/layouts';
import Email from '@/components/email';
import { MetaHead } from '@/components/head';
import { cn } from '@/lib/utils';
import { ExpandableSection as ES } from '@/components/expandable-section';

const About: NextPage = () => (
  <>
    <MetaHead pageTitle='Legal - About & Contact' />
    <Layout variant='main'>
      <section className={cn('mb-8')}>
        <div className={cn('prose prose-lg prose-slate max-w-none')}>
          <h1
            className={cn(
              'py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900'
            )}
          >
            About & Contact
          </h1>
        </div>
      </section>
      <section className={cn('mb-12')}>
        <div className={cn('mx-auto max-w-4xl')}>
          <p
            className={cn(
              'pb-6 text-center text-lg font-medium text-slate-700'
            )}
          >
            Legal information you should be aware of.
          </p>
          <ul className={cn('list-none space-y-6')}>
            <li>
              <ES
                title='About'
                labels={[{ name: 'legal', color: 'blue' }]}
                defaultOpen={true}
              >
                <p className={cn('mb-4 text-lg')}>
                  Mrugesh Mohapatra is a software & cloud infrastructure
                  consultant, operating as a sole proprietor of{' '}
                  <strong className='font-semibold'>
                    Mrugesh Mohapatra Co.
                  </strong>{' '}
                  (&quot;the business&quot;) based in Bhubaneswar & Bengaluru,
                  India.
                </p>
                <p className={cn('text-lg')}>
                  The business is registered with Ministry of Micro Small and
                  Medium Enterprises, Government of India under the
                  &quot;Udyam&quot; scheme.
                </p>
              </ES>
            </li>
            <li>
              <ES
                title='Business, Billing & Tax'
                labels={[
                  { name: 'legal', color: 'blue' },
                  { name: 'business', color: 'green' }
                ]}
                defaultOpen={true}
              >
                <h4 className={cn('mb-4 text-center text-lg font-bold')}>
                  Udyam Registration Number: UDYAM-OD-19-0026052
                </h4>
                <p className={cn('mb-4 text-lg')}>
                  GSTIN, HSN Codes for services, PAN, and other business-related
                  information is available in the documents, such as the
                  pro-forma invoice, billing invoice, etc., sent automatically
                  on completion of a transaction. Please get in touch if you are
                  still waiting to receive them.
                </p>
                <p className={cn('text-lg')}>
                  <strong className='font-semibold'>
                    Tax details for Transactions made outside India:{' '}
                  </strong>
                  Please get in touch, we will accommodate documents where
                  feasible as per your needs.
                </p>
              </ES>
            </li>
            <li>
              <ES
                title='Contact'
                labels={[{ name: 'contact', color: 'orange' }]}
                defaultOpen={true}
              >
                <p className={cn('mb-4 text-center text-lg font-bold')}>
                  Email: <Email />
                </p>
                <div className={cn('text-center text-lg')}>
                  <p className={cn('mb-2 font-semibold')}>
                    Correspondence PO Box
                  </p>
                  <p>
                    Mrugesh Mohapatra, C/O IndianShoppre Pvt Ltd,
                    SD-15D3-240594,
                    <br />
                    #218/190, Outer Ring Road, Agara, Sector 1, H.S.R. Layout,
                    <br />
                    Bengaluru, Karnataka 560102, India
                  </p>
                </div>
              </ES>
            </li>
          </ul>
        </div>
      </section>
    </Layout>
  </>
);

export default About;
