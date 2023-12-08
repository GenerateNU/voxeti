import FiltersStep from "./UploadFlowComponents/FiltersStep";
import PriceEstimation from "./UploadFlowComponents/PriceEstimation";
import UploadFile from "./UploadFlowComponents/UploadFile";
import Notes from "./UploadFlowComponents/Notes";
import QuantityStep from "./UploadFlowComponents/QuantityStep";
import ConfirmationPage from "./UploadFlowComponents/ConfirmationPage";
import { Setters, States } from "./upload.types";
import JobSubmitting from "./UploadFlowComponents/JobSubmitting";
import Checkout from "./UploadFlowComponents/Checkout";

export interface UploadFlowProps {
    states: States,
    setters: Setters,
}
export default function UploadFlow({
    states,
    setters,
}: UploadFlowProps) {

    return (
        <div className='h-[80%] mb-auto'>
            {
                {
                    1: <UploadFile
                            files={states.uploadedFiles}
                            setFiles={setters.uploadedFiles}
                            setQuantities={setters.quantities}
                            setDimensions={setters.dimensions}
                            setPrices={setters.prices}
                            />,
                    2: <QuantityStep
                            states={states}
                            setQuantities={setters.quantities}
                            />,
                    3: <FiltersStep
                            states={states}
                            setters={setters}
                            />,
                    4: <PriceEstimation
                            states={states}
                            setters={setters}
                            editFile={() => setters.currentStep(1)}
                            editFilter={() => setters.currentStep(3)}
                            slice={setters.slice}
                            />,
                    5: <Notes
                            states={states}
                        />,
                    6: <Checkout
                            states={states}
                            setters={setters}
                        />,
                    7: <JobSubmitting />,
                    8: <ConfirmationPage
                            states={states}
                        />
                }[states.currentStep]
            }
        </div>
    )
}
