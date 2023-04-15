import type { NextPage } from 'next';
import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';
import ExpandableSection from '../components/expandable-section';

const Uses: NextPage = () => {
  return (
    <Layout>
      <section>
        <div className='prose prose-slate max-w-none'>
          <h1 className='text-center text-2xl font-bold text-slate-700'>
            Everyday Day Carry
          </h1>
          <p className='text-center text-slate-500'>
            This is a list of the hardware and software I use on a daily basis.
          </p>
          <ExpandableSection title='Hardware' className='mt-4'>
            <ul className='list-none'>
              <li>
                <Link href='https://support.apple.com/kb/SP854?locale=en_US'>
                  MacBook Pro (14-inch, 2021)
                </Link>
                <span className='mx-5 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800'>
                  Current
                </span>
              </li>
              <li>
                <Link href='https://support.apple.com/kb/SP715?locale=en_US'>
                  MacBook Pro (Retina, 13-inch, Early 2015)
                </Link>
              </li>
              <li>
                <Link href='https://google.com/?q=dell+xps+9500+32+gb+ram'>
                  Dell XPS 15 (9500) - 15-inch, 2020 Edition
                </Link>
              </li>
            </ul>
          </ExpandableSection>
        </div>
      </section>
    </Layout>
  );
};
export default Uses;
