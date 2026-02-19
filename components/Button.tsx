import { forwardRef } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg',
  {
    variants: {
      variant: {
        primary: 'bg-orange-500 text-white hover:bg-orange-600',
        secondary: 'border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-100',
        ghost: 'text-neutral-700 hover:bg-neutral-100',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
  href?: string;
} & (Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> | Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>);

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (href) {
      const { target, rel, ...rest } = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <Link href={href} className={classes} ref={ref as React.Ref<HTMLAnchorElement>} target={target} rel={rel} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <button className={classes} ref={ref as React.Ref<HTMLButtonElement>} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
