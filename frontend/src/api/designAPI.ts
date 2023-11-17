import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Design } from "../main.types";
import { RootState } from "../store/store";

// Design API:
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
