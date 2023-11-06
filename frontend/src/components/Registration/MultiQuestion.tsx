import { Control, Controller, FieldValues } from "react-hook-form";
import { FormQuestion } from "../../utils/questions";
import { Button } from "@mui/material";

export default function MultiQuestion({
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
            defaultValue={[]}
            render={({ field: { onChange, value } }: { field: { onChange: (value: any[]) => void, value: any[] } }) => {
                if(question.options != undefined){
                    return (
                    <> 
                        {question.options.map( (o) => (
                            <Button
                                type="button"
                                key={question.key + "_" + o.choiceLabel + "_" + o.choiceValue}
                                variant="contained"
                                color={value.includes(o.choiceValue) ? 'primary' : 'secondary'}
                                onClick={() => {
                                    if(value.includes(o.choiceValue)){
                                        onChange(value.filter((v) => v != o.choiceValue));
                                    }else{
                                        onChange([...value, o.choiceValue]);
                                    }
                                }}
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