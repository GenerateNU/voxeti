import { Box, Container, CircularProgress } from "@mui/material"
import BottomNavOptions from "../BottomNavOptions"
import { useEffect, useState } from "react"
import PriceEstimateBox, { PriceEstimateBoxProps } from "../PriceEstimateBox"
import { createPrintAPI } from "../../../api/printAPI"
import { States } from "../upload.types"

export interface ConfirmationPageProps {
    states: States,
    finalAction: () => void,
    cancelStep: () => void,
}

export default function ConfirmationPage({
    states, 
    finalAction, 
    cancelStep
}: ConfirmationPageProps) {
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
                <div className="text-xl font-semibold">Confirmation</div>
                <div className="text-sm text-[#777777] mb-6">
                    Please review your order!
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
                                <PriceEstimateBox prices={priceBody.prices} 
                                    taxRate={priceBody.taxRate}
                                    shippingCost={priceBody.shippingCost}/>
                            )
                        }
                    </Box>
                </Box>
            </Box>
            <BottomNavOptions cancel={cancelStep} nextPage={finalAction} enabled={true}/>
        </Container>
    )
}