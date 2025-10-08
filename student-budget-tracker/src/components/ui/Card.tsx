'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BaseComponentProps } from '@/types';

interface CardProps extends BaseComponentProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `bg-white rounded-xl shadow-lg border border-gray-100 ${paddingClasses[padding]}`;
  const classes = `${baseClasses} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={classes}
        whileHover={{ 
          y: -4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;