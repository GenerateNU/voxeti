import FiltersStep from "./UploadFlowComponents/FiltersStep";
import PriceEstimation from "./UploadFlowComponents/PriceEstimation";
import UploadFile from "./UploadFlowComponents/UploadFile";
import Notes from "./UploadFlowComponents/Notes";
import PreviewPrint from "./UploadFlowComponents/PreviewPrint";
import ConfirmationPage from "./UploadFlowComponents/ConfirmationPage";

export interface UploadFlowProps {
    states: {
        currentStep: number,
        uploadedFiles: File[],
        color: string,
        quantity: number,
        delivery: string,
        expirationDate: string,
        price: number
    },
    setters: {
        currentStep: React.Dispatch<React.SetStateAction<number>>;
        uploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
        color: React.Dispatch<React.SetStateAction<string>>;
        quantity: React.Dispatch<React.SetStateAction<number>>;
        delivery: React.Dispatch<React.SetStateAction<string>>;
        expirationDate: React.Dispatch<React.SetStateAction<string>>;
        price: React.Dispatch<React.SetStateAction<number>>;
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
    const finalStep = () => {
        console.log(states);
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
                    2: <PreviewPrint
                            states={states}
                            setNextStep={nextStep}
                            cancelStep={cancelStep}
                            />,
                    3: <FiltersStep 
                            states={states}
                            setters={setters}
                            setNextStep={nextStep}
                            cancelStep={cancelStep}
                            />,
                    4: <PriceEstimation 
                            states={states}
                            setters={setters}
                            setNextStep={nextStep}
                            cancelStep={cancelStep}
                            editFile={() => setters.currentStep(1)}
                            editFilter={() => setters.currentStep(2)}
                            />,
                    5: <Notes 
                            states={states} 
                            cancelStep={cancelStep}
                            nextStep={nextStep}/>,
                    6: <ConfirmationPage 
                            states={states} 
                            cancelStep={cancelStep}
                            finalAction={finalStep}/>
                }[states.currentStep]
            }
        </div>
    )
}