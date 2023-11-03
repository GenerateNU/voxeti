import { useState } from 'react';
import TopBar from "../components/Upload/TopBar";
import VoxetiStepper from '../components/Upload/VoxetiStepper';
import UploadFlow from '../components/Upload/UploadFlow';

export function UploadDesign() {
    const [currentStep, setCurrentStep] = useState<number>(1); // number, React.Dispatch<React.SetStateAction<number>>
    const [uploadedFile, setUploadedFile] = useState<string | undefined>();
    const [color, setColor] = useState<string>("White");
    const [quantity, setQuantity] = useState<number>(1);
    const [delivery, setDelivery] = useState<string>("Shipping");
    const [expirationDate, setExpirationDate] = useState<string>("3 days");

    // ----------- helpful objects to track state for the forms
    const states = {
        currentStep: currentStep,
        uploadedFile: uploadedFile,
        color: color,
        quantity: quantity,
        delivery: delivery,
        expirationDate: expirationDate
    }

    const setters = {
        currentStep: setCurrentStep,
        uploadedFile: setUploadedFile,
        color: setColor,
        quantity: setQuantity,
        delivery: setDelivery,
        expirationDate: setExpirationDate
    }
    // -----------
    return (
        <div className="container mx-auto mt-3.5">
            <TopBar/>
            <VoxetiStepper currentStep={currentStep}/>
            <UploadFlow states={states} setters={setters}/>
        </div>
    )
}