import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';

export interface Props extends ComponentProps<'button'> {}

const Button = ({ children, className, ...props }: Props) => (
  <button
    {...props}
    className={clsx(
      'rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 disabled:!bg-gray-300',
      className
    )}
  >
    {children}
  </button>
);

export default Button;
