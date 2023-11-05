import { Box, Divider, List } from "@mui/material";

export interface PriceEstimateBoxProps {
    price: number,
    taxPercent: number,
    shippingCost: number,
}

export default function PriceEstimateBox({
    price,
    taxPercent,
    shippingCost
}: PriceEstimateBoxProps) {
    return (
        <List className="h-full w-full flex flex-col items-center">
            <Box className="w-full mb-4 justify-between flex flex-row">
                <div className="font-semibold">Price</div>
                <div className="text-[#777777]">
                    ${price}
                </div>
            </Box>
            <Box className="w-full mb-4 justify-between flex flex-row">
                <div className="font-semibold">Tax ({taxPercent * 100}%)</div>
                <div className="text-[#777777]">
                    ${(price * taxPercent).toFixed(2)}
                </div>
            </Box>
            <Box className="w-full mb-4 justify-between flex flex-row">
                <div className="font-semibold">Shipping cost</div>
                <div className="text-[#777777]">
                    ${shippingCost}
                </div>
            </Box>
            <Divider className="w-[100%]" />
            <Box className="w-full mt-4 justify-between flex flex-row">
                <div className="font-semibold">Total price</div>
                <div className="text-[#777777]">
                    ${(price + price * taxPercent + shippingCost).toFixed(2)}
                </div>
            </Box>
        </List>
    )
}