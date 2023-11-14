import { Box, Container, CircularProgress } from "@mui/material"
import BottomNavOptions from "../BottomNavOptions"
import { useEffect, useState } from "react"
import PriceEstimateBox from "../PriceEstimateBox"
import StyledButton from "../../Button/Button"
import { PriceObject, Setters, States } from "../upload.types"
import { EstimateBreakdown } from "../../../api/api.types"

export interface PriceEstimationProps {
    states: States,
    setters: Setters,
    setNextStep: () => void,
    cancelStep: () => void,
    editFile: () => void,
    editFilter: () => void,
    slice: () => void,
}

export default function PriceEstimation({
    states,
    setNextStep,
    cancelStep,
    editFile,
    editFilter,
    slice,
}: PriceEstimationProps) {
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
        setPrices(states.prices.map( (breakdown: EstimateBreakdown) => {
            return {
                file: breakdown.file,
                total: breakdown.total - breakdown.taxCost - breakdown.shippingCost
            };
        }));
        setTaxes(states.prices.map((breakdown: EstimateBreakdown) => breakdown.taxCost));
        setShippings(states.prices.map((breakdown: EstimateBreakdown) => breakdown.shippingCost));
    }, [states.prices])

    return (
        <Container>
            <Box>
                <div className="text-xl font-semibold">Price Estimation</div>
                <div className="text-sm text-[#777777] mb-6">
                    This is the price estimated from your filter choices.
                </div>
            </Box>
            <Box className="flex flex-row flex-wrap gap-x-6 justify-between">
                <Box className="flex flex-col gap-y-4 w-[100%] sm:w-[55%] h-[45vh] min-h-[350px]">
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
                        <StyledButton
                            size={'sm'}
                            color={'seconday'}
                            onClick={editFile}>
                                Edit
                        </StyledButton>

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
                        <StyledButton
                            size={'sm'}
                            color={'seconday'}
                            onClick={editFilter}>
                                Edit
                        </StyledButton>
                    </Box>
                </Box>
                <Box className="flex flex-col gap-y-4 w-[100%] sm:w-[40%] h-[45vh] min-h-[350px] mt-4 sm:mt-0">
                    <Box className="p-8 rounded-md border-2 border-[#F1F1F1] h-full flex flex-col justify-between gap-x-2">
                        {
                            states.isLoading ? (
                                <Box className="flex flex-col items-center h-full w-full justify-center align-middle">
                                    <CircularProgress sx={{marginBottom: '15px'}}/>
                                    <h1 className='text-md font-medium animate-pulse'>Calculating your estimated price...</h1>
                                </Box>
                            ) : (
                                <PriceEstimateBox
                                    prices={prices}
                                    taxes={taxes}
                                    shippingCost={shippings}
                                    shipping={states.delivery}
                                />
                            )
                        }
                        <StyledButton
                            onClick={slice}
                            disabled={states.isLoading || states.prices.length > 0}
                        >
                            Get Price Estimate
                        </StyledButton>
                    </Box>
                </Box>
            </Box>
            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={states.prices.length !== 0}/>
        </Container>
    )

}
