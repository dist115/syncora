import React, { useCallback } from 'react';

interface CheckboxProps {
  values: string[];
  onChange: (value: string[], e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}
interface EnrichedChildren {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  checked: boolean;
  value: string;
  children?: React.ReactNode;
}
export function CheckboxGroup({ children, values, onChange }: CheckboxProps) {
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      onChange(newValues, e);
    },
    [values, onChange]
  );

  return (
    <>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<EnrichedChildren>(child)) {
          return child;
        }
        return React.cloneElement(child, {
          onChange: onChangeHandler,
          checked: values?.includes(child.props.value),
        });
      })}
    </>
  );
}
