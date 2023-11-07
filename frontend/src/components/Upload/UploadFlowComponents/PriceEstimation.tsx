import { Box, Container, CircularProgress } from "@mui/material"
import BottomNavOptions from "../BottomNavOptions"
import { useEffect, useState } from "react"
import PriceEstimateBox, { PriceEstimateBoxProps } from "../PriceEstimateBox"
import { createPrintAPI } from "../../../api/printAPI"

export interface PriceEstimationProps {
    states: {
        currentStep: number,
        uploadedFiles: File[],
        color: string,
        quantity: number,
        delivery: string,
        expirationDate: string,
        price: number,
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
    setNextStep: () => void,
    cancelStep: () => void,
    editFile: () => void,
    editFilter: () => void
}

export default function PriceEstimation({
    states, 
    setNextStep,
    cancelStep,
    editFile,
    editFilter
}: PriceEstimationProps) {
    type filterItem = {label: string, value: string | number}
    const listFilters: filterItem[] = [
        {label: "Color", value: states.color},
        {label: "Quantity", value: states.quantity},
        {label: "Delivery", value: states.delivery},
        {label: "Expiration Date", value: states.expirationDate}
    ]
    const [priceBody, setPriceBody] = useState<PriceEstimateBoxProps | undefined>();

    const handleUpload = async () => {
        const result = await createPrintAPI();
        setPriceBody(result);
    }

    useEffect(() => {
        handleUpload()
    }, [states.uploadedFiles, states.delivery, states.quantity, states.color])

    
    return (
        <Container>
            <Box>
                <div className="text-xl font-semibold">Price Estimation</div>
                <div className="text-sm text-[#777777] mb-6">
                    This is the price estimated from your filter choices.
                </div>
            </Box>

            <Box className="flex flex-row gap-x-6 justify-between">
                <Box className="flex flex-col gap-y-4 w-[55vw] h-[45vh]">
                    <Box className="p-6 px-8 rounded-md border-2 border-[#F1F1F1] h-1/2 flex flex-row justify-between gap-x-2">
                        <Box className="flex flex-col h-[100%]">
                            <div className="text-xl font-semibold mb-2">File Upload</div>
                            <div className="flex flex-row flex-wrap">
                            {
                                states.uploadedFiles.map((file: File, index: number) => {
                                    return (
                                        <div className="text-sm text-[#888888] mr-1">
                                            {file.name}{index < states.uploadedFiles.length - 1 && ","}
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </Box>
                        <div 
                            className="p-2 px-6 bg-[#F1F1F1] text-md rounded-xl hover:bg-[#777777] h-[fit-content]"
                            onClick={editFile}>
                                edit
                        </div>
                    
                    </Box>
                    <Box className="p-6 px-8 rounded-md border-2 border-[#F1F1F1] h-full flex flex-row justify-between gap-x-2">
                        <Box>
                            <div className="text-xl font-semibold mb-2">Filters</div>
                            {
                                listFilters.map((item: filterItem) => {
                                    return (
                                        <div className="text-md mb-0.5 text-[#888888]">
                                            {item.label}: {item.value} {item.label == "Quantity" ? " piece(s)" : ""}
                                        </div>
                                    )
                                })
                            }
                        </Box>
                        <div 
                            className="p-2 px-6 bg-[#F1F1F1] text-md rounded-xl hover:bg-[#777777] h-[fit-content]"
                            onClick={editFilter}>
                                edit
                        </div>
                    </Box>
                </Box>
                <Box className="flex flex-col gap-y-4 w-[35vw] h-[45vh]">
                    <Box className="p-8 rounded-md border-2 border-[#F1F1F1] h-full flex flex-row justify-between gap-x-2">
                        { 
                            !priceBody ? (
                                <Box className="flex flex-col items-center h-full w-full">
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <PriceEstimateBox price={priceBody.price} 
                                    taxPercent={priceBody.taxPercent}
                                    shippingCost={priceBody.shippingCost}/>
                            )
                        }
                    </Box>
                </Box>
            </Box>
            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={true}/>
        </Container>
    )

}