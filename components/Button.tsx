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
    'bg-[#c17f59] text-white hover:bg-[#b06d47] active:bg-[#9d6340] disabled:bg-[#c17f59]/50 disabled:cursor-not-allowed',
  secondary:
    'bg-[#1a1a1a] text-white hover:bg-[#374151] active:bg-[#111827] disabled:bg-[#1a1a1a]/50 disabled:cursor-not-allowed',
  outline:
    'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb] hover:border-[#d1d5db] active:bg-[#f3f4f6] disabled:text-[#9ca3af] disabled:border-[#e5e7eb]',
  ghost: 'text-[#374151] hover:bg-[#f3f4f6] active:bg-[#e5e7eb] disabled:text-[#9ca3af]',
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
        'inline-flex items-center justify-center gap-2 rounded-[0.75rem] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 focus:ring-offset-[#faf9f7]',
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
