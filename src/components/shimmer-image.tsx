import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ShimmerEffect = ({ className }: { className: string }) => (
  <motion.div
    className={cn('absolute inset-0 bg-orange-100', className)}
    animate={{
      opacity: [0.3, 0.7, 0.3]
    }}
    transition={{
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut'
    }}
  />
);

type ShimmerImageProps = Omit<ImageProps, 'placeholder'>;

const ShimmerImage: React.FC<ShimmerImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <ShimmerEffect className={className || ''} />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-500 ease-in-out',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </>
  );
};

export default ShimmerImage;
