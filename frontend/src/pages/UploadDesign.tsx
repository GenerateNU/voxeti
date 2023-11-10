import { useState } from 'react';
import TopBar from "../components/Upload/TopBar";
import VoxetiStepper from '../components/Upload/VoxetiStepper';
import UploadFlow from '../components/Upload/UploadFlow';

export function UploadDesign() {
    const [currentStep, setCurrentStep] = useState<number>(1); // number, React.Dispatch<React.SetStateAction<number>>
    const [file, setFile] = useState<File[]>([]);
    const [color, setColor] = useState<string>("White");
    const [quantity, setQuantity] = useState<number>(1);
    const [delivery, setDelivery] = useState<string>("Shipping");
    const [expirationDate, setExpirationDate] = useState<string>("2 days");
    const [price, setPrice] = useState<number>(0);
    const [filament, setFilament] = useState('')

    // ----------- helpful objects to track state for the forms
    const states = {
        currentStep: currentStep,
        uploadedFiles: file,
        color: color,
        quantity: quantity,
        delivery: delivery,
        expirationDate: expirationDate,
        price: price,
        filament: filament
    }

    const setters = {
        currentStep: setCurrentStep,
        uploadedFiles: setFile,
        color: setColor,
        quantity: setQuantity,
        delivery: setDelivery,
        expirationDate: setExpirationDate,
        price: setPrice,
        filament: setFilament
    }
    // -----------
    return (
        <div className="container mx-auto mt-3.5">
            <div className="z-0">
                <TopBar/>
            </div>
            <div className="z-0">
                <VoxetiStepper currentStep={currentStep}/>
                <UploadFlow states={states} setters={setters}/>
            </div>
        </div>
    )
}