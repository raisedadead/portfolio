import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

type ExpandableSectionProps = {
  title: string;
  labels?: {
    name: string;
    color: string;
  }[];
  children: React.ReactNode;
  className?: string;
};

const Label: React.FC<{ children: React.ReactNode; labelColor: string }> = ({
  children,
  labelColor
}) => {
  const preClasses =
    'mx-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

  const colorVariants: {
    [key: string]: string;
  } = {
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`${colorVariants[labelColor]} ${preClasses}`}>
      {children}
    </span>
  );
};

const Labels: React.FC<{
  labels: ExpandableSectionProps['labels'];
}> = ({ labels = [{ name: '', color: '' }] }) => {
  return (
    <div className='mx-2'>
      {labels.map((label, index) => (
        <Label key={`${label}-${index}`} labelColor={label.color}>
          {label.name}
        </Label>
      ))}
    </div>
  );
};

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  labels,
  children,
  className
}) => {
  return (
    <Disclosure as='div' className={className}>
      {({ open }) => (
        <div>
          <Disclosure.Button className='flex w-full justify-between rounded-lg text-left font-bold text-slate-700'>
            <div className='flex flex-row'>
              {title}
              {labels?.length ? <Labels labels={labels} /> : null}
            </div>
            {open ? (
              <MinusSmallIcon className='h-5 w-5' aria-hidden='true' />
            ) : (
              <PlusSmallIcon className='h-5 w-5' aria-hidden='true' />
            )}
          </Disclosure.Button>
          <Disclosure.Panel className='text-slate-500'>
            {children}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default ExpandableSection;
