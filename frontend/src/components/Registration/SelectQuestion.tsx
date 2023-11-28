import { Control, Controller } from "react-hook-form";
import { FormQuestion } from "../../utilities/FormQuestions/registration";
import { Button } from "@mui/material";

export default function SelectQuestion({
    question,
    control,
    userType,
}:{
    question: FormQuestion
    control: Control
    userType: string
}) {
    const userTypeStylingSelected = `${userType === 'producer' ? '!bg-producer' : '!bg-designer'} !bg-opacity-80`
    const userTypeStylingHover = `${userType === 'producer' ? 'hover:!bg-producer' : 'hover:!bg-designer'}`

    return (
        <Controller
            key={question.key + "Controller"}
            control={control}
            name={question.key}
            rules={question.rules}
            defaultValue={question.defaultOption}
            render={({ field: { onChange, value } }) => {
                if(question.options){
                    return (
                    <div key={question.key + "Div"} className={question.gridPattern ?? 'flex flex-row justify-center lg:min-w-[450px] !mb-8 border border-[#000000] border-opacity-10 rounded-md'}>
                        {question.options.map( (o) => (
                            <Button
                                type="button"
                                key={question.key + "_" + o.choiceLabel + "_" + o.choiceValue}
                                variant="contained"
                                className={`h-12 !w-full
                                    ${ (value == o.choiceValue) ? (o.selectedColor ?? userTypeStylingSelected) : `!bg-[#fefefe] hover:!bg-opacity-20` }
                                    !rounded-[5px] ${o.hoverColor ?? userTypeStylingHover} !normal-case !font-light !text-lg !flex !flex-col
                                    ${!(o.choiceSubtitle) ? "!items-center" : "!items-start"}
                                    ${question.key != 'userType' ? '!p-16' : '!p-8'}
                                    ${!question.gridPattern && '!shadow-none'}`
                            }
                                onClick={() => onChange(o.choiceValue)}
                            >
                                <h1 className={`${value == o.choiceValue && o.selectedColor ? '!text-[#FFFFFF]' : '!text-[#000000]'} text-base font-medium`}>{o.choiceLabel}</h1>
                                {o.choiceSubtitle && <p className={'!text-sm !mt-2 !text-[#434343] text-left'}>{o.choiceSubtitle}</p> }
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
