import { Control, Controller } from "react-hook-form";
import { FormQuestion } from "../../utils/questions";
import { Button } from "@mui/material";

export default function MultiQuestion({
    question,
    control
}:{
    question: FormQuestion
    control: Control
}) {

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
                    <div key={question.key + "Div"} className={question.gridPattern ? question.gridPattern : '!w-full flex flex-row justify-center content-center lg:min-w-[450px] space-x-2'}>
                        {question.options.map( (o) => (
                            <Button
                                type="button"
                                key={question.key + "_" + o.choiceLabel + "_" + o.choiceValue}
                                variant="contained"
                                className={`h-12 w-[15vw] !hover:bg-[#999999] border-2 border-[#888888]
                                ${ (value.includes(o.choiceValue)) ? (o.selectedColor ? o.selectedColor : `!bg-[#f0f0f0]`) : `!bg-[#fefefe]` }
                                !rounded-[5px] hover:!bg-[#bcbcbc] !normal-case !font-light !text-lg !flex !flex-col 
                                ${!(o.choiceSubtitle) ? "!items-center" : "!items-start"} !p-10`}
                                onClick={() => {
                                    if(value.includes(o.choiceValue)){
                                        onChange(value.filter((v) => v != o.choiceValue));
                                    }else{
                                        onChange([...value, o.choiceValue]);
                                    }
                                }}
                            >
                                <h1 className=" !text-[#000000] font-medium">{o.choiceLabel}</h1>
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