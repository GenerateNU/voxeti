import { useState } from 'react';
import VoxetiStepper from '../components/Upload/VoxetiStepper';
import UploadFlow from '../components/Upload/UploadFlow';
import { jobApi, priceEstimationApi, slicerApi } from '../api/api';
import { EstimateBreakdown, PriceEstimation, SlicerData } from '../api/api.types';
import useDesignUpload from '../hooks/use-design-upload';
import { useStateSelector } from '../hooks/use-redux';
import { FilamentType, Job } from '../main.types';
import { useApiError } from '../hooks/use-api-error';

export function UploadDesign() {
	const [currentStep, setCurrentStep] = useState<number>(1); // number, React.Dispatch<React.SetStateAction<number>>
	const [file, setFile] = useState<File[]>([]);
	const [color, setColor] = useState<string>("White");
	const [quantity, setQuantity] = useState<number>(1);
	const [quality, setQuality] = useState<string>('0.2');
	const [delivery, setDelivery] = useState<string>("Shipping");
	const [expirationDate, setExpirationDate] = useState<string>("2 days");
	const [prices, setPrices] = useState<EstimateBreakdown[]>([]);
	const [filament, setFilament] = useState('PLA')
	const [isSlicing, setIsSlicing] = useState(false);

	const { user : { id } } = useStateSelector((state) => state.user)
  const uploadDesigns = useDesignUpload(file);

  const [sliceDesign] = slicerApi.useSliceDesignsMutation();
	const [estimatePrice] = priceEstimationApi.useEstimatePricesMutation();
	const [createJob] = jobApi.useCreateJobMutation();

	const { addError, setOpen } = useApiError();

	function handlePriceEstimation(priceEstimateRequest : PriceEstimation) {
			estimatePrice(priceEstimateRequest)
				.unwrap()
				.then((response : EstimateBreakdown[]) => {
					setPrices(response);
					setIsSlicing(false);
					return;
				})
				.catch(() => {
					addError("Something wen't wrong, please try again.");
					setOpen(true);
					setIsSlicing(false);
				})
		}

	// Slice an uploaded design:
	async function handleSliceDesign(file : File, layerHeight : string) {
		const formData = new FormData()
		formData.append("file", file)
		formData.append("layerHeight", layerHeight)

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
	const handleSlicing = async () => {
		setIsSlicing(true);
		Promise.all(file.map((file : File) => handleSliceDesign(file, quality)))
			.then((responses) => {
				const errors = responses.filter((response) => response.status === 'FETCH_ERROR')
				if (errors.length > 0) {
					addError("Something wen't wrong, please try again.");
					setOpen(true);
					setIsSlicing(false);
				} else {
					const priceEstimateRequest : PriceEstimation = {
						shipping: delivery === 'Shipping' ? true : false,
						filamentType: filament,
						slices: responses
					}
					handlePriceEstimation(priceEstimateRequest);
				}
			})
	}

	const formSubmit = async () => {
		// Upload the designs:
		const uploadResponse = await uploadDesigns();

		// Check if there was an error:
		if ('code' in uploadResponse) {
				console.log(uploadResponse);
				return;
		}

		const designIds : string[] = []
		uploadResponse.map((file) => {
				designIds.push(file.id);
		})

		let totalPrice = 0
		let shipping = 0
		let taxes = 0
		states.prices.map((prices) => {
				totalPrice += prices.total
				shipping += prices.shippingCost
				taxes = prices.taxCost
		})

		const job : Job = {
				designerId: id,
				designId: designIds,
				status: "PENDING",
				price: totalPrice,
				shipping: shipping,
				taxes: taxes,
				color: states.color,
				filament: states.filament as FilamentType,
				quality: parseFloat(quality),
		}

		setters.currentStep(states.currentStep += 1)
		// Submit the job:
		createJob(job)
				.unwrap()
				.then(() => {
						setters.currentStep(states.currentStep += 1);
				})
				.catch(() => {
					addError("An error occurred while creating your job. Please try again.");
					setOpen(true);
					setIsSlicing(false);
				})
	}

	// ----------- helpful objects to track state for the forms
	const states = {
		currentStep: currentStep,
		uploadedFiles: file,
		color: color,
		quantity: quantity,
		quality: quality,
		delivery: delivery,
		expirationDate: expirationDate,
		prices: prices,
		filament: filament,
		isLoading: isSlicing,
	}

	const setters = {
		currentStep: setCurrentStep,
		uploadedFiles: setFile,
		color: setColor,
		quantity: setQuantity,
		quality: setQuality,
		delivery: setDelivery,
		expirationDate: setExpirationDate,
		slice: handleSlicing,
		filament: setFilament,
		prices: setPrices,
	}
	// -----------
	return (
		<div className="container mx-auto mt-3.5 grow">
			<div className="z-0">
				<VoxetiStepper currentStep={currentStep}/>
				<UploadFlow states={states} setters={setters} onSubmit={formSubmit}/>
			</div>
		</div>
	)
}
