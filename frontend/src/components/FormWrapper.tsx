import styles from "./FormComponents.module.css";
import { useForm } from "react-hook-form";
import React, { ReactElement, ReactNode } from "react";

/**
 * This file is a proof of concept and was trialed for potenial in the future.
 * Depending on what we get from the designers on what forms they want we can use
 * what we learned here in the future.
 */

/*
FormWrapper

A component to hold different FormComponents implemented with the React Hook Form library
*/
export default function FormWrapper({ children }: { children: ReactNode }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const renderChildren = () => {
    return React.Children.map<ReactNode, ReactNode>(children, (child) => {
      return React.cloneElement(child as ReactElement, {
        register: register,
      });
    });
  };

  console.log(errors);

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
        className={styles.userRegistrationContainer}
      >
        {renderChildren()}
        <input type="submit" />
      </form>
    </div>
  );
}
