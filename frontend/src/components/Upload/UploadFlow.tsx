import FiltersStep from "./UploadFlowComponents/FiltersStep";
import PriceEstimation from "./UploadFlowComponents/PriceEstimation";
import UploadFile from "./UploadFlowComponents/UploadFile";
import Notes from "./UploadFlowComponents/Notes";
import PreviewPrint from "./UploadFlowComponents/PreviewPrint";
import ConfirmationPage from "./UploadFlowComponents/ConfirmationPage";
import { Setters, States } from "./upload.types";

export interface UploadFlowProps {
    states: States,
    setters: Setters
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
                            slice={setters.slice}
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