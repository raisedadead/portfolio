/* eslint-disable react/no-unescaped-entities */
import { FC } from 'react';
import { Email } from '../../components/email';
import { Footer } from '../../components/footer';

const Refunds = async (): Promise<ReturnType<FC>> => {
  return (
    <main className="hover:prose-a:text-gray-900; prose prose-sm prose-gray my-auto mx-auto max-w-4xl p-16 px-4 text-gray-700 prose-a:text-gray-500">
      <h1>Cancellation and Refund Policy</h1>
      <p>Last updated: Nov 11, 2022</p>
      <p>
        If, for any reason, You are not completely satisfied with a purchase We
        invite You to review our policy on cancellation and refunds. The
        following terms are applicable for any products that You purchased with
        Us.
      </p>
      <h1>Interpretation and Definitions</h1>
      <h2>Interpretation</h2>
      <p>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </p>
      <h2>Definitions</h2>
      <p>For the purposes of this Cancellation and Refund Policy:</p>
      <ul>
        <li>
          <p>
            <strong>Company</strong> (referred to as either "the Company", "We",
            "Us" or "Our" in this Agreement) refers to Mrugesh Mohapatra Co.
          </p>
        </li>
        <li>
          <p>
            <strong>Products</strong> refer to the items offered for sale on the
            Service, for example: "a paid consulting session".
          </p>
        </li>
        <li>
          <p>
            <strong>Orders</strong> mean a request by You to purchase Products
            from Us.
          </p>
        </li>
        <li>
          <p>
            <strong>Service</strong> refers to the Website.
          </p>
        </li>
        <li>
          <p>
            <strong>Website</strong> refers to Mrugesh Mohapatra, Co, accessible
            from{' '}
            <a href="https://mrugesh.dev" target="_blank" rel="noreferrer">
              https://mrugesh.dev
            </a>
          </p>
        </li>
        <li>
          <p>
            <strong>You</strong> means the individual accessing or using the
            Service, or the company, or other legal entity on behalf of which
            such individual is accessing or using the Service, as applicable.
          </p>
        </li>
      </ul>
      <h1>Your Order Cancellation Rights</h1>
      <p>
        Any Products You purchase can only be cancelled and refunded in
        accordance with these Terms and Conditions.
      </p>
      <p />
      <h2>Cancellation</h2>
      <strong>
        A Product already availed or utilized by You can not be cancelled or
        refunded.
      </strong>
      <p>
        <strong>For example:</strong> Once you have attended/completed a paid
        consulting session or similar service, you can not request a refund.
      </p>
      <p>
        You have 14 days from the date if purchase to request a refund,
        <strong>
          if you have NOT already availed or utilized the product.
        </strong>
        If you do not request a refund within the 14 day refund period, you
        forfeit this option and will not be eligible for a refund.
      </p>
      <p>
        In order to exercise Your right of cancellation, You must inform Us of
        your decision by means of a clear statement. You can inform us of your
        decision by:
      </p>
      <ul>
        <li>
          <strong>
            By email:{' '}
            <span>
              <Email />
            </span>
          </strong>
        </li>
      </ul>
      <p>
        We will send You an acknowledgement of our decision within 7 days of
        receipt of your cancellation request.
      </p>
      <p>
        The Company reserves the right to collect{' '}
        <strong>a reasonable penalty of upto the full Order amount</strong>, for
        reasons, including but not limited to:
      </p>
      <ul>
        <li>
          <p>
            <strong>Transaction fees collected by payment providers.</strong>
          </p>
        </li>
        <li>
          <p>
            <strong>Currency conversion fees, as applicable.</strong>
          </p>
        </li>
        <li>
          <p>
            <strong>Taxes and other charges, paid by the Company.</strong>
          </p>
        </li>
      </ul>
      <p>The Company's decision on refunds shall be final and binding.</p>
      <h2>Refunds</h2>
      <p>
        We process your refund in no less than 7 days from the date of
        acknowledgement of your cancellation request. The refund will be
        credited to the original payment method used to purchase the Product.
        Please note it may take longer due to delays in processing by your bank
        or card issuer, after we initiate the refund. Please get in touch with
        your bank or card issuer for more information in such cases.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about our Cancellation and Refunds Policy, You
        can contact us by email:{' '}
        <span>
          <Email />
        </span>
      </p>
      <Footer />
    </main>
  );
};

export default Refunds;
