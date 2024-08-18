/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from 'next';
import { Email } from '@/components/email';
import { MetaHead } from '@/components/head';
import Layout from '@/components/layouts';
import { cn } from '@/lib/utils';

const Refunds: NextPage = () => (
  <>
    <MetaHead pageTitle='Cancellation and Refunds Policy' />
    <Layout variant='legal'>
      <section className={cn('mb-8')}>
        <div className={cn('prose prose-lg prose-slate max-w-none')}>
          <h1
            className={cn(
              'py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900'
            )}
          >
            Cancellation and Refund Policy
          </h1>
        </div>
      </section>
      <section className={cn('mb-12')}>
        <div className={cn('mx-auto max-w-4xl')}>
          <p className={cn('pb-6 text-center text-gray-600')}>
            Last updated: Jul 1, 2024
          </p>
          <div className={cn('space-y-6')}>
            <p className={cn('text-base text-gray-700')}>
              If, for any reason, You are not completely satisfied with a
              purchase We invite You to review our policy on cancellation and
              refunds. The following terms are applicable for any products that
              You purchased with Us.
            </p>
            <h1 className={cn('text-2xl font-bold')}>
              Interpretation and Definitions
            </h1>
            <h2 className={cn('text-xl font-semibold')}>Interpretation</h2>
            <p className={cn('text-base text-gray-700')}>
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </p>
            <h2 className={cn('text-xl font-semibold')}>Definitions</h2>
            <p className={cn('text-base text-gray-700')}>
              For the purposes of this Cancellation and Refund Policy:
            </p>
            <ul className={cn('list-disc pl-5')}>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>Company</strong> (referred to as either "the Company",
                  "We", "Us" or "Our" in this Agreement) refers to Mrugesh
                  Mohapatra Co.
                </p>
              </li>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>Products</strong> refer to the items offered for sale
                  on the Service, for example: "a paid consulting session".
                </p>
              </li>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>Orders</strong> mean a request by You to purchase
                  Products from Us.
                </p>
              </li>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>Service</strong> refers to the Website.
                </p>
              </li>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>Website</strong> refers to Mrugesh Mohapatra, Co,
                  accessible from{' '}
                  <a
                    href='https://mrugesh.dev'
                    target='_blank'
                    rel='noreferrer'
                  >
                    https://mrugesh.dev
                  </a>
                </p>
              </li>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>You</strong> means the individual accessing or using
                  the Service, or the company, or other legal entity on behalf
                  of which such individual is accessing or using the Service, as
                  applicable.
                </p>
              </li>
            </ul>
            <h1 className={cn('text-2xl font-bold')}>
              Your Order Cancellation Rights
            </h1>
            <p className={cn('text-base text-gray-700')}>
              Any Products You purchase can only be cancelled and refunded in
              accordance with these Terms and Conditions.
            </p>
            <p className={cn('text-base text-gray-700')} />
            <h2 className={cn('text-xl font-semibold')}>Cancellation</h2>
            <strong className={cn('text-base text-gray-700')}>
              A Product already availed or utilized by You can not be cancelled
              or refunded.
            </strong>
            <p className={cn('text-base text-gray-700')}>
              <strong>For example:</strong> Once you have attended/completed a
              paid consulting session or similar service, you can not request a
              refund.
            </p>
            <p className={cn('text-base text-gray-700')}>
              You have 14 days from the date if purchase to request a refund,
              <strong>
                if you have NOT already availed or utilized the product.
              </strong>
              If you do not request a refund within the 14 day refund period,
              you forfeit this option and will not be eligible for a refund.
            </p>
            <p className={cn('text-base text-gray-700')}>
              In order to exercise Your right of cancellation, You must inform
              Us of your decision by means of a clear statement. You can inform
              us of your decision by:
            </p>
            <ul className={cn('list-disc pl-5')}>
              <li>
                <strong className={cn('text-base text-gray-700')}>
                  By email:{' '}
                  <span>
                    <Email />
                  </span>
                </strong>
              </li>
            </ul>
            <p className={cn('text-base text-gray-700')}>
              We will send You an acknowledgement of our decision within 7 days
              of receipt of your cancellation request.
            </p>
            <p className={cn('text-base text-gray-700')}>
              The Company reserves the right to collect{' '}
              <strong>
                a reasonable penalty of upto the full Order amount
              </strong>
              , for reasons, including but not limited to:
            </p>
            <ul className={cn('list-disc pl-5')}>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>
                    Transaction fees collected by payment providers.
                  </strong>
                </p>
              </li>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>Currency conversion fees, as applicable.</strong>
                </p>
              </li>
              <li>
                <p className={cn('text-base text-gray-700')}>
                  <strong>Taxes and other charges, paid by the Company.</strong>
                </p>
              </li>
            </ul>
            <p className={cn('text-base text-gray-700')}>
              The Company's decision on refunds shall be final and binding.
            </p>
            <h2 className={cn('text-xl font-semibold')}>Refunds</h2>
            <p className={cn('text-base text-gray-700')}>
              We process your refund in no less than 7 days from the date of
              acknowledgement of your cancellation request. The refund will be
              credited to the original payment method used to purchase the
              Product. Please note it may take longer due to delays in
              processing by your bank or card issuer, after we initiate the
              refund. Please get in touch with your bank or card issuer for more
              information in such cases.
            </p>
            <h2 className={cn('text-xl font-semibold')}>Contact Us</h2>
            <p className={cn('text-base text-gray-700')}>
              If you have any questions about our Cancellation and Refunds
              Policy, You can contact us by email:{' '}
              <span>
                <Email />
              </span>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  </>
);

export default Refunds;
