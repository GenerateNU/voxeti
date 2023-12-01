import { Control, Controller } from "react-hook-form";
import { FormQuestion } from "../../utilities/FormQuestions/registration";
import { Button } from "@mui/material";

export default function MultiQuestion({
    question,
    control,
    userType,
}:{
    question: FormQuestion
    control: Control
    userType: string
}) {
    const userTypeStylingSelected = `${userType === 'PRODUCER' ? '!bg-producer' : '!bg-designer'} !bg-opacity-80 !hover:!bg-opacity-80`
    const userTypeStylingHover = userType === 'PRODUCER' ? 'hover:!bg-producer' : 'hover:!bg-designer'

    return (
        <Controller
            key={question.key + "Controller"}
            control={control}
            name={question.key}
            defaultValue={[]}
            rules={question.rules}
            render={({ field: { onChange, value } }: { field: { onChange: (value: Array<string | number>) => void, value: Array<string | number> } }) => {
                if(question.options != undefined){
                    return (
                    <div key={question.key + "Div"} className={question.gridPattern ? question.gridPattern : '!w-full flex flex-row justify-center lg:min-w-[450px] space-x-2'}>
                        {question.options.map( (o) => (
                            <Button
                                type="button"
                                key={question.key + "_" + o.choiceLabel + "_" + o.choiceValue}
                                variant="contained"
                                className={`h-12 w-full
                                ${ (value.includes(o.choiceValue)) ? userTypeStylingSelected : `!bg-[#fefefe] hover:!bg-opacity-20` }
                                !rounded-[5px] ${userTypeStylingHover} !normal-case !font-light !text-lg !flex !flex-col
                                ${!(o.choiceSubtitle) ? "!items-center" : "!items-start"} !p-16`}
                                onClick={() => {
                                    if(value.includes(o.choiceValue)){
                                        onChange(value.filter((v) => v != o.choiceValue));
                                    }else{
                                        onChange([...value, o.choiceValue]);
                                    }
                                }}
                            >
                                <h1 className=" !text-[#000000] font-medium text-base">{o.choiceLabel}</h1>
                                <p className={'!text-sm !text-[#434343]'}>{o.choiceSubtitle}</p>
                            </Button>
                        ))}
                    </div>
                    );
                }else{
                    return (
                        <></>
                    );
                }

            }}
        />
    );
  }
