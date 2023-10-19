import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../main.types';
import { IdResponse } from './api.types';

// User API:
export const createUserApi = (baseUrl : string) => (
  createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/users`,
      credentials: 'include',
    }),
    endpoints: (builder) => ({
      createUser: builder.mutation<IdResponse, User>({
        query: (body) => ({
          body,
          method: 'POST',
          url: ''
        })
      }),
      updateUser: builder.mutation<IdResponse, { id: string, body: User }>({
        query: ({ id, body }) => ({
          body,
          method: 'POST',
          url: `/${id}`,
        })
      }),
      getUser: builder.query<User, string>({
        query: (id) => `/${id}`,
      }),
      getAllUsers: builder.query<User, { page: string, limit: string }>({
        query: ({ page, limit }) => `/?page=${page}&limit=${limit}`,
      }),
      patchUser: builder.mutation<IdResponse, { id: string, body: Partial<User> }>({
        query: ({ id, body }) => ({
          body,
          method: 'PATCH',
          url: `/${id}`,
        })
      }),
      deleteUser: builder.mutation<IdResponse, string>({
        query: (id) => ({
          method: 'DELETE',
          url: `/${id}`,
        })
      }),
    }),
  })
)
