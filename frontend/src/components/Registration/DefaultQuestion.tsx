import { Control, Controller, FieldValues } from "react-hook-form";
import { FormQuestion } from "../../utils/questions";

export default function DefaultQuestion({
    question,
    control
}:{
    question: FormQuestion
    control: Control<FieldValues, any>
}) {
    return (
      <Controller
        name={question.key}
        key={question.key}
        control={control}
        rules={question.rules}
        render={({ field: { ...field }, fieldState: { error } }) => {
          return (
            <div className="flex flex-grow flex-col m-2">
              <label className=" py-1 font-normal">
                {question.prompt}
                <span className=" text-error">
                  {question.rules && "required" in question.rules ? "*" : ""}
                </span>
                <span className=" text-error italic text-sm">
                  {" "}
                  {error ? error.message : ""}
                </span>
              </label>
              <input
                {...field}
                className=" outline outline-primary/50 outline-[0.5px] p-2 rounded-sm"
                type={question.type}
                key={question.key}
              />
            </div>
          );
        }}
      />
    );
  };