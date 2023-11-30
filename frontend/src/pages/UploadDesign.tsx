import { useState } from "react";
import VoxetiStepper from "../components/Upload/VoxetiStepper";
import UploadFlow from "../components/Upload/UploadFlow";
import { jobApi, priceEstimationApi, slicerApi } from "../api/api";
import {
  EstimateBreakdown,
  PriceEstimation,
  SlicerData,
} from "../api/api.types";
import useDesignUpload from "../hooks/use-design-upload";
import { useStateDispatch, useStateSelector } from "../hooks/use-redux";
import { Dimensions, FilamentType, Job } from "../main.types";
import router from "../router";
import BottomNavOptions from "../components/Upload/BottomNavOptions";
import Auth from "../components/Auth/Auth";
import { ErrorHandler } from "../utilities/errors";
import { useApiError } from "../hooks/use-api-error";

export function UploadDesign() {
  const {
    user: { addresses, id },
  } = useStateSelector((state) => state.user);

  const [currentStep, setCurrentStep] = useState<number>(1); // number, React.Dispatch<React.SetStateAction<number>>
  const [file, setFile] = useState<File[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [color, setColor] = useState<string>("White");
  const [quantity, setQuantity] = useState<number>(1);
  const [quality, setQuality] = useState<string>("0.2");
  const [delivery, setDelivery] = useState<string>("Shipping");
  const [expirationDate, setExpirationDate] = useState<string>("2 days");
  const [prices, setPrices] = useState<EstimateBreakdown[]>([]);
  const [filament, setFilament] = useState("PLA");
  const [dimensions, setDimensions] = useState<Dimensions[]>([]);
  const [address, setAddress] = useState<number>(0);
  const [isSlicing, setIsSlicing] = useState(false);

  const uploadDesigns = useDesignUpload(file, dimensions);

  const { addError, setOpen } = useApiError();
  const dispatch = useStateDispatch();

  const [sliceDesign] = slicerApi.useSliceDesignsMutation();
  const [estimatePrice] = priceEstimationApi.useEstimatePricesMutation();
  const [createJob] = jobApi.useCreateJobMutation();

  function handlePriceEstimation(priceEstimateRequest: PriceEstimation) {
    estimatePrice(priceEstimateRequest)
      .unwrap()
      .then((response: EstimateBreakdown[]) => {
        setPrices(response);
        setIsSlicing(false);
        return;
      })
      .catch((error) => {
        ErrorHandler({ dispatch, addError, setOpen, error });
        setIsSlicing(false);
        return;
      });
  }

  // Slice an uploaded design:
  async function handleSliceDesign(
    file: File,
    layerHeight: string,
    index: number
  ) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("layerHeight", layerHeight);

    return sliceDesign(formData)
      .unwrap()
      .then((data: SlicerData) => {
        // Compute slice dimensions:
        const height = Math.round((data.maxy - data.miny) * 100);
        const width = Math.round((data.maxx - data.minx) * 100);
        const depth = Math.round((data.maxz - data.minz) * 100);

        setDimensions((dimensions) => {
          dimensions[index] = { height: height, width: width, depth: depth };
          return dimensions;
        });

        return { ...data, quantity: quantities[index] };
      })
      .catch((error) => {
        ErrorHandler({ dispatch, addError, setOpen, error });
        setIsSlicing(false);
        return;
      });
  }

  // Slice a list of uploaded designs:
  const handleSlicing = async () => {
    setIsSlicing(true);
    Promise.all(
      file.map((file: File, index) => handleSliceDesign(file, quality, index))
    ).then((responses) => {
      const filteredResponses = responses.filter((response) => {
        return response != undefined;
      });

      if (filteredResponses.length === file.length) {
        const priceEstimateRequest: PriceEstimation = {
          shipping: delivery === "Shipping" ? true : false,
          filamentType: filament,
          slices: responses as SlicerData[],
        };
        handlePriceEstimation(priceEstimateRequest);
      }
    });
  };

  const formSubmit = async () => {
    // Upload the designs:
    const uploadResponse = await uploadDesigns();

    // Check if there was an error:
    if ("code" in uploadResponse) {
      console.log(uploadResponse);
      return;
    }

    const designIds: string[] = [];
    uploadResponse.map((file) => {
      designIds.push(file.id);
    });

    let totalPrice = 0;
    let shipping = 0;
    let taxes = 0;
    states.prices.map((prices) => {
      totalPrice += prices.total;
      shipping += prices.shippingCost;
      taxes = prices.taxCost;
    });

    const job: Job = {
      designerId: id,
      createdAt: new Date(),
      designId: designIds,
      quantity: quantities,
      status: "PENDING",
      price: Math.round(totalPrice * 100),
      shipping: Math.round(shipping * 100),
      taxes: Math.round(taxes * 100),
      color: states.color,
      filament: states.filament as FilamentType,
      shippingAddress: addresses[states.address],
      layerHeight: parseFloat(quality),
    };

    setters.currentStep((states.currentStep += 1));
    // Submit the job:
    createJob(job)
      .unwrap()
      .then(() => {
        setters.currentStep((states.currentStep += 1));
      })
      .catch((error) => {
        ErrorHandler({
          dispatch,
          addError,
          setOpen,
          error,
          customMessage:
            "An error occurred while creating your job. Please try again.",
        });
        setters.currentStep((states.currentStep -= 1));
      });
  };

  const nextStep = () => {
    setters.currentStep((states.currentStep += 1));
  };
  const cancelStep = () => {
    setters.currentStep(1);
    setters.uploadedFiles([]);
    setters.prices([]);
  };
  const finalStep = () => {
    setters.color("");
    setters.uploadedFiles([]);
    setters.delivery("");
    setters.expirationDate("");
    setters.filament("");
    setters.prices([]);
    setters.quantity(1);
    setters.quality("0.2");
    router.navigate({ to: "/jobs" });
  };

  // ----------- helpful objects to track state for the forms
  const states = {
    currentStep: currentStep,
    uploadedFiles: file,
    quantities: quantities,
    color: color,
    quantity: quantity,
    quality: quality,
    delivery: delivery,
    expirationDate: expirationDate,
    prices: prices,
    filament: filament,
    address: address,
    isLoading: isSlicing,
  };

  const setters = {
    currentStep: setCurrentStep,
    uploadedFiles: setFile,
    quantities: setQuantities,
    dimensions: setDimensions,
    color: setColor,
    quantity: setQuantity,
    quality: setQuality,
    delivery: setDelivery,
    expirationDate: setExpirationDate,
    slice: handleSlicing,
    filament: setFilament,
    address: setAddress,
    prices: setPrices,
  };
  // -----------

  const buttonsEnabled: Map<string, boolean> = new Map([
    ["1", file.length >= 1],
    ["2", true],
    ["3", filament !== "" && quality !== ""],
    ["4", prices.length >= 1],
    ["5", true],
    ["6", true],
  ]);

  const isSubmitStep = currentStep === 5;
  const isFinalStep = currentStep === 7;

  console.log(currentStep);

  return (
    <Auth authRoute={true}>
      <div className="container mx-auto mt-16 grow h-[100%]">
        <div className="z-0 min-h-[84vh] flex flex-col">
          <VoxetiStepper currentStep={currentStep} />
          <UploadFlow states={states} setters={setters} />
          <BottomNavOptions
            cancel={cancelStep}
            nextPage={
              isFinalStep ? finalStep : isSubmitStep ? formSubmit : nextStep
            }
            enabled={buttonsEnabled.get(currentStep.toString()) as boolean}
            step={currentStep}
          />
        </div>
      </div>
    </Auth>
  );
}
