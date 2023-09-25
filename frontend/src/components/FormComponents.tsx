import { UseFormRegister, FieldValues } from "react-hook-form";

/*
ShortAnswerInput

Must be a child of the FormWrapper Component to function correctly.
 */
export function ShortAnswerInput({
  register,
  name,
  question,
  title,
}: {
  register: UseFormRegister<FieldValues>;
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

/*
SelectInput

Must be a child of the FormWrapper Component to function correctly.

Used for single selection items (i.e. true/false, yes/or, country list, etc.)
 */
export function SelectInput({
  register,
  name,
  question,
  options,
}: {
  register: UseFormRegister<FieldValues>;
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

/*
ScaleInput

Must be a child of the FormWrapper Component to function correctly.

Used for min/max number selection (i.
 */
export function ScaleInput({
  register,
  name,
  question,
  min = 1,
  max = 10,
}: {
  register: UseFormRegister<FieldValues>;
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
