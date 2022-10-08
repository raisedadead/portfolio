/* eslint-disable @next/next/no-html-link-for-pages */
export type Props = {
  defaultType?: boolean;
};
export const Footer: React.FC<Props> = (props: Props) => {
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
              <a
                aria-label="Terms & Conditions"
                href="/"
                className={anchorClass}
              >
                {' '}
                Home{' '}
              </a>
              •
            </>
          )}
          <a
            aria-label="Terms & Conditions"
            href="/terms"
            className={anchorClass}
          >
            {' '}
            Terms{' '}
          </a>
          •
          <a
            aria-label="Privacy Policy"
            href="/privacy"
            className={anchorClass}
          >
            {' '}
            Privacy{' '}
          </a>
          •
          <a
            aria-label="Refunds & Cancellation Policy"
            href="/refunds"
            className={anchorClass}
          >
            {' '}
            Refunds{' '}
          </a>
        </p>
      </div>
    </footer>
  );
};
