import styles from "./FormComponents.module.css";
import { useForm } from "react-hook-form";
import { ShortAnswerInput, SelectInput, ScaleInput } from "./FormComponents";

// From Wrapper
export default function UserRegistration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
        className={styles.userRegistrationContainer}
      >
        <ShortAnswerInput
          register={register}
          name="firstName"
          question="First Name"
        ></ShortAnswerInput>
        <ShortAnswerInput
          register={register}
          name="lastName"
          question="Last Name"
        ></ShortAnswerInput>
        <ShortAnswerInput
          register={register}
          name="shortAnswer"
          question="Enter response here"
          title="This is a titled question"
        ></ShortAnswerInput>
        <SelectInput
          register={register}
          name="role"
          question="Designer or Producer?"
          options={[
            { key: "none", display: "Select One" },
            { key: "designer", display: "Designer" },
            { key: "producer", display: "Producer" },
          ]}
        ></SelectInput>
        <ScaleInput
          register={register}
          name="coolness"
          question="How cool are you?"
        ></ScaleInput>
        <input type="submit" />
      </form>
    </div>
  );
}
