import FiltersStep from "./UploadFlowComponents/FiltersStep";
import PriceEstimation from "./UploadFlowComponents/PriceEstimation";
import UploadFile from "./UploadFlowComponents/UploadFile";
import Notes from "./UploadFlowComponents/Notes";

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
        setters.uploadedFiles([])
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
                    3: <PriceEstimation 
                            states={states}
                            setNextStep={nextStep}
                            cancelStep={cancelStep}
                            editFile={() => setters.currentStep(1)}
                            editFilter={() => setters.currentStep(2)}
                            />,
                    4: <Notes states={states} cancelStep={cancelStep}/>
                }[states.currentStep]
            }
        </div>
    )
}