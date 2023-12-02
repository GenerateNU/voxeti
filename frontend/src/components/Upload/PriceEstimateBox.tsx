import { Box, Divider, List } from "@mui/material";
import { PriceObject } from "./upload.types";

export interface PriceEstimateBoxProps {
  prices: PriceObject[];
  taxes: number[];
  shippingCost: number[];
  shipping: string;
}

export default function PriceEstimateBox({
  prices,
  taxes,
  shippingCost,
  shipping,
}: PriceEstimateBoxProps) {
  const totalBasePrice = prices.reduce(
    (accum: number, currentValue: PriceObject) => accum + currentValue.total,
    0
  );
  const totalTaxAmount = taxes.reduce(
    (accum: number, currentValue: number) => accum + currentValue,
    0
  );
  const totalShippingAmount = shippingCost.reduce(
    (accum: number, currentValue: number) => accum + currentValue,
    0
  );
  const taxRate =
    (totalTaxAmount / (totalBasePrice + totalShippingAmount)) * 100;

  return (
    <List className="h-full w-full flex flex-col items-center">
      <Box className="w-full mb-4 flex flex-col">
        <Box className="w-full justify-between flex flex-row">
          <div className="font-bold font-display">Price</div>
          <div className="text-[#777777]">${totalBasePrice.toFixed(2)}</div>
        </Box>
        {(prices.length > 1 || prices[0]?.quantity > 1) && (
          <Divider className="w-[100%] !mt-3" />
        )}
        {(prices.length > 1 || prices[0]?.quantity > 1) && (
          <Box className="w-full pl-4 mt-3 md:!max-h-[100px] overflow-scroll">
            {prices.map((priceObj: PriceObject, index: number) => {
              return (
                <div
                  className={`flex flex-row justify-between w-full text-[#777777] text-md ${
                    index > 0 ?? "mt-2"
                  } mb-0`}
                >
                  <div className="text-[#444444]">
                    {priceObj.quantity} x {priceObj.file}
                  </div>
                  <div>
                    $
                    {prices.length === 1
                      ? (priceObj.total / priceObj.quantity).toFixed(2)
                      : priceObj.total.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </Box>
        )}
      </Box>
      {shipping === "Shipping" ? (
        <Box className="w-full mb-4 justify-between flex flex-row">
          <div className="font-bold font-display">Shipping cost</div>
          <div className="text-[#777777]">
            ${totalShippingAmount.toFixed(2)}
          </div>
        </Box>
      ) : (
        <></>
      )}
      <Box className="w-full mb-4 justify-between flex flex-row">
        <div className="font-bold font-display">
          Tax ({taxRate.toFixed(2)}%)
        </div>
        <div className="text-[#777777]">${totalTaxAmount.toFixed(2)}</div>
      </Box>
      <Divider className="w-[100%]" />
      <Box className="w-full mt-4 justify-between flex flex-row">
        <div className="font-bold font-display">Total price</div>
        <div className="text-[#777777]">
          ${(totalBasePrice + totalTaxAmount + totalShippingAmount).toFixed(2)}
        </div>
      </Box>
    </List>
  );
}
