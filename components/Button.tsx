import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#c17f59] text-white hover:bg-[#a86b48] active:bg-[#8f5a3d] disabled:bg-[#c17f59]/50 disabled:cursor-not-allowed',
  secondary:
    'bg-[#2c2c2c] text-white hover:bg-[#1a1a1a] active:bg-[#0d0d0d] disabled:bg-[#2c2c2c]/50 disabled:cursor-not-allowed',
  outline:
    'border border-[#2c2c2c]/20 text-[#2c2c2c] hover:bg-[#f0ebe3] active:bg-[#e8e4dc] disabled:text-[#8a8a8a] disabled:border-[#e8e4dc]',
  ghost: 'text-[#2c2c2c] hover:bg-[#f0ebe3] active:bg-[#e8e4dc] disabled:text-[#8a8a8a]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c17f59]/40 focus:ring-offset-2 focus:ring-offset-[#faf8f5]',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-70 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

      <span>{children}</span>

      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
