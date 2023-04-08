import React from 'react';
import { motion } from 'framer-motion';

const waveVariants = {
  animate: (duration: number) => ({
    x: ['-150px', '150px', '-150px'],
    transition: {
      duration: duration,
      repeat: Infinity
    }
  })
};

export const Background: React.FC = () => {
  return (
    <div className='-z-50 h-screen w-screen bg-orange-200'>
      <svg
        width='100%'
        height='100%'
        id='svg'
        viewBox='0 0 1000 800'
        preserveAspectRatio='none'
        xmlns='http://www.w3.org/2000/svg'
        className='transition delay-150 duration-300 ease-in-out'
      >
        <g id='one'>
          <linearGradient
            id='svg1'
            gradientUnits='userSpaceOnUse'
            x1='-207.2916'
            y1='270.9562'
            x2='1991.9283'
            y2='270.9562'
          >
            <stop offset='0' style={{ stopColor: '#32ded4' }} />
            <stop offset='1' style={{ stopColor: '#32ded4', stopOpacity: 0 }} />
          </linearGradient>
          <motion.path
            fill='url(#svg1)'
            d='M-206.084,515.811c0,0,217.208-66.007,453.867,3c0.017,0.005,0.034,0.01,0.051,0.015
    c118.716,34.611,243.627,53.152,366.838,35.887c136.417-19.115,258.875-65.218,397.701-35.334
    c107.947,23.237,196.916,83.712,311.488,53.499c122.896-32.409,228.996-83.684,359.183-76.458
    c111.262,6.176,199.042,51.051,308.884,10.389V-39.245h-2199.22L-206.084,515.811z'
            variants={waveVariants}
            animate='animate'
            custom={25}
          />
        </g>
        <g id='two'>
          <linearGradient
            id='svg2'
            gradientUnits='userSpaceOnUse'
            x1='-306.3015'
            y1='246.9538'
            x2='1892.9183'
            y2='246.9538'
          >
            <stop offset='0' style={{ stopColor: '#32ded4' }} />
            <stop offset='1' style={{ stopColor: '#32ded4', stopOpacity: 0 }} />
          </linearGradient>
          <motion.path
            opacity='0.5'
            fill='url(#svg2)'
            d='M-305.094,491.808c0,0,217.208-66.007,453.867,3c0.017,0.005,0.034,0.01,0.051,0.015
    c118.716,34.611,243.627,53.152,366.838,35.887c136.417-19.115,258.875-65.218,397.701-35.334
    c107.946,23.237,196.916,83.712,311.488,53.499c122.896-32.409,228.996-83.684,359.183-76.458
            c111.262,6.176,199.041,51.051,308.884,10.389V-63.247h-2199.22L-305.094,491.808z'
            variants={waveVariants}
            animate='animate'
            custom={20}
          />
        </g>
        <g id='three'>
          <linearGradient
            id='svg3'
            gradientUnits='userSpaceOnUse'
            x1='-107.0737'
            y1='237.9529'
            x2='2090.9382'
            y2='237.9529'
          >
            <stop offset='0' style={{ stopColor: '#32ded4' }} />
            <stop offset='1' style={{ stopColor: '#32ded4', stopOpacity: 0 }} />
          </linearGradient>
          <motion.path
            opacity='0.5'
            fill='url(#svg3)'
            d='M-107.074,466.23c0,0,217.208-61.538,453.867,2.797
    c0.017,0.005,0.034,0.009,0.051,0.014c118.716,32.268,243.627,49.553,366.838,33.458c136.417-17.821,258.875-60.803,397.701-32.941
    c107.947,21.664,196.916,78.045,311.488,49.876c122.896-30.215,228.996-78.018,359.183-71.281
    c111.262,5.758,199.042,47.594,308.884,9.686V-51.246l-2194.283,0.088L-107.074,466.23z'
            variants={waveVariants}
            animate='animate'
            custom={15}
          />
        </g>
      </svg>
    </div>
  );
};

export default Background;
