import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

export default function Form({
  defaultValues,
  children,
  onSubmit,
}: {
  defaultValues?: Record<string, any>;
  children: React.ReactElement | React.ReactElement[];
  onSubmit: (
    data: Record<string, any>,
    event?: React.BaseSyntheticEvent
  ) => void;
}) {
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {React.Children.map(children, (child) => {
        return child.props.name
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                register: methods.register,
                key: child.props.name,
              },
            })
          : child;
      })}
    </form>
  );
}

export function Input({
  register,
  name,
  ...rest
}: {
  register?: UseFormRegister<FieldValues>;
  name: string;
  rest?: Record<string, any>[];
}) {
  if (register) return <input {...register(name)} {...rest} />;
  else return <p>Unregistered</p>;
}

export function Select({
  register,
  options,
  name,
  ...rest
}: {
  register?: UseFormRegister<FieldValues>;
  options: Array<string>;
  name: string;
}) {
  if (register)
    return (
      <select {...register(name)} {...rest}>
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  else return <p>Unregistered</p>;
}
