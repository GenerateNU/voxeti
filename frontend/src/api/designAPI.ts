import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Design } from "../main.types";
import { RootState } from "../store/store";

export const createDesignApi = (baseUrl: string) =>
  createApi({
    reducerPath: "designApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/designs`,
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).user.csrfToken
        if (token) {
          headers.set("Csrftoken", token)
        }
        return headers
      }
    }),
    endpoints: (builder) => ({
      uploadDesign: builder.mutation<Design[], FormData>({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
          formData: true,
        }),
      }),
      getDesign: builder.query<Design, string>({
        query: (designId) => ({
          method: "GET",
          url: `/${designId}`,
        }),
      }),
      getFile: builder.query<Blob, string>({
        query: (designId) => ({
          method: "GET",
          url: `/${designId}`,
          responseHandler: (response) => response.blob(),
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
