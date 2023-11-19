import { Box, Container } from "@mui/material"
import { useEffect, useState } from "react"
import PriceEstimateBox from "../PriceEstimateBox"
import { PriceObject, States } from "../upload.types"
import { EstimateBreakdown } from "../../../api/api.types"

export interface ConfirmationPageProps {
    states: States,
}

export default function ConfirmationPage({
    states,
}: ConfirmationPageProps) {

    type filterItem = {label: string, value: string | number}
    const listFilters: filterItem[] = [
        {label: "Color", value: states.color},
        {label: "Quantity", value: states.quantity},
        {label: "Delivery", value: states.delivery},
        {label: "Expiration Date", value: states.expirationDate}
    ]
    const [prices, setPrices] = useState<PriceObject[]>([]);
    const [taxes, setTaxes] = useState<number[]>([]);
    const [shippings, setShippings] = useState<number[]>([]);

    useEffect(() => {
        setPrices(states.prices.map( (breakdown: EstimateBreakdown, index) => {
            return {
                file: breakdown.file,
                total: breakdown.total - breakdown.taxCost - breakdown.shippingCost,
                quantity: states.quantities[index],
            };
        }));
        setTaxes(states.prices.map((breakdown: EstimateBreakdown) => breakdown.taxCost));
        setShippings(states.prices.map((breakdown: EstimateBreakdown) => breakdown.shippingCost));
    }, [states.prices, states.quantities])

    return (
        <Container>
            <Box>
                <div className="text-2xl font-semibold mb-3">Confirmation</div>
                <div className="text-lg text-[#777777] mb-10">
                    Please review your order!
                </div>
            </Box>

            <Box className="flex flex-row flex-wrap gap-x-6 justify-between">
                <Box className="flex flex-col gap-y-4 w-[100%] sm:w-[55%] min-h-[350px]">
                    <Box className="p-6 px-8 rounded-md border-2 border-[#F1F1F1] h-1/2 flex flex-row justify-between gap-x-2">
                        <Box className="flex flex-col h-[100%]">
                            <div className="text-xl font-semibold mb-3">File Upload</div>
                            <div className="flex flex-row flex-wrap">
                            {
                                states.uploadedFiles.map((file: File, index: number) => {
                                    return (
                                        <div className="text-md text-[#888888] mr-1">
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
                            <div className="text-xl font-semibold mb-3">Filters</div>
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
                <Box className="flex flex-col gap-y-4 w-[100%] sm:w-[40%] min-h-[350px] mt-4 sm:mt-0">
                    <Box className="p-8 rounded-md border-2 border-[#F1F1F1] h-full flex flex-col justify-between gap-x-2">
                        <PriceEstimateBox
                            prices={prices}
                            taxes={taxes}
                            shippingCost={shippings}
                            shipping={states.delivery}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}
