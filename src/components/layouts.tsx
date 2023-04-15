import Background from './background';
import { Footer } from '../components/footer';
import Nav from './nav';
import ScrollButton from './scroll-button';

export type LayoutProps = {
  children: React.ReactNode;
  showGlass?: boolean;
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  showGlass = true
}: LayoutProps) => {
  return (
    <>
      <div className='fixed inset-0 -z-10'>
        <Background />
      </div>

      <Nav className='fixed top-0 z-20 mx-auto max-h-none w-screen' />

      <main
        className={`relative z-10 mx-auto mb-10 mt-16 h-auto max-h-none w-[90%] overflow-y-auto pb-10 pt-5 lg:w-[75%] xl:w-[60%] ${
          showGlass
            ? ' rounded-3xl bg-white/60 backdrop-blur-lg'
            : ' rounded-3xl bg-white/30 backdrop-blur-lg'
        }`}
      >
        <div className='px-5 pb-5 pt-5 md:px-20 '>{children}</div>
        <Footer isDefault={true} className='p-2' />
      </main>
      <ScrollButton className='fixed bottom-8 right-10 z-20 md:right-20 lg:right-48' />
    </>
  );
};

export default Layout;
