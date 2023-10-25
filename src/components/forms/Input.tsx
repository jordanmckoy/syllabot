import { forwardRef } from 'react';
import Root, { Props as RootProps } from '~/components/ui/Input';
import FormField, { UseFormFieldProps, useFormField } from './FormField';

interface Props extends UseFormFieldProps, RootProps {
  // UseFormFieldProps requires 'name', so we override.
  // This also allows us to extend UseFormFieldProps and
  // RootProps at the same time.
  name: string;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { formFieldProps, childProps } = useFormField(props);

  return (
    <FormField {...formFieldProps}>
      <Root {...childProps} ref={ref} />
    </FormField>
  );
});

export default Input;
