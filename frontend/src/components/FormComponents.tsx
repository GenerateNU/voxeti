import styles from "./FormComponents.module.css";
import { useForm } from "react-hook-form";

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

// Short text response
function ShortAnswerInput({
  register,
  name,
  question,
  title,
}: {
  register: any;
  name: string;
  question: string;
  title?: string;
}) {
  return (
    <div>
      <h3>{title}</h3>
      <input
        {...register(name, { required: "This is required.", maxLength: 255 })}
        placeholder={question}
      />
    </div>
  );
}

// true or false
function SelectInput({
  register,
  name,
  question,
  options,
}: {
  register: any;
  name: string;
  question: string;
  options: { key: string; display: string }[];
}) {
  return (
    <div>
      <h3>{question}</h3>
      <select {...register(name, { required: "This is required." })}>
        {options.map((pair) => (
          <option key={pair.key}>{pair.display}</option>
        ))}
      </select>
    </div>
  );
}
// 0-10 scale
function ScaleInput({
  register,
  name,
  question,
  min = 1,
  max = 10,
}: {
  register: any;
  name: string;
  question: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <h3>{question}</h3>
      <input
        {...register(name, {
          required: "This is required.",
          valueAsNumber: true,
        })}
        type="range"
        min={min}
        max={max}
      />
    </div>
  );
}
