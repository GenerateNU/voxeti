import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserCredentials } from "./api.types";
import { UserSliceState } from "../store/store.types";
import { RootState } from "../store/store";

// Auth API:
export const createAuthApi = (baseUrl: string) =>
  createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/auth`,
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).user.csrfToken;
        if (token) {
          headers.set("Csrftoken", token);
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
      login: builder.mutation<UserSliceState, UserCredentials>({
        query: (body) => ({
          body,
          method: "POST",
          url: "/login",
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          method: "POST",
          url: "/logout",
        }),
      }),
      googleSSO: builder.mutation<UserSliceState, string>({
        query: (accessToken) => ({
          body: { accessToken },
          method: "POST",
          url: "/google-provider",
        }),
      }),
      authenticate: builder.query({
        query: () => ({
          method: "POST",
          url: "/authenticate",
        }),
      }),
    }),
  });
