import { useForm } from "react-hook-form";
import { ShortAnswerInput, SelectInput, ScaleInput } from "./FormComponents";

/*
UserRegistration

An implementation/demo for the FormWrapper component
*/
export default function UserRegistration() {
  const { register, handleSubmit } = useForm();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    >
      <ShortAnswerInput
        register={register}
        name="firstName"
        question="First Name"
      />

      <ShortAnswerInput
        register={register}
        name="lastName"
        question="Last Name"
      />

      <ShortAnswerInput
        register={register}
        name="shortAnswer"
        question="Enter response here"
        title="This is a titled question"
      />

      <SelectInput
        register={register}
        name="role"
        question="Designer or Producer?"
        options={[
          { key: "none", display: "Select One" },
          { key: "designer", display: "Designer" },
          { key: "producer", display: "Producer" },
        ]}
      />

      <ScaleInput
        register={register}
        name="coolness"
        question="How cool are you?"
      />

      <button type="submit">
        Hit me to Submit and look at the console when done
      </button>
    </form>
  );
}
