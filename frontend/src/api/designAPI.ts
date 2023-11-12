import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Design } from "../main.types";

// Design API:
export const createDesignApi = (baseUrl: string) =>
  createApi({
    reducerPath: "designApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/designs`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      createDesign: builder.mutation<Design, Design>({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
        }),
      }),
      getDesign: builder.query<Design, string>({
        query: (id) => `/${id}`,
      }),
      deleteDesign: builder.mutation<Design, string>({
        query: (id) => ({
          method: "DELETE",
          url: `/${id}`,
        }),
      }),
    }),
  });
