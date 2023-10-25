import { ComponentProps, forwardRef } from 'react';

export interface Props extends ComponentProps<'input'> {}

const Input = forwardRef<HTMLInputElement, Props>(({ id, ...props }, ref) => (
  <input
    {...props}
    id={id}
    ref={ref}
    className="w-full p-2 rounded-md border border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
));

export default Input;
