import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

export interface UseFormFieldProps extends PropsWithChildren {
  name: string;
  label: string;
}

export const useFormField = <P extends UseFormFieldProps>(props: P) => {
  const { label, name, ...otherProps } = props;
  const id = name;

  return {
    formFieldProps: { id, name, label },
    childProps: { ...otherProps, id, name },
  };
};

interface Props extends UseFormFieldProps {
  id: string;
}

const FormField = ({ children, name, id, label }: Props) => {
  const form = useFormContext();
  const state = form.getFieldState(name, form.formState);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm text-gray-700 font-medium">
        {label}
      </label>
      {children}
      {state.error && (
        <p className="text-red-600 text-sm">{state.error.message}</p>
      )}
    </div>
  );
};

export default FormField;
