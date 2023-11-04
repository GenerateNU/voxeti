import FiltersStep from "./UploadFlowComponents/FiltersStep";
import UploadFile from "./UploadFlowComponents/UploadFile";

export interface UploadFlowProps {
    states: {
        currentStep: number,
        uploadedFiles: File[],
        color: string,
        quantity: number,
        delivery: string,
        expirationDate: string
    },
    setters: {
        currentStep: React.Dispatch<React.SetStateAction<number>>;
        uploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
        color: React.Dispatch<React.SetStateAction<string>>;
        quantity: React.Dispatch<React.SetStateAction<number>>;
        delivery: React.Dispatch<React.SetStateAction<string>>;
        expirationDate: React.Dispatch<React.SetStateAction<string>>;
    }
}
export default function UploadFlow({
    states,
    setters
}: UploadFlowProps) {
    const nextStep = () => {
        setters.currentStep(states.currentStep += 1);
    }
    const cancelStep = () => {
        setters.currentStep(1);
    }
    return (
        <div>
            {
                {
                    1: <UploadFile 
                            files={states.uploadedFiles} 
                            setFiles={setters.uploadedFiles}
                            setNextStep={nextStep}
                            cancelStep={cancelStep}
                            />,
                    2: <FiltersStep 
                            states={states}
                            setters={setters}
                            setNextStep={nextStep}
                            cancelStep={cancelStep}
                            />,
                    3: null,
                    4: null
                }[states.currentStep]
            }
        </div>
    )
}