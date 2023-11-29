import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../main.types";
import { RootState } from "../store/store";

// User API:
export const createUserApi = (baseUrl: string) =>
  createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/users`,
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
      createUser: builder.mutation<User, User>({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
        }),
      }),
      updateUser: builder.mutation<User, { id: string; body: User }>({
        query: ({ id, body }) => ({
          body,
          method: "POST",
          url: `/${id}`,
        }),
      }),
      getUser: builder.query<User, string>({
        query: (id) => `/${id}`,
      }),
      getAllUsers: builder.query<User, { page: string; limit: string }>({
        query: ({ page, limit }) => `/?page=${page}&limit=${limit}`,
      }),
      patchUser: builder.mutation<User, { id: string; body: Partial<User> }>({
        query: ({ id, body }) => ({
          body,
          method: "PATCH",
          url: `/${id}`,
        }),
      }),
      deleteUser: builder.mutation<User, string>({
        query: (id) => ({
          method: "DELETE",
          url: `/${id}`,
        }),
      }),
    }),
  });
