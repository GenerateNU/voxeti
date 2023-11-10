import { useState } from 'react';
import TopBar from "../components/Upload/TopBar";
import VoxetiStepper from '../components/Upload/VoxetiStepper';
import UploadFlow from '../components/Upload/UploadFlow';
import { priceEstimationApi, slicerApi } from '../api/api';
import { EstimateBreakdown, PriceEstimation, SlicerData } from '../api/api.types';

export function UploadDesign() {
    const [currentStep, setCurrentStep] = useState<number>(1); // number, React.Dispatch<React.SetStateAction<number>>
    const [file, setFile] = useState<File[]>([]);
    const [color, setColor] = useState<string>("White");
    const [quantity, setQuantity] = useState<number>(1);
    const [delivery, setDelivery] = useState<string>("Shipping");
    const [expirationDate, setExpirationDate] = useState<string>("2 days");
    const [prices, setPrices] = useState<EstimateBreakdown[]>([]);
		const [filament, setFilament] = useState('')


    const [sliceDesign] = slicerApi.useSliceDesignsMutation();
		const [estimatePrice] = priceEstimationApi.useEstimatePricesMutation();

		function handlePriceEstimation(priceEstimateRequest : PriceEstimation) {
			estimatePrice(priceEstimateRequest)
				.unwrap()
				.then((response : EstimateBreakdown[]) => {
					setPrices(response)
					return;
				})
				.catch((error) => {
					console.log(error)
					return
				})
		}

		// Slice an uploaded design:
    async function handleSliceDesign(file : File) {
			const formData = new FormData()
			formData.append("file", file)

			return sliceDesign(formData)
				.unwrap()
				.then((data : SlicerData) => {
					console.log(data);
					return data
				})
				.catch((error) => {
					return error
				})
    }

		// Slice a list of uploaded designs:
		const handleSlicing = () => {
			Promise.all(file.map((file : File) => handleSliceDesign(file)))
				.then((responses) => {
					const priceEstimateRequest : PriceEstimation = {
						filamentType: "PLA",
						slices: responses 
					}
					handlePriceEstimation(priceEstimateRequest);
				})
				.catch((error) => {
					console.log(error)
					return;
				})
		}

    // ----------- helpful objects to track state for the forms
    const states = {
			currentStep: currentStep,
			uploadedFiles: file,
			color: color,
			quantity: quantity,
			delivery: delivery,
			expirationDate: expirationDate,
			prices: prices,
      filament: filament
    }

    const setters = {
			currentStep: setCurrentStep,
			uploadedFiles: setFile,
			color: setColor,
			quantity: setQuantity,
			delivery: setDelivery,
			expirationDate: setExpirationDate,
			slice: handleSlicing,
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
					{prices.map((price) => price.timeCost)}
				</div>
			</div>
    )
}