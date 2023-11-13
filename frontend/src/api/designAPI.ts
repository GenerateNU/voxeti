import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Design } from "../main.types";

export const createDesignApi = (baseUrl: string) =>
  createApi({
    reducerPath: "designApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/designs`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      uploadDesign: builder.mutation<Design[], FormData>({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
          formData: true
        }),
      }),
      getDesign: builder.mutation<Design, string>({
        query: (designId) => ({
          method: "GET",
          url: `/${designId}`,
        }),
      }),
      deleteDesign: builder.mutation<void, string>({
        query: (designId) => ({
          method: "DELETE",
          url: `/${designId}`,
        }),
      }),
    }),
  });