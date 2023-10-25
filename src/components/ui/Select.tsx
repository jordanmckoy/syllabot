import { ComponentProps, forwardRef } from 'react';

export interface Props extends ComponentProps<'select'> {}

const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => (
  <select
    {...props}
    className="w-full rounded-md border-gray-300 py-2 px-3 pr-10 text-sm border focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
    ref={ref}
  />
));

export default Select;
