import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowUp } from './scroll-arrows';

const ScrollButton = ({ className }: { className: string }) => {
  const [showButton, setShowButton] = useState(false);
  const [bounceButton, setBounceButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight;

      const isAtBottom = window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight;

      const isAtTop = window.pageYOffset === 0;

      setShowButton(isScrollable && !isAtTop);
      setBounceButton(isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const arrowClassName = `cursor-pointer rounded-full border-2 border-black bg-white text-black shadow-brutal-md hover:bg-orange-100 hover:shadow-brutal-lg focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none ${
    bounceButton ? 'animate-bounce' : ''
  }`;

  return (
    <div className={className}>
      <AnimatePresence>
        {showButton && (
          <motion.button
            type='button'
            aria-label='Scroll to top'
            onClick={scrollToTop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={arrowClassName}
          >
            <ArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export { ScrollButton };
