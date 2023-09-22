import { ShortAnswerInput, SelectInput, ScaleInput } from "./FormComponents";
import FormWrapper from "./FormWrapper";

/*
UserRegistration

An implementation/demo for the FormWrapper component
*/
export default function UserRegistration() {
  return (
    <FormWrapper>
      <ShortAnswerInput
        name="firstName"
        question="First Name"
      ></ShortAnswerInput>
      <ShortAnswerInput name="lastName" question="Last Name"></ShortAnswerInput>
      <ShortAnswerInput
        name="shortAnswer"
        question="Enter response here"
        title="This is a titled question"
      ></ShortAnswerInput>
      <SelectInput
        name="role"
        question="Designer or Producer?"
        options={[
          { key: "none", display: "Select One" },
          { key: "designer", display: "Designer" },
          { key: "producer", display: "Producer" },
        ]}
      ></SelectInput>
      <ScaleInput name="coolness" question="How cool are you?"></ScaleInput>
    </FormWrapper>
  );
}
