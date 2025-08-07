import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
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

  const scrollDown = () => {
    // Scroll to the bottom of the page
    // const scrollTo = document.documentElement.scrollHeight - window.innerHeight;
    // Scroll to the top of the page
    const scrollTo = 0;
    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  };

  const arrowClassName = `cursor-pointer rounded-full bg-white text-black shadow-[4px_4px_0_0_rgba(60,64,43,.2)] focus:outline-hidden ${
    bounceButton ? 'animate-bounce' : ''
  }`;

  return (
    <div className={className}>
      <AnimatePresence>
        {showButton && (
          <motion.button
            onMouseDown={scrollDown}
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
