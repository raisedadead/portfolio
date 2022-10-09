import Link from 'next/link';

export type FooterProps = {
  defaultType?: boolean;
};
export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const { defaultType } = props;
  const footerClass = defaultType
    ? 'font-mono text-gray-700 text-sm text-center mx-8 md:mx-auto py-1 mt-2'
    : 'mt-4 text-center';
  const anchorClass = defaultType
    ? 'text-gray-700 hover:text-gray-50'
    : 'text-gray-500 hover:text-gray-900 no-underline';
  return (
    <footer className={footerClass}>
      <div>
        <p>
          © {new Date().getFullYear()} Mrugesh Mohapatra. All rights reserved.
        </p>
        <p className="mt-2">
          {!defaultType && (
            <>
              <Link href="/">
                <a aria-label="Home" className={anchorClass}>
                  {' '}
                  Home{' '}
                </a>
              </Link>
              •
            </>
          )}
          <Link href="/terms">
            <a aria-label="Terms & Conditions" className={anchorClass}>
              {' '}
              Terms{' '}
            </a>
          </Link>
          •
          <Link href="/privacy">
            <a aria-label="Privacy Policy" className={anchorClass}>
              {' '}
              Privacy{' '}
            </a>
          </Link>
          •
          <Link href="/refunds">
            <a
              aria-label="Refunds & Cancellation Policy"
              className={anchorClass}
            >
              {' '}
              Refunds{' '}
            </a>
          </Link>
        </p>
      </div>
    </footer>
  );
};
