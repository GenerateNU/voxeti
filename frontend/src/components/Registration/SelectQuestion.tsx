import { Control, Controller } from "react-hook-form";
import { FormQuestion } from "../../utils/questions";
import { Button } from "@mui/material";

export default function SelectQuestion({
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
            rules={question.rules}
            render={({ field: { onChange, value } }) => {
                if(question.options != undefined){
                    return (
                    <div key={question.key + "Div"} className={question.gridPattern ? question.gridPattern : 'flex flex-row justify-center lg:min-w-[450px] space-x-2'}> 
                        {question.options.map( (o) => (
                            <Button
                                type="button"
                                key={question.key + "_" + o.choiceLabel + "_" + o.choiceValue}
                                variant="contained"
                                className={`h-12 w-full 
                                ${ (value == o.choiceValue) ? (o.selectedColor ? o.selectedColor : `!bg-[#ababab]`) : `!bg-[#fefefe]` }
                                !rounded-[5px] hover:!bg-[#898989] !normal-case !font-light !text-lg !flex !flex-col !items-start !p-8`}
                                onClick={() => onChange(o.choiceValue)}
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
  };