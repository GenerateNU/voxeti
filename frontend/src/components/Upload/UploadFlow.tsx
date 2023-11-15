import FiltersStep from "./UploadFlowComponents/FiltersStep";
import PriceEstimation from "./UploadFlowComponents/PriceEstimation";
import UploadFile from "./UploadFlowComponents/UploadFile";
import Notes from "./UploadFlowComponents/Notes";
import PreviewPrint from "./UploadFlowComponents/PreviewPrint";
import ConfirmationPage from "./UploadFlowComponents/ConfirmationPage";
import { Setters, States } from "./upload.types";
import router from "../../router";
import JobSubmitting from "./UploadFlowComponents/JobSubmitting";

export interface UploadFlowProps {
    states: States,
    setters: Setters,
    onSubmit: () => void
}
export default function UploadFlow({
    states,
    setters,
    onSubmit
}: UploadFlowProps) {

    const nextStep = () => {
        setters.currentStep(states.currentStep += 1);
    }
    const cancelStep = () => {
        setters.currentStep(1);
        setters.uploadedFiles([])
        setters.prices([])
    }
    const finalStep = () => {
        setters.color("")
        setters.uploadedFiles([])
        setters.delivery("")
        setters.expirationDate("")
        setters.filament("")
        setters.prices([])
        setters.quantity(1)
        setters.quality('0.2')
        router.navigate({ to: "/" })
    }

    return (
        <div className=''>
            {
                {
                    1: <UploadFile
                            files={states.uploadedFiles}
                            setFiles={setters.uploadedFiles}
                            setNextStep={nextStep}
                            cancelStep={cancelStep}
                            setPrices={setters.prices}
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
                            editFilter={() => setters.currentStep(3)}
                            slice={setters.slice}
                            />,
                    5: <Notes
                            states={states}
                            cancelStep={cancelStep}
                            nextStep={onSubmit}
                        />,
                    6: <JobSubmitting />,
                    7: <ConfirmationPage
                            states={states}
                            cancelStep={cancelStep}
                            finalAction={finalStep}
                        />
                }[states.currentStep]
            }
        </div>
    )
}
