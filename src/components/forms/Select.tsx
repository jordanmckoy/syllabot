import { forwardRef } from 'react';
import Root, { Props as RootProps } from '~/components/ui/Select';
import FormField, { UseFormFieldProps, useFormField } from './FormField';

interface Props extends UseFormFieldProps, RootProps {
  // FormFieldProps requires 'name', so we override.
  // This also allows us to extend FormFieldProps and
  // BareInputProps at the same time.
  name: string;
}

const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const { formFieldProps, childProps } = useFormField(props);

  return (
    <FormField {...formFieldProps}>
      <Root {...childProps} ref={ref} />
    </FormField>
  );
});

export default Select;
