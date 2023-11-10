import { EstimateBreakdown } from "../../api/api.types"

export type PriceEstimate = {
    prices: PriceObject[],
    taxRate: number,
    shippingCost: number

}

export type PriceObject = {
    fileName: string,
    price: number
}

export type States = {
    currentStep: number,
    uploadedFiles: File[],
    color: string,
    quantity: number,
    delivery: string,
    expirationDate: string
    prices: EstimateBreakdown[],
    filament: string
}

export type Setters = {
    currentStep: React.Dispatch<React.SetStateAction<number>>;
    uploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    color: React.Dispatch<React.SetStateAction<string>>;
    quantity: React.Dispatch<React.SetStateAction<number>>;
    delivery: React.Dispatch<React.SetStateAction<string>>;
    expirationDate: React.Dispatch<React.SetStateAction<string>>;
    filament: React.Dispatch<React.SetStateAction<string>>;
    slice: () => void;
}
