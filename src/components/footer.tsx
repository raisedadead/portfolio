import { CustomLink as Link } from './custom-link';

type FooterProps = {
  isDefault?: boolean;
  className?: string;
};
export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const { isDefault = false, className } = props;
  const footerType = isDefault
    ? 'font-mono text-gray-700 text-sm text-center mx-8 md:mx-auto'
    : 'text-center';
  const anchorClass = isDefault
    ? 'text-gray-700 hover:text-black rounded-full hover:bg-white py-1 px-2'
    : 'text-gray-500 hover:text-black rounded-full hover:bg-white py-1 px-2 no-underline';
  return (
    <footer className={className}>
      <div className={footerType}>
        <p>© 2012-{new Date().getFullYear()} Mrugesh Mohapatra Co. — All rights reserved.</p>
        <p className="mt-2">
          {!isDefault && (
            <>
              <Link href="/" aria-label="Home" className={anchorClass}>
                Home
              </Link>
              •
            </>
          )}
          <Link href="/terms" aria-label="Terms & Conditions" className={anchorClass}>
            Terms
          </Link>
          •
          <Link href="/privacy" aria-label="Privacy Policy" className={anchorClass}>
            Privacy
          </Link>
          •
          <Link href="/refunds" aria-label="Refunds & Cancellation Policy" className={anchorClass}>
            Refunds
          </Link>
          •
          <Link href="/about" aria-label="Contact Us" className={anchorClass}>
            About & Contact
          </Link>
        </p>
      </div>
    </footer>
  );
};
