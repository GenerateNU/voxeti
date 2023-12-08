import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EstimateBreakdown, PriceEstimation, SlicerData } from "./api.types";
import { RootState } from "../store/store";

export const createSlicerApi = (baseUrl: string) =>
  createApi({
    reducerPath: "slicerApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/slicer`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      sliceDesigns: builder.mutation<SlicerData, FormData>({
        query: (body) => ({
          body,
          method: "POST",
          url: "/",
        }),
      }),
    }),
  });

export const createPriceEstimationApi = (baseUrl: string) =>
  createApi({
    reducerPath: "priceEstimationApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/slicer`,
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).user.csrfToken;
        console.log(token);
        if (token) {
          headers.set("Csrftoken", token);
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
      estimatePrices: builder.mutation<EstimateBreakdown[], PriceEstimation>({
        query: (body) => ({
          body,
          method: "POST",
          url: "/",
        }),
      }),
    }),
  });
