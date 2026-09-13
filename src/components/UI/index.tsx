'use client';

import React from 'react';
import { ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-dark hover:bg-opacity-90 shadow-lg shadow-primary/50',
    secondary: 'bg-secondary text-white hover:bg-opacity-90 shadow-lg shadow-secondary/50',
    danger: 'bg-error text-white hover:bg-opacity-90',
    ghost: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:bg-opacity-10',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      className={`w-full px-4 py-3 bg-dark border border-secondary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all ${className || ''}`}
      {...props}
    />
  );
};

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => {
  return (
    <textarea
      className={`w-full px-4 py-3 bg-dark border border-secondary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all resize-none ${className || ''}`}
      {...props}
    />
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-dark border border-secondary/20 rounded-lg p-4 md:p-6 ${className || ''}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'info' }> = ({
  children,
  variant = 'info',
}) => {
  const colors = {
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    info: 'bg-primary/20 text-primary',
  };
  return <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[variant]}`}>{children}</span>;
};

export const Alert: React.FC<{ title?: string; message: string; variant?: 'success' | 'warning' | 'error' | 'info' }> = ({
  title,
  message,
  variant = 'info',
}) => {
  const colors = {
    success: 'bg-success/10 border-success/50 text-success',
    warning: 'bg-warning/10 border-warning/50 text-warning',
    error: 'bg-error/10 border-error/50 text-error',
    info: 'bg-primary/10 border-primary/50 text-primary',
  };
  return (
    <div className={`border rounded-lg p-4 ${colors[variant]} flex gap-3`}>
      <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className={`${sizes[size]} border-3 border-secondary/30 border-t-primary rounded-full animate-spin`} />
  );
};
