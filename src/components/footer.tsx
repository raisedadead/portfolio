import Link from 'next/link';

export type FooterProps = {
  defaultType?: boolean;
};
export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const { defaultType } = props;
  const footerClass = defaultType
    ? 'font-mono text-gray-700 text-sm text-center mx-8 md:mx-auto mt-8'
    : 'mt-8 text-center';
  const anchorClass = defaultType
    ? 'text-gray-700 hover:text-gray-50 rounded-full hover:bg-gray-500 py-1 px-2'
    : 'text-gray-500 hover:text-gray-50 rounded-full hover:bg-gray-500 py-1 px-2 no-underline';
  return (
    <footer className={footerClass}>
      <div>
        <p>
          © 2012-{new Date().getFullYear()} Mrugesh Mohapatra Co. — All rights
          reserved.
        </p>
        <p className="mt-2">
          {!defaultType && (
            <>
              <Link href="/" aria-label="Home" className={anchorClass}>
                Home
              </Link>
              •
            </>
          )}
          <Link
            href="/terms"
            aria-label="Terms & Conditions"
            className={anchorClass}
          >
            Terms
          </Link>
          •
          <Link
            href="/privacy"
            aria-label="Privacy Policy"
            className={anchorClass}
          >
            Privacy
          </Link>
          •
          <Link
            href="/refunds"
            aria-label="Refunds & Cancellation Policy"
            className={anchorClass}
          >
            Refunds
          </Link>
        </p>
      </div>
    </footer>
  );
};
