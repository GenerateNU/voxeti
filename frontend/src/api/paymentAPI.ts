import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// payment API:
export const createPaymentApi = (baseUrl: string) =>
  createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/payment`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      createPayment: builder.mutation({
        query: () => ({
          method: "POST",
          url: "/checkout-session",
        }),
      }),
    }),
  });
