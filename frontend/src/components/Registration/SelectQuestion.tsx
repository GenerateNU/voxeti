import { Control, Controller, FieldValues } from "react-hook-form";
import { FormQuestion } from "../../utils/questions";
import { Button } from "@mui/material";

export default function SelectQuestion({
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
            render={({ field: { onChange, value } }) => {
                if(question.options != undefined){
                    return (
                    <> 
                        {question.options.map( (o) => (
                            <Button
                                type="button"
                                key={question.key + "_" + o.choiceLabel + "_" + o.choiceValue}
                                variant="contained"
                                color={value == o.choiceValue ? 'primary' : 'secondary'}
                                onClick={() => onChange(o.choiceValue)}
                            >
                                {o.choiceLabel}
                            </Button>
                        ))}
                    </>
                    );
                }else{
                    return (
                        <></>
                    );
                }
                
            }}
        />
    );
  };