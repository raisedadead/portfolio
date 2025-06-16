import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import type React from 'react';

type ExpandableSectionProps = {
  title: string;
  labels?: {
    name: string;
    color: string;
  }[];
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
};

const Label: React.FC<{ children: React.ReactNode; labelColor: string }> = ({
  children,
  labelColor,
}) => {
  const preClasses =
    'mx-1 inline-flex items-center rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] border-2 px-2 py-0.5 text-xs font-medium';

  const colorVariants: {
    [key: string]: string;
  } = {
    red: 'border-black bg-red-100 text-red-800',
    green: 'border-black bg-green-100 text-green-800',
    blue: 'border-black bg-blue-100 text-blue-800',
    orange: 'border-black bg-orange-100 text-orange-800',
    yellow: 'border-black bg-yellow-100 text-yellow-800',
    purple: 'border-black bg-purple-100 text-purple-800',
    pink: 'border-black bg-pink-100 text-pink-800',
    gray: 'border-black bg-gray-100 text-gray-800',
  };

  return <span className={`${colorVariants[labelColor]} ${preClasses}`}>{children}</span>;
};

const Labels: React.FC<{
  labels: ExpandableSectionProps['labels'];
}> = ({ labels = [] }) => {
  return (
    <div className="mx-2">
      {labels.map((label, index) => (
        <Label key={`${label.name}-${index}`} labelColor={label.color}>
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
  className,
  defaultOpen = false,
}) => {
  return (
    <Disclosure as="div" className={className} defaultOpen={defaultOpen}>
      {({ open }) => (
        <div
          className={`${open ? 'border-2' : 'border-t-2 border-r-2 border-l-2'} my-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
        >
          <DisclosureButton
            className={`${open ? 'bg-purple-300' : 'bg-red-200'} flex w-full flex-row justify-between border-b-2 border-black px-2 py-2 text-left font-bold text-slate-900`}
          >
            <span>{title}</span>
            <div className="flex flex-row items-center">
              {labels && labels.length > 0 ? <Labels labels={labels} /> : null}
              {open ? (
                <MinusIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
          </DisclosureButton>
          <DisclosurePanel className="bg-blue-100 p-4 text-slate-700">{children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};
