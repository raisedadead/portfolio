import { Footer } from '@/components/footer';
import Background from '@/components/background';
import Nav from '@/components/nav';
import ScrollButton from '@/components/scroll-button';
import { cn } from '@/lib/utils';

export type BaseLayoutProps = {
  children: React.ReactNode;
  showHomeButton?: boolean;
};

export type MainLayoutProps = BaseLayoutProps & {
  variant: 'main';
};

export type ProseLayoutProps = BaseLayoutProps & {
  variant: 'prose';
};

export type LegalLayoutProps = BaseLayoutProps & {
  variant: 'legal';
};

export type LayoutProps = MainLayoutProps | ProseLayoutProps | LegalLayoutProps;

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  showHomeButton = true
}) => (
  <>
    <div className={cn('container')}>
      <div className='fixed inset-0 -z-10'>
        <Background />
      </div>
      <main className='mx-auto my-2 w-[90%] py-8 lg:w-[75%] xl:w-[80%]'>
        <Nav
          className='z-20 m-2 max-h-none pt-2'
          showHomeButton={showHomeButton}
        />
        <div className='p-5'>{children}</div>
        <Footer isDefault={true} className='p-2' />
        <ScrollButton className='fixed bottom-4 right-4 z-20' />
      </main>
    </div>
  </>
);

const MainLayout: React.FC<MainLayoutProps> = (props) => (
  <BaseLayout {...props}>
    <div className='mx-auto'>{props.children}</div>
  </BaseLayout>
);

const ProseLayout: React.FC<ProseLayoutProps> = (props) => (
  <BaseLayout {...props}>{props.children}</BaseLayout>
);

const LegalLayout: React.FC<LegalLayoutProps> = (props) => (
  <BaseLayout {...props}>
    <div
      className={cn(
        'prose prose-sm max-w-none p-8',
        'bg-white dark:bg-gray-900',

        // Text styles
        'prose-p:text-gray-700 dark:prose-p:text-gray-300',
        'prose-p:my-2 prose-p:leading-relaxed',
        'prose-strong:text-gray-900 dark:prose-strong:text-gray-100',

        // Heading styles
        'prose-headings:font-semibold',
        'prose-headings:text-gray-900 dark:prose-headings:text-gray-100',

        // List styles
        'prose-ul:list-none',
        'prose-li:text-gray-800 dark:prose-li:text-gray-200',

        // Link styles
        'prose-a:text-blue-600 dark:prose-a:text-blue-400',
        'prose-a:no-underline hover:prose-a:underline'
      )}
    >
      {props.children}
    </div>
  </BaseLayout>
);

export const Layout: React.FC<LayoutProps> = (props) => {
  switch (props.variant) {
    case 'prose':
      return <ProseLayout {...props} />;
    case 'legal':
      return <LegalLayout {...props} />;
    case 'main':
    default:
      return <MainLayout {...props} />;
  }
};

export default Layout;
