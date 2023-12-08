import { Control, Controller } from "react-hook-form";
import { FormQuestion } from "../../utilities/FormQuestions/registration";
import { Autocomplete, TextField } from "@mui/material";
import { DropdownItem } from "../../utilities/FormQuestions/DropdownItems/dropdown.types";

export default function DropdownQuestion({
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
      render={({ field: { onChange, value, ...props } }) => (
        <Autocomplete
          autoComplete={true}
          defaultValue={value}
          disablePortal
          options={question.menuItems ?? []}
          renderInput={(params) => (
            <TextField {...params} label={question.prompt} />
          )}
          className="!w-full !mb-6"
          onChange={(_, item) => {
            onChange(item ? (item as DropdownItem).value : item);
          }}
          {...props}
        />
      )}
    />
  );
}
