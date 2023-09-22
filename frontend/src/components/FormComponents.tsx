// Short text response
export function ShortAnswerInput({
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
export function SelectInput({
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
export function ScaleInput({
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
