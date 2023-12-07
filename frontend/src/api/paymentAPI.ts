import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CheckoutSessionData, CheckoutState } from "./api.types";

// payment API:
export const createPaymentApi = (baseUrl: string) =>
  createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/payment`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      createPayment: builder.mutation<CheckoutSessionData, CheckoutState>({
        query: (body) => ({
          body,
          method: "POST",
          url: "/create-checkout-session",
        }),
      }),
    }),
  });
