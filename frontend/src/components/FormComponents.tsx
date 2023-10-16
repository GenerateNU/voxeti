import React, { ComponentPropsWithoutRef } from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  register?: UseFormRegister<FieldValues>;
  name: string;
}

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  register?: UseFormRegister<FieldValues>;
  options: Array<string>;
  name: string;
}

export default function Form({ defaultValues, children, onSubmit }: { defaultValues?: Record<string, any>; children: React.ReactElement | React.ReactElement[]; onSubmit: (data: Record<string, any>, event?: React.BaseSyntheticEvent) => void; }) {
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {React.Children.map(children, (child) => {
        return child.props.name ?
          React.createElement(child.type, {
            ...{
              ...child.props,
              register: methods.register,
              key: child.props.name,
            },
          })
        :
          child;})}
    </form>
  );
}

export function Input({ register, name, ...rest }: InputProps) {
  if (register) {
    return (
      <input className="outline mr-2" {...register(name)} {...rest} />
    );
  } else return <p>Unregistered</p>;
}

export function Select({ register, options, name, ...rest }: SelectProps) {
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

export function Label({ register, title, name, ...rest }: { register?: UseFormRegister<FieldValues>; title: string, name: string; rest?: Record<string, any>[]; }) {
  return <label className=" mr-2" htmlFor={name} {...rest}>{title}</label>;
}
