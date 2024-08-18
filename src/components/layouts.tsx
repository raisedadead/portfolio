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

export type LegalLayoutProps = BaseLayoutProps & {
  variant: 'legal';
};

export type LayoutProps = MainLayoutProps | LegalLayoutProps;

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
        <Nav className='m-2 max-h-none pt-2' showHomeButton={showHomeButton} />
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

const LegalLayout: React.FC<LegalLayoutProps> = (props) => (
  <BaseLayout {...props}>
    <div className='border-2 border-black bg-white p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
      <article className='prose prose-sm prose-slate max-w-none'>
        {props.children}
      </article>
    </div>
  </BaseLayout>
);

export const Layout: React.FC<LayoutProps> = (props) => {
  switch (props.variant) {
    case 'main':
      return <MainLayout {...props} />;
    case 'legal':
      return <LegalLayout {...props} />;
  }
};

export default Layout;
