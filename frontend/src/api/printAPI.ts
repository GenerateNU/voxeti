// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
/**
 *  TODO: once details are available, swap this to use the createAPI logic
 *  price estimate - get,
 *  image preview - get
 *  something to note - in the future taxPercent and shippingCost probably need to be 
 *  calculated from user infromation / other filters, so the price estimate function
 *  would just need to know the calculated price of the object
 * */ 

export const createPrintAPI = async () => {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), 3000)).then(()=>console.log("retrieved the mock data"));
    return {
        price: 180.35,
        taxPercent: 0.0625,
        shippingCost: 45.67
    }
}
