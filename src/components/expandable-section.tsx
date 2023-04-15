import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

type ExpandableSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  className
}) => {
  return (
    <Disclosure as='div' className={className}>
      {({ open }) => (
        <>
          <Disclosure.Button className='text-md flex w-full justify-between rounded-lg text-left font-medium text-slate-700'>
            <span>{title}</span>
            {open ? (
              <MinusSmallIcon className='h-5 w-5' aria-hidden='true' />
            ) : (
              <PlusSmallIcon className='h-5 w-5' aria-hidden='true' />
            )}
          </Disclosure.Button>
          <Disclosure.Panel className='text-base text-slate-500'>
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default ExpandableSection;
