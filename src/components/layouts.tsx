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

      <main
        className={`relative z-10 mx-auto mb-8 mt-8 h-auto max-h-none w-[90%] pb-8 pt-5 lg:w-[75%] xl:w-[60%] ${
          showGlass ? '  bg-teal-100/80 shadow-[8px_6px_0px_rgba(0,0,0,1)]' : ''
        }`}
      >
        <Nav className='max-h-none w-screen' />
        <div className='px-5 pb-5 pt-5 md:px-16'>{children}</div>
        <Footer isDefault={true} className='p-2' />
        <ScrollButton className='fixed bottom-4 right-4 z-20' />
      </main>
    </>
  );
};

export default Layout;
