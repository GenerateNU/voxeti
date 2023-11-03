import UploadFile from "./UploadFlowComponents/UploadFile";

export interface UploadFlowProps {
    states: {
        currentStep: number,
        uploadedFile: string | undefined,
        color: string,
        quantity: number,
        delivery: string,
        expirationDate: string
    },
    setters: {
        currentStep: React.Dispatch<React.SetStateAction<number>>;
        uploadedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
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
        setters.currentStep(states.currentStep += 1)
    }
    return (
        <div>
            {
                {
                    1: <UploadFile 
                            file={states.uploadedFile} 
                            setFile={setters.uploadedFile}
                            nextPage={nextStep}
                            />,
                    2: null,
                    3: null,
                    4: null
                }[states.currentStep]
            }
        </div>
    )
}