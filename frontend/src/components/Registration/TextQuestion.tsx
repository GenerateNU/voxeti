import { Control, Controller } from "react-hook-form";
import { FormQuestion } from "../../utilities/FormQuestions/registration";
import { TextField } from "@mui/material";

export default function TextQuestion({
  question,
  control,
}: {
  question: FormQuestion;
  control: Control;
}) {
  return (
    <Controller
      key={question.key + "Controller"}
      control={control}
      name={question.key}
      rules={question.rules}
      render={({ field: { onChange, value } }) => {
        return (
          <TextField
            key={question.key + "TextField"}
            error={!!control.getFieldState(question.key).error}
            helperText={
              (control.getFieldState(question.key).error?.message as string)
                ? control.getFieldState(question.key).error?.message
                : " "
            }
            onChange={(e) => onChange(e.target.value)}
            label={question.prompt}
            variant="outlined"
            defaultValue={question.defaultValue ?? value}
            fullWidth
            disabled={question.disabled}
          />
        );
      }}
    />
  );
}
