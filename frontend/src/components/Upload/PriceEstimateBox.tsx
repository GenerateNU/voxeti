import { Box, Divider, List } from "@mui/material";
import { PriceObject } from "./upload.types";

export interface PriceEstimateBoxProps {
  prices: PriceObject[],
  taxRate: number,
  shippingCost: number,
}

export default function PriceEstimateBox({
  prices,
  taxRate,
  shippingCost
}: PriceEstimateBoxProps) {
  const totalBasePrice = prices.reduce(
    (accum: number, currentValue: PriceObject) => accum + currentValue.price,
    0
  );
  return (
    <List className="h-full w-full flex flex-col items-center">
      <Box className="w-full mb-4 flex flex-col">
				<Box className="w-full justify-between flex flex-row mb-2">
					<div className="font-semibold">Price</div>
          <div className="text-[#777777]">
            ${totalBasePrice}
          </div>
				</Box>
				{prices.length > 1 && <Divider className="w-[100%]" />}
				{prices.length > 1 && (
          <Box className="w-full pl-4 mt-2">
            {
              prices.map((priceObj: PriceObject, index: number) => {
                return (
                  <div className={`flex flex-row justify-between w-full text-[#777777] text-sm ${index > 0 ?? "mt-2"} mb-0`}>
                    <div className="text-[#444444]">{priceObj.fileName}</div>
                    <div>${priceObj.price}</div>
                  </div>
                )
              })
            }
				</Box>
        )}
      </Box>
      <Box className="w-full mb-4 justify-between flex flex-row">
				<div className="font-semibold">Tax ({taxRate * 100}%)</div>
        <div className="text-[#777777]">
          ${(totalBasePrice * taxRate).toFixed(2)}
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
            ${(totalBasePrice + totalBasePrice * taxRate + shippingCost).toFixed(2)}
          </div>
        </Box>
    </List>
    )
}