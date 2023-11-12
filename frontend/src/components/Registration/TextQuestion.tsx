import { Control, Controller, FieldValues } from "react-hook-form";
import { FormQuestion } from "../../utils/questions";
import { TextField } from "@mui/material";

export default function TextQuestion({
    question,
    control
}:{
    question: FormQuestion
    control: Control<FieldValues, any>
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
                            : ""
                        }
                        onChange={(e) => onChange(e.target.value)}
                        className="!mb-2"
                        label={question.prompt}
                        variant="outlined"
                        defaultValue={value}
                        fullWidth
                    />
                );
            }}
        />
    );
}